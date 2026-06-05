import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, RequestHandler } from 'express';

export function createBearerAuth(expectedToken: string): RequestHandler {
  return (req, res, next) => {
    const header = req.header('authorization');
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing bearer token' });
      return;
    }

    const providedToken = header.slice('Bearer '.length).trim();
    const expectedBuffer = Buffer.from(expectedToken);
    const providedBuffer = Buffer.from(providedToken);

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      res.status(401).json({ error: 'Invalid bearer token' });
      return;
    }

    next();
  };
}

export function buildCallerFingerprint(req: Request): string {
  const header = req.header('authorization') ?? '';
  const forwardedFor = req.header('x-forwarded-for') ?? '';
  const remoteAddress = req.ip || req.socket.remoteAddress || '';

  return createHash('sha256')
    .update(`${header}|${forwardedFor}|${remoteAddress}`)
    .digest('hex')
    .slice(0, 16);
}