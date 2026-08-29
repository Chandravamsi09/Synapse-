/**
 * Synapse API Key Generator, Hasher and Rate-Limit Metadata Binder
 */

import * as crypto from 'crypto';

export interface GeneratedApiKey {
  rawKey: string;
  keyPrefix: string;
  hashedSecret: string;
}

export interface ApiKeyMetadata {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  allowedIps: string[];
  requestsPerSec: number;
  burstLimit: number;
  isActive: boolean;
}

export class ApiKeyService {
  private readonly prefixHeader = 'syn_live_';

  /**
   * Create an enterprise-grade random API Key with secure checksum prefix
   */
  createKey(): GeneratedApiKey {
    const randomEntropy = crypto.randomBytes(32).toString('hex');
    const checksum = crypto.createHash('sha256').update(randomEntropy).digest('hex').substring(0, 6);
    const keyPrefix = `${this.prefixHeader}${checksum}`;
    const rawKey = `${keyPrefix}_${randomEntropy}`;
    const hashedSecret = this.hashKeySecret(rawKey);

    return {
      rawKey,
      keyPrefix,
      hashedSecret
    };
  }

  /**
   * Hash API key using SHA-256 for zero-knowledge storage
   */
  hashKeySecret(rawKey: string): string {
    return 'sha256:' + crypto.createHash('sha256').update(rawKey).digest('hex');
  }

  /**
   * Validate key against hash with constant time comparison
   */
  verifyKey(rawKey: string, storedHashedSecret: string): boolean {
    const computed = this.hashKeySecret(rawKey);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(storedHashedSecret));
  }

  /**
   * Check IP Whitelist for incoming API Key requests
   */
  isIpAllowed(clientIp: string, allowedIps: string[]): boolean {
    if (!allowedIps || allowedIps.length === 0 || allowedIps.includes('0.0.0.0/0')) {
      return true;
    }
    return allowedIps.includes(clientIp);
  }
}
