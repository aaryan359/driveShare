import { Router } from 'express';
import { createProject, getProjects } from '../controllers/keys.controller.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

router.post('/projects', authenticateJWT, createProject);
router.get('/projects', authenticateJWT, getProjects);

export default router;
