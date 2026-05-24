import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { uploadFile } from '../controllers/storage.controller.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

const uploadDir = './.tmp_uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

router.post('/upload', authenticateJWT, upload.single('file'), uploadFile);

export default router;
