import crypto from 'crypto';
import zlib from 'zlib';

const ALGORITHM = 'aes-256-gcm';
const IV_LEN = 12;

// High-speed Zlib compression
export function compress(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, compressed) => {
      if (err) reject(err);
      else resolve(compressed);
    });
  });
}

// Decompression
export function decompress(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gunzip(data, (err, decompressed) => {
      if (err) reject(err);
      else resolve(decompressed);
    });
  });
}

// AES-256-GCM encryption with IV and Auth Tag
export function encrypt(data: Buffer, secretKeyString: string): { iv: string; encryptedData: string; tag: string } {
  // Derived 32-byte key from shared system or custom project secret
  const key = crypto.createHash('sha256').update(secretKeyString).digest();
  const iv = crypto.randomBytes(IV_LEN);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
    tag: tag.toString('hex')
  };
}

// AES-256-GCM decryption
export function decrypt(encryptedHex: string, secretKeyString: string, ivHex: string, tagHex: string): Buffer {
  const key = crypto.createHash('sha256').update(secretKeyString).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encryptedData = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
