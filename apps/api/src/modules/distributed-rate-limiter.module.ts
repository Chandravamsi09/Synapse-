/**
 * Synapse Module: Distributed Sliding Rate Limiter
 */
export class DistributedRateLimiterModule {
  public static calculateAllowed(capacity: number, count: number): { allowed: boolean; remaining: number } {
    const remaining = Math.max(0, capacity - count);
    return { allowed: remaining > 0, remaining };
  }
}
