/**
 * Synapse Webhook Dispatcher with HMAC SHA-256 Signatures and Jittered Exponential Backoff
 */

import * as crypto from 'crypto';

export interface WebhookPayload {
  id: string;
  eventType: string;
  data: any;
  timestamp: string;
}

export interface DispatchResult {
  attempt: number;
  statusCode: number;
  success: boolean;
  error?: string;
  signature: string;
  latencyMs: number;
}

export class WebhookDispatcherService {
  /**
   * Generate RFC-standard HMAC-SHA256 signature for payload verification
   */
  generateSignature(payload: string, secretKey: string, timestamp: number): string {
    const signaturePayload = `t=${timestamp},v1=${payload}`;
    const hash = crypto.createHmac('sha256', secretKey).update(signaturePayload).digest('hex');
    return `t=${timestamp},v1=${hash}`;
  }

  /**
   * Verify an incoming webhook signature against the secret
   */
  verifySignature(payload: string, signatureHeader: string, secretKey: string, toleranceSeconds: number = 300): boolean {
    try {
      const parts = signatureHeader.split(',');
      let timestamp = 0;
      let signature = '';

      for (const part of parts) {
        const [k, v] = part.split('=');
        if (k === 't') timestamp = parseInt(v, 10);
        if (k === 'v1') signature = v;
      }

      if (!timestamp || !signature) return false;

      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestamp) > toleranceSeconds) {
        return false; // Signature expired or future clock skew
      }

      const expectedSignaturePayload = `t=${timestamp},v1=${payload}`;
      const expectedHash = crypto.createHmac('sha256', secretKey).update(expectedSignaturePayload).digest('hex');

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHash));
    } catch {
      return false;
    }
  }

  /**
   * Compute exponential backoff delay with random jitter
   */
  calculateBackoffMs(attempt: number, baseDelayMs: number = 1000, factor: number = 2.0, maxDelayMs: number = 60000): number {
    const exponential = baseDelayMs * Math.pow(factor, attempt - 1);
    const capped = Math.min(exponential, maxDelayMs);
    // Add 10-25% jitter to prevent thundering herd
    const jitter = capped * (0.1 + Math.random() * 0.15);
    return Math.floor(capped + jitter);
  }

  /**
   * Dispatch webhook event to subscriber URL
   */
  async dispatchEvent(targetUrl: string, event: WebhookPayload, secretKey: string, attempt: number = 1): Promise<DispatchResult> {
    const startTime = Date.now();
    const rawPayload = JSON.stringify(event);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.generateSignature(rawPayload, secretKey, timestamp);

    // Mock HTTP delivery simulation
    const simulatedLatency = Math.floor(Math.random() * 30) + 15;
    const isSuccess = !targetUrl.includes('fail');

    return {
      attempt,
      statusCode: isSuccess ? 200 : 503,
      success: isSuccess,
      error: isSuccess ? undefined : 'Target webhook endpoint responded with HTTP 503 Service Unavailable',
      signature,
      latencyMs: simulatedLatency + (Date.now() - startTime)
    };
  }
}
