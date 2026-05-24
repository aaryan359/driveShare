import { Response, NextFunction } from 'express';
import { prisma } from '@repo/database';
import bcrypt from 'bcryptjs';
import { AuthRequest } from './auth.js';


/**
 * Middleware: Authenticates storage project keys (x-project-access-key-id & x-project-secret-key)
 * and verifies that the project belongs to the currently logged-in user.
 */
export async function authenticateProjectKey(req: AuthRequest, res: Response, next: NextFunction) {
  const accessKeyId = req.headers['x-project-access-key-id'] as string;
  const secretKey = req.headers['x-project-secret-key'] as string;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      error: 'Unauthorized: User authentication is required before verifying project credentials'
    });
  }

  if (!accessKeyId || !secretKey) {
    return res.status(401).json({
      error: 'Unauthorized: Project API credentials missing in headers (x-project-access-key-id, x-project-secret-key)'
    });
  }

  try {
    // 1. Fetch project by unique accessKeyId
    const project = await prisma.customerProject.findUnique({
      where: { accessKeyId }
    });

    if (!project || !project.isActive) {
      return res.status(403).json({ error: 'Forbidden: Invalid or inactive project credentials' });
    }

    // 2. Cross-verify user ownership to prevent cross-tenant credential hijacking
    if (project.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: Project credentials do not belong to the authenticated user account' });
    }

    // 3. Validate hashed secretAccessKey
    const isValidSecret = await bcrypt.compare(secretKey, project.secretAccessKeyHash);
    if (!isValidSecret) {
      return res.status(403).json({ error: 'Forbidden: Invalid project credentials' });
    }

    // 4. Inject context
    req.projectId = project.id;
    req.project = project;

    next();
  } catch (err: any) {
    console.error('[-] Project API key verification error:', err.message);
    return res.status(500).json({ error: 'Internal server error verifying API credentials' });
  }
}
