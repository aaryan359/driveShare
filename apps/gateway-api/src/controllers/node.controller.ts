import { WebSocket } from 'ws';
import { prisma } from '@repo/database';
import { IncomingMessage } from 'http';
import { Request, Response } from 'express';
import { EventEmitter } from 'events';

// Event emitter to capture and dispatch Go daemon storage confirmations
export const receiptEvents = new EventEmitter();

/**
 * Thread-safe DePIN Active Node Memory Registry
 * Houses live TCP Socket connections for all student laptops (e.g. your friends' laptops)
 */
export class NodeRegistry {
  private static activeNodes = new Map<string, WebSocket>();

  // Track new active websocket connection
  public static add(nodeId: string, ws: WebSocket) {
    this.activeNodes.set(nodeId, ws);
  }

  // Evict closed/offline socket
  public static remove(nodeId: string) {
    this.activeNodes.delete(nodeId);
  }

  // Get active socket pipe
  public static get(nodeId: string): WebSocket | undefined {
    return this.activeNodes.get(nodeId);
  }

  // Check socket connectivity state
  public static isConnected(nodeId: string): boolean {
    return this.activeNodes.has(nodeId);
  }

  // Get list of connected peers
  public static getActiveNodeIds(): string[] {
    return Array.from(this.activeNodes.keys());
  }
}

/**
 * REST Endpoint: Fetch active and registered nodes with live connectivity indicators
 */
export async function getNodes(req: Request, res: Response) {
  try {
    const nodes = await prisma.providerNode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const serializedNodes = nodes.map(node => ({
      ...node,
      allocatedSpaceBytes: node.allocatedSpaceBytes.toString(),
      usedSpaceBytes: node.usedSpaceBytes.toString(),
      withheldEscrowINR: node.withheldEscrowINR.toString(),
      payableBalanceINR: node.payableBalanceINR.toString(),
      isLiveSocket: NodeRegistry.isConnected(node.id) // True if your friend is currently connected via socket!
    }));

    return res.json(serializedNodes);
  } catch (err: any) {
    console.error('[-] Error fetching node registry:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve active provider nodes' });
  }
}

/**
 * WebSocket Connection Handler: Manages handshakes, telemetry, heartbeats, and peer disconnection
 */
export async function handleNodeConnection(ws: WebSocket, request: IncomingMessage) {
  const nodeId = request.headers['x-node-id'] as string;
  const upiId = request.headers['x-upi-id'] as string;
  const spaceGb = parseInt(request.headers['x-allocated-space-gb'] as string || '50', 10);
  const ipAddress = (request.headers['x-forwarded-for'] as string || request.socket.remoteAddress || '').split(',')[0];

  if (!nodeId || !upiId) {
    ws.close(4001, 'Auth Error: Missing connection handshake headers (x-node-id, x-upi-id)');
    return;
  }

  console.log(` [Node Registry] DePIN Peer Linked: Node ${nodeId} [UPI: ${upiId}] [Space: ${spaceGb} GB] [IP: ${ipAddress}]`);

  // Store active socket in Registry
  NodeRegistry.add(nodeId, ws);

  const allocatedBytes = BigInt(spaceGb) * BigInt(1024 * 1024 * 1024);

  try {
    // Record node registration in PostgreSQL container
    await prisma.providerNode.upsert({
      where: { id: nodeId },
      update: {
        upiId,
        ipAddress,
        status: 'ONLINE',
        allocatedSpaceBytes: allocatedBytes,
        lastSeenHeartbeat: new Date()
      },
      create: {
        id: nodeId,
        upiId,
        ipAddress,
        clientVersion: 'v1.0.0-go',
        status: 'ONLINE',
        allocatedSpaceBytes: allocatedBytes,
        lastSeenHeartbeat: new Date()
      }
    });
  } catch (err: any) {
    console.error(`[-] Upsert node database sync error:`, err.message);
  }

  // Handle incoming packets from active client
  ws.on('message', async (message) => {
    try {
      const payload = JSON.parse(message.toString());

      if (payload.type === 'HEARTBEAT') {
        const usedBytes = BigInt(payload.usedSpaceBytes || 0);

        // Update database logs with latest telemetry
        await prisma.providerNode.update({
          where: { id: nodeId },
          data: {
            status: payload.isFull ? 'FULL' : 'ONLINE',
            usedSpaceBytes: usedBytes,
            lastSeenHeartbeat: new Date()
          }
        });
        console.log(`Pulse: Node ${nodeId} | Used: ${(Number(usedBytes) / (1024 * 1024 * 1024)).toFixed(2)} GB | Full: ${payload.isFull}`);
      } else if (payload.shardId || payload.shardID) {
        // Intercept receipt confirmations
        const shardKey = payload.shardId || payload.shardID;
        receiptEvents.emit(`receipt:${shardKey}`, payload);
      }
    } catch (err: any) {
      console.error(`[-] Error handling node message payload:`, err.message);
    }
  });

  // Handle closed connections
  ws.on('close', async () => {
    console.log(`DePIN peer disconnected: ${nodeId}`);
    NodeRegistry.remove(nodeId);

    try {
      await prisma.providerNode.update({
        where: { id: nodeId },
        data: { status: 'OFFLINE' }
      });
    } catch (err: any) {
      console.error(`[-] Error logging node close session:`, err.message);
    }
  });
}
