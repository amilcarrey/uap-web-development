export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

/**
 * Very small in-memory rate limiter suitable for demos/tests.
 * TODO: Replace with a distributed solution when deploying (Redis, Upstash, etc.).
 */
export class InMemoryRateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(private readonly options: RateLimiterOptions) {}

  touch(key: string): RateLimitResult {
    const now = Date.now();
    const windowMs = Math.max(this.options.windowMs, 1);
    const max = Math.max(this.options.max, 1);
    const windowStart = now - windowMs;

    let timestamps = this.hits.get(key) ?? [];

    if (timestamps.length > 0) {
      let firstValidIndex = 0;

      while (firstValidIndex < timestamps.length && timestamps[firstValidIndex] <= windowStart) {
        firstValidIndex += 1;
      }

      if (firstValidIndex > 0) {
        timestamps = timestamps.slice(firstValidIndex);
      }
    }

    if (timestamps.length >= max) {
      const resetAt = timestamps[0] + windowMs;
      this.hits.set(key, timestamps);
      return { allowed: false, remaining: 0, resetAt };
    }

    timestamps = [...timestamps, now];
    this.hits.set(key, timestamps);

    const remaining = Math.max(0, max - timestamps.length);
    const resetAt = timestamps[0] + windowMs;

    return { allowed: true, remaining, resetAt };
  }

  reset(key?: string): void {
    if (typeof key === 'string') {
      this.hits.delete(key);
      return;
    }

    this.hits.clear();
  }
}
