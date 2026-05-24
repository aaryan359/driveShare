import { Router } from 'express';
import { uploadFileInit, uploadFileConfirm, weRTCSignal } from '../controllers/storage.controller.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { authenticateProjectKey } from '../middlewares/projectAuth.js';

const router = Router();

// Zero-Knowledge Client-Side Direct Upload Handshake & WebRTC Proxy Endpoints
router.post('/storage/upload-init', authenticateJWT, authenticateProjectKey, uploadFileInit);
router.post('/storage/upload-confirm', authenticateJWT, authenticateProjectKey, uploadFileConfirm);
router.post('/storage/signal', authenticateJWT, authenticateProjectKey, weRTCSignal);

export default router;
