import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import credentialRoutes from './routes/keys.js';
import storageRoutes from './routes/storage.js';
import nodeRoutes from './routes/nodes.js';
import { handleNodeConnection } from './controllers/node.controller.js';

const app = express();
const httpServer = createServer(app);

const port = parseInt(process.env.PORT || '3002', 10);

app.use(express.json());

// Bind HTTP routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', credentialRoutes);
app.use('/api/v1', storageRoutes);
app.use('/api/v1', nodeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date() });
});


// Initialize WebSocket server for DePIN peer link management
const wss = new WebSocketServer({ noServer: true });

// Intercept HTTP Upgrade requests for WebSocket paths
httpServer.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  if (url.pathname === '/v1/node/connect') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// WebSocket Connection Lifecycle dispatches directly to controller logic
wss.on('connection', handleNodeConnection);

httpServer.listen(port, () => {
  console.log(` Gateway Master Coordination Server running on http://localhost:${port}`);
});
