import { Router } from 'express';
import { getNodes } from '../controllers/node.controller.js';

const router = Router();

router.get('/nodes', getNodes);

export default router;
