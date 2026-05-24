import { Response } from 'express';
import { prisma } from '@repo/database';
import fs from 'fs';
import { AuthRequest } from '../middlewares/auth.js';
import { compress, encrypt } from '../utils/crypto.js';
import { NodeRegistry, receiptEvents } from './node.controller.js';

const CHUNK_WINDOW_SIZE = 20 * 1024 * 1024; // Strict 20 MB sliding window memory cap

// Helper: Pack metadata and shard payload bytes into binary format
export function packShard(shardId: string, shardBytes: Buffer): Buffer {
  const idBytes = Buffer.from(shardId, 'utf-8');
  const header = Buffer.alloc(4);
  header.writeUInt32BE(idBytes.length, 0);
  return Buffer.concat([header, idBytes, shardBytes]);
}

// Helper: Linear Parity Erasure Coding (Splits segment into 4 Data & 4 Parity shards)
export function splitAndGenerateParity(buffer: Buffer): Buffer[] {
  const segmentSize = buffer.length;
  const shardSize = Math.ceil(segmentSize / 4);
  const shards: Buffer[] = [];

  // Slice and pad 4 Data Shards
  for (let i = 0; i < 4; i++) {
    const start = i * shardSize;
    const end = Math.min(start + shardSize, segmentSize);
    const chunk = buffer.subarray(start, end);
    
    if (chunk.length === shardSize) {
      shards.push(chunk);
    } else {
      const padded = Buffer.alloc(shardSize);
      chunk.copy(padded);
      shards.push(padded);
    }
  }

  // Create 4 Parity Shards (XOR Equations)
  const p1 = Buffer.alloc(shardSize);
  const p2 = Buffer.alloc(shardSize);
  const p3 = Buffer.alloc(shardSize);
  const p4 = Buffer.alloc(shardSize);

  for (let j = 0; j < shardSize; j++) {
    const d1 = shards[0][j];
    const d2 = shards[1][j];
    const d3 = shards[2][j];
    const d4 = shards[3][j];

    p1[j] = d1 ^ d2;
    p2[j] = d3 ^ d4;
    p3[j] = d1 ^ d3 ^ d4;
    p4[j] = d2 ^ d3 ^ d4;
  }

  shards.push(p1, p2, p3, p4);
  return shards; // Returns exactly 8 shards (4 Data, 4 Parity)
}

// Helper: Wait for Go client receipt verification over WebSocket
function waitForReceipt(shardId: string, timeoutMs = 15000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      receiptEvents.off(`receipt:${shardId}`, onReceipt);
      reject(new Error(`Timeout waiting for receipt of shard ${shardId}`));
    }, timeoutMs);

    const onReceipt = (receipt: any) => {
      clearTimeout(timer);
      resolve(receipt);
    };

    receiptEvents.once(`receipt:${shardId}`, onReceipt);
  });
}

// Async Background Storage Worker Pipeline
async function processAndUploadFileInBackground(
  filePath: string,
  fileName: string,
  fileId: string,
  projectId: string,
  projectSecret: string
) {
  console.log(`🤖 [Background Worker] Initiating sharding pipeline for file: ${fileName}`);
  
  let fd: number | null = null;
  try {
    const stats = fs.statSync(filePath);
    const totalSize = stats.size;
    fd = fs.openSync(filePath, 'r');
    
    let offset = 0;
    let segmentIndex = 0;

    // Retrieve active nodes from the database
    let onlineNodes = await prisma.providerNode.findMany({
      where: { status: { in: ['ONLINE', 'FULL'] } }
    });

    if (onlineNodes.length === 0) {
      throw new Error("No active DePIN storage nodes connected to network. Aborting.");
    }

    while (offset < totalSize) {
      const currentSegmentSize = Math.min(CHUNK_WINDOW_SIZE, totalSize - offset);
      const segmentBuffer = Buffer.alloc(currentSegmentSize);
      fs.readSync(fd, segmentBuffer, 0, currentSegmentSize, offset);

      console.log(`📦 Processing segment ${segmentIndex + 1} (${(currentSegmentSize / (1024*1024)).toFixed(2)} MB sliding buffer)`);

      // 1. Erasure code segment into 4 Data & 4 Parity shards
      const rawShards = splitAndGenerateParity(segmentBuffer);

      // 2. Parallel upload process for the 8 shards in this segment window
      const uploadPromises = rawShards.map(async (shardData, shardIdx) => {
        const shardId = `shard_${fileId}_seg${segmentIndex}_idx${shardIdx}`;
        
        // 3. Compress shard using gzip
        const compressed = await compress(shardData);

        // 4. Encrypt shard using AES-256-GCM
        const { iv, encryptedData, tag } = encrypt(compressed, projectSecret);
        const encryptedBuffer = Buffer.from(encryptedData, 'hex');

        // 5. Attempt upload with automatic failover and up to 3 retries
        let attempts = 0;
        let success = false;
        let assignedNodeId = "";

        while (attempts < 3 && !success) {
          attempts++;
          
          // Re-fetch online nodes from DB to get updated statuses
          const freshOnline = await prisma.providerNode.findMany({
            where: { status: 'ONLINE' }
          });

          if (freshOnline.length === 0) {
            console.error(`[-] No online nodes left for retry of shard ${shardId}`);
            break;
          }

          // Cycle through nodes to distribute shards balanced or cycle if few nodes exist
          const nodeRecord = freshOnline[(shardIdx + attempts - 1) % freshOnline.length];
          const ws = NodeRegistry.get(nodeRecord.id); // Query active memory socket map!

          if (!ws || ws.readyState !== 1) {
            // Node is listed as online but websocket closed: mark offline and cycle
            await prisma.providerNode.update({
              where: { id: nodeRecord.id },
              data: { status: 'OFFLINE' }
            });
            continue;
          }

          assignedNodeId = nodeRecord.id;
          console.log(`➡️ [Attempt ${attempts}] Dispatching shard ${shardId} to Node ${assignedNodeId}`);

          try {
            // Pack custom binary protocol payload
            const packedBuffer = packShard(shardId, encryptedBuffer);
            ws.send(packedBuffer);

            // Await Go verification confirmation receipt
            const receipt = await waitForReceipt(shardId, 10000);
            if (receipt.status === 'SUCCESS_STORED') {
              success = true;
              console.log(`✅ Shard ${shardId} stored successfully on Node ${assignedNodeId}`);
              
              // Register shard allocation record inside database ledger
              await prisma.fileShard.create({
                data: {
                  fileId,
                  nodeId: assignedNodeId,
                  shardIndex: segmentIndex * 8 + shardIdx,
                  shardHash: receipt.hashSignature,
                }
              });

              // Increment node telemetry aggregates in database
              await prisma.providerNode.update({
                where: { id: assignedNodeId },
                data: {
                  usedSpaceBytes: { increment: BigInt(encryptedBuffer.length) }
                }
              });
            } else {
              throw new Error(`Node rejected shard with code: ${receipt.status}`);
            }
          } catch (err: any) {
            console.warn(`⚠️ Dispatch failed on Node ${assignedNodeId}: ${err.message}. Recycling chunk...`);
            // Set node status to OFFLINE to protect other uploads from routing here
            await prisma.providerNode.update({
              where: { id: assignedNodeId },
              data: { status: 'OFFLINE' }
            });
          }
        }

        if (!success) {
          throw new Error(`Critical Failover: Failed to upload Shard ${shardId} after 3 attempts.`);
        }
      });

      // Await all parallel uploads of this segment window to complete before freeing memory
      await Promise.all(uploadPromises);

      offset += currentSegmentSize;
      segmentIndex++;
    }

    // Mark file as fully stored in database once all shards succeed
    await prisma.fileRegistry.update({
      where: { id: fileId },
      data: { providerType: 'DRIVESHARE_NATIVE' } // Native sovereign storage finalized!
    });
    console.log(`🎉 [Background Worker] File successfully uploaded and distributed cleanly! ID: ${fileId}`);
  } catch (err: any) {
    console.error(`[-] Background worker critical error during upload of ${fileId}:`, err.message);
  } finally {
    if (fd !== null) {
      fs.closeSync(fd);
    }
    // Delete temporary file to avoid local disk bloating
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * Controller: Handles file upload stream processing, registers metadata, returns 202 Accepted
 */
export async function uploadFile(req: AuthRequest, res: Response) {
  const file = req.file;
  const projectId = req.body.projectId;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (!projectId) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(400).json({ error: 'projectId is required' });
  }

  try {
    // 1. Verify that the bucket/project exists and belongs to the authenticated user
    const project = await prisma.customerProject.findFirst({
      where: { id: projectId, userId: req.userId! }
    });

    if (!project) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(404).json({ error: 'Target S3 Project bucket not found or unauthorized' });
    }

    // 2. Register file metadata in Prisma ledger
    const fileRecord = await prisma.fileRegistry.create({
      data: {
        projectId,
        fileName: file.originalname,
        sizeBytes: BigInt(file.size),
        mimeType: file.mimetype || 'application/octet-stream',
        providerType: 'PENDING'
      }
    });

    // Increment bucket aggregate telemetry bytes
    await prisma.customerProject.update({
      where: { id: projectId },
      data: {
        currentStorageBytes: { increment: BigInt(file.size) }
      }
    });

    // 3. Dispatch sharding & upload to background thread (sliding window memory cap)
    processAndUploadFileInBackground(
      file.path,
      file.originalname,
      fileRecord.id,
      projectId,
      project.secretAccessKeyHash
    );

    // 4. Respond instantly with 202 Accepted
    return res.status(202).json({
      message: 'File upload accepted and processing background sharding pipeline',
      fileId: fileRecord.id,
      fileName: fileRecord.fileName,
      sizeBytes: file.size.toString(),
      status: 'PROCESSING'
    });
  } catch (err: any) {
    console.error('[-] Upload endpoint error:', err.message);
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(500).json({ error: 'Internal server error during upload initiation' });
  }
}
