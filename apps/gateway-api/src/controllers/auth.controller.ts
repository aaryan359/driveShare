import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'driveshare_secret_key_2026';

/**
 * Controller: Register or Login a user (Passwordless Email Flow)
 */
export async function normalLogin(req: Request, res: Response) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    let user = await prisma.userAccount.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.userAccount.create({
        data: {
          email,
          name: name || email.split('@')[0],
        }
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err: any) {
    console.error('[-] Login error:', err.message);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

/**
 * Controller: Google OAuth verified signup & sign-in
 */
export async function googleLogin(req: Request, res: Response) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google email is required' });
  }

  try {
    const user = await prisma.userAccount.upsert({
      where: { email },
      update: { name: name || email.split('@')[0] },
      create: {
        email,
        name: name || email.split('@')[0],
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, isGoogleAuth: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (err: any) {
    console.error('[-] Google login error:', err.message);
    return res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
}


