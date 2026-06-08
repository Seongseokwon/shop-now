const ipTimestamps = new Map<string, number[]>();

/**
 * Sliding window rate limiter.
 * Returns true if the request is allowed, false if rate limit exceeded.
 */
export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const prev = ipTimestamps.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < windowMs);

  if (recent.length >= limit) return false;

  recent.push(now);
  ipTimestamps.set(ip, recent);
  return true;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
