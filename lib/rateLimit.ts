import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback for local dev (no Upstash env vars)
const ipTimestamps = new Map<string, number[]>();

function checkInMemory(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const prev = ipTimestamps.get(ip) ?? [];
  const recent = prev.filter((t) => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  ipTimestamps.set(ip, recent);
  return true;
}

let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    prefix: "rl:shopping-gpt",
  });
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!ratelimit) return checkInMemory(ip);
  const { success } = await ratelimit.limit(ip);
  return success;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
