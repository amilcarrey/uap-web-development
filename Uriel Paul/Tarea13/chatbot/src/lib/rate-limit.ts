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
  private readonly hits = new Map<string, { remaining: number; resetAt: number }>();

  constructor(private readonly options: RateLimiterOptions) {}

  touch(key: string): RateLimitResult {
    const now = Date.now();
    const windowMs = Math.max(this.options.windowMs, 1);
    const max = Math.max(this.options.max, 1);

    let entry = this.hits.get(key);

    if (!entry || now >= entry.resetAt) {
      entry = { remaining: max, resetAt: now + windowMs };
    }

    if (entry.remaining <= 0) {
      this.hits.set(key, entry);
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.remaining -= 1;
    this.hits.set(key, entry);

    return { allowed: true, remaining: entry.remaining, resetAt: entry.resetAt };
  }

  reset(key?: string): void {
    if (typeof key === 'string') {
      this.hits.delete(key);
      return;
    }

    this.hits.clear();
  }
}
