/**
 * Synapse Adaptive High-Throughput Token Bucket & Sliding Window Rate Limiter
 */

export interface RateLimitConfig {
  capacity: number;       // Max tokens in bucket
  refillRatePerSec: number; // Tokens added per second
  windowSeconds?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
  resetSeconds: number;
  totalLimit: number;
}

export class RateLimiterService {
  private buckets: Map<string, { tokens: number; lastRefillMs: number }> = new Map();
  private slidingWindows: Map<string, number[]> = new Map();

  /**
   * Token Bucket Algorithm
   */
  checkTokenBucket(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: config.capacity, lastRefillMs: now };
      this.buckets.set(key, bucket);
    } else {
      // Calculate token refill based on elapsed time
      const elapsedSeconds = (now - bucket.lastRefillMs) / 1000;
      const tokensToAdd = elapsedSeconds * config.refillRatePerSec;
      bucket.tokens = Math.min(config.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefillMs = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remainingTokens: Math.floor(bucket.tokens),
        resetSeconds: Math.ceil((config.capacity - bucket.tokens) / config.refillRatePerSec),
        totalLimit: config.capacity
      };
    } else {
      return {
        allowed: false,
        remainingTokens: 0,
        resetSeconds: Math.ceil(1 / config.refillRatePerSec),
        totalLimit: config.capacity
      };
    }
  }

  /**
   * Sliding Window Log Algorithm (Exact request counting)
   */
  checkSlidingWindow(key: string, maxRequests: number, windowSeconds: number): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const cutoff = now - windowMs;

    let timestamps = this.slidingWindows.get(key) || [];
    // Discard timestamps older than the sliding window
    timestamps = timestamps.filter(ts => ts > cutoff);

    if (timestamps.length < maxRequests) {
      timestamps.push(now);
      this.slidingWindows.set(key, timestamps);
      return {
        allowed: true,
        remainingTokens: maxRequests - timestamps.length,
        resetSeconds: windowSeconds,
        totalLimit: maxRequests
      };
    } else {
      const oldest = timestamps[0];
      const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
      return {
        allowed: false,
        remainingTokens: 0,
        resetSeconds: Math.max(1, resetSeconds),
        totalLimit: maxRequests
      };
    }
  }

  reset(key: string) {
    this.buckets.delete(key);
    this.slidingWindows.delete(key);
  }
}
