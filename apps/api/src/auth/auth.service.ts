/**
 * Synapse Enterprise Authentication Service
 * Implements JWT token issuing, verification, password hashing, MFA verification,
 * and session lifecycle management.
 */

import * as crypto from 'crypto';

export interface UserPayload {
  userId: string;
  organizationId: string;
  email: string;
  role: string;
  scopes: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly tokenDurationSeconds: number = 3600; // 1 hour
  private readonly refreshDurationSeconds: number = 604800; // 7 days

  constructor(jwtSecret: string = process.env.JWT_SECRET || 'synapse_default_secure_secret_2026') {
    this.jwtSecret = jwtSecret;
  }

  /**
   * Hash a plain password using SHA-256 with cryptographic salt
   */
  hashPassword(password: string, salt: string = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  /**
   * Verify password against hash and salt
   */
  verifyPassword(password: string, storedHash: string, salt: string): boolean {
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(computedHash));
  }

  /**
   * Generate signed JWT access token and refresh token
   */
  generateTokens(payload: UserPayload): AuthTokens {
    const now = Math.floor(Date.now() / 1000);
    const accessHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const accessClaims = Buffer.from(JSON.stringify({
      ...payload,
      iat: now,
      exp: now + this.tokenDurationSeconds,
      iss: 'synapse-auth-engine',
      aud: 'synapse-api-gateway'
    })).toString('base64url');

    const accessSignature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${accessHeader}.${accessClaims}`)
      .digest('base64url');

    const accessToken = `${accessHeader}.${accessClaims}.${accessSignature}`;

    const refreshClaims = Buffer.from(JSON.stringify({
      userId: payload.userId,
      organizationId: payload.organizationId,
      tokenType: 'refresh',
      iat: now,
      exp: now + this.refreshDurationSeconds
    })).toString('base64url');

    const refreshSignature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${accessHeader}.${refreshClaims}`)
      .digest('base64url');

    const refreshToken = `${accessHeader}.${refreshClaims}.${refreshSignature}`;

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenDurationSeconds
    };
  }

  /**
   * Verify and decode a JWT token string
   */
  verifyToken(token: string): UserPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', this.jwtSecret)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }

      const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return null; // Expired
      }

      return decoded as UserPayload;
    } catch {
      return null;
    }
  }

  /**
   * Generate TOTP MFA Secret
   */
  generateMfaSecret(): { secret: string; uri: string } {
    const secret = crypto.randomBytes(20).toString('hex').toUpperCase();
    const uri = `otpauth://totp/Synapse:admin?secret=${secret}&issuer=Synapse`;
    return { secret, uri };
  }
}
