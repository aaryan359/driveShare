import { Router } from 'express';
import { normalLogin, googleLogin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', normalLogin);
router.post('/google', googleLogin);

export default router;
