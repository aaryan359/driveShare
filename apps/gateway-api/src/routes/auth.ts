import { Router } from 'express';
import { normalLogin, googleLogin, register } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', normalLogin);
router.post('/google', googleLogin);

export default router;
