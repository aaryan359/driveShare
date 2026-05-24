import { Response } from 'express';
import { prisma } from '@repo/database';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth.js';

/**
 * Controller: Register a new storage project and generate raw access/secret credentials
 */
export async function createProject(req: AuthRequest, res: Response) {
  const { name } = req.body;
  const userId = req.userId!;

  if (!name) {
    return res.status(400).json({ error: 'Project/Bucket name is required' });
  }

  try {
    const rawAccessKey = `ds_access_${crypto.randomBytes(8).toString('hex')}`;
    const rawSecretKey = `ds_secret_${crypto.randomBytes(16).toString('hex')}`;

    // Hash the secret access key to protect from plain-text leaks
    const secretHash = await bcrypt.hash(rawSecretKey, 10);

    const project = await prisma.customerProject.create({
      data: {
        userId,
        name,
        accessKeyId: rawAccessKey,
        secretAccessKeyHash: secretHash,
        currentStorageBytes: BigInt(0),
        totalEgressBytes: BigInt(0),
      }
    });

    return res.status(201).json({
      message: 'Project created and credentials generated successfully',
      projectId: project.id,
      projectName: project.name,
      accessKeyId: rawAccessKey,
      secretAccessKey: rawSecretKey,
    });
  } catch (err: any) {
    console.error('[-] Project creation error:', err.message);
    return res.status(500).json({ error: 'Internal server error during project creation' });
  }
}

/**
 * Controller: Retrieve all projects and active buckets belonging to the user
 */
export async function getProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await prisma.customerProject.findMany({
      where: { userId: req.userId! }
    });

    const serializedProjects = projects.map(p => ({
      ...p,
      currentStorageBytes: p.currentStorageBytes.toString(),
      totalEgressBytes: p.totalEgressBytes.toString(),
    }));

    return res.json(serializedProjects);
  } catch (err: any) {
    console.error('[-] Fetch projects error:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve storage projects' });
  }
}
