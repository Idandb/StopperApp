import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as jose from 'jose';

// Apple's public keys endpoint
const APPLE_KEYS_URL = 'https://appleid.apple.com/auth/keys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identityToken } = req.body;
  if (!identityToken) {
    return res.status(400).json({ error: 'identityToken is required' });
  }

  try {
    const JWKS = jose.createRemoteJWKSet(new URL(APPLE_KEYS_URL));
    const { payload } = await jose.jwtVerify(identityToken, JWKS, {
      issuer: 'https://appleid.apple.com',
      audience: process.env.APPLE_BUNDLE_ID,
    });

    // Create a simple session token (no DB needed)
    const sessionToken = await new jose.SignJWT({ sub: payload.sub })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    return res.status(200).json({ token: sessionToken });
  } catch {
    return res.status(401).json({ error: 'Invalid Apple token' });
  }
}
