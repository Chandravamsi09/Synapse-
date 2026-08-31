/**
 * Synapse Module: Webhook DLQ Replay Engine
 */
export class WebhookDlqReplayModule {
  public static computeBackoffDelay(attempt: number, baseMs: number = 1000): number {
    return Math.min(30000, baseMs * Math.pow(2, attempt) + Math.random() * 500);
  }
}
