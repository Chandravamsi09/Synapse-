/**
 * Synapse Real-Time Telemetry & Metric Timeseries Aggregation Engine
 */

export interface MetricSample {
  apiId: string;
  endpointId?: string;
  statusCode: number;
  latencyMs: number;
  bytesReceived: number;
  bytesSent: number;
  timestamp: number;
  clientCountry?: string;
}

export interface MetricSummary {
  totalRequests: number;
  successCount: number;
  clientErrorCount: number;
  serverErrorCount: number;
  availabilityPercentage: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p99LatencyMs: number;
  totalBytes: number;
}

export class TelemetryAggregatorService {
  private samples: MetricSample[] = [];

  recordSample(sample: MetricSample) {
    this.samples.push(sample);
    // Keep max 50,000 samples in active memory window
    if (this.samples.length > 50000) {
      this.samples.shift();
    }
  }

  getSummary(apiId?: string, timeWindowMinutes: number = 60): MetricSummary {
    const cutoff = Date.now() - (timeWindowMinutes * 60 * 1000);
    const filtered = this.samples.filter(s => {
      if (s.timestamp < cutoff) return false;
      if (apiId && s.apiId !== apiId) return false;
      return true;
    });

    if (filtered.length === 0) {
      return {
        totalRequests: 0,
        successCount: 0,
        clientErrorCount: 0,
        serverErrorCount: 0,
        availabilityPercentage: 100.0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p90LatencyMs: 0,
        p99LatencyMs: 0,
        totalBytes: 0
      };
    }

    let successCount = 0;
    let clientErrorCount = 0;
    let serverErrorCount = 0;
    let totalLatency = 0;
    let totalBytes = 0;

    const latencies: number[] = [];

    for (const s of filtered) {
      if (s.statusCode >= 200 && s.statusCode < 400) successCount++;
      else if (s.statusCode >= 400 && s.statusCode < 500) clientErrorCount++;
      else if (s.statusCode >= 500) serverErrorCount++;

      totalLatency += s.latencyMs;
      totalBytes += (s.bytesReceived + s.bytesSent);
      latencies.push(s.latencyMs);
    }

    latencies.sort((a, b) => a - b);

    const p50Index = Math.floor(latencies.length * 0.5);
    const p90Index = Math.floor(latencies.length * 0.9);
    const p99Index = Math.floor(latencies.length * 0.99);

    const totalRequests = filtered.length;
    const availabilityPercentage = ((totalRequests - serverErrorCount) / totalRequests) * 100;

    return {
      totalRequests,
      successCount,
      clientErrorCount,
      serverErrorCount,
      availabilityPercentage: parseFloat(availabilityPercentage.toFixed(2)),
      avgLatencyMs: parseFloat((totalLatency / totalRequests).toFixed(2)),
      p50LatencyMs: latencies[p50Index] || 0,
      p90LatencyMs: latencies[p90Index] || 0,
      p99LatencyMs: latencies[p99Index] || 0,
      totalBytes
    };
  }

  getTimeseriesBuckets(apiId?: string, bucketCount: number = 24): Array<{ timestamp: string; count: number; avgLatency: number; errors: number }> {
    const buckets: Array<{ timestamp: string; count: number; avgLatency: number; errors: number }> = [];
    const now = Date.now();
    const interval = (60 * 60 * 1000); // 1 hour per bucket

    for (let i = bucketCount - 1; i >= 0; i--) {
      const start = now - (i * interval);
      const end = start + interval;
      const bucketSamples = this.samples.filter(s => s.timestamp >= start && s.timestamp < end && (!apiId || s.apiId === apiId));

      const count = bucketSamples.length;
      const errors = bucketSamples.filter(s => s.statusCode >= 400).length;
      const avgLatency = count > 0 ? bucketSamples.reduce((acc, s) => acc + s.latencyMs, 0) / count : 0;

      buckets.push({
        timestamp: new Date(start).toISOString().substring(11, 16),
        count,
        avgLatency: Math.round(avgLatency),
        errors
      });
    }

    return buckets;
  }
}
