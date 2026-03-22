import Redis from "ioredis";

let redisClient: Redis | null = null;

const isTLS = process.env.NODE_ENV === "production";

export function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: isTLS ? {} : undefined,
    maxRetriesPerRequest: null, // Required for BullMQ
    lazyConnect: true,
  });

  redisClient.on("connect", () => console.log("✅ Redis connected"));
  redisClient.on("error", (err) => console.error("❌ Redis error:", err));

  return redisClient;
}

// Separate connection factory for BullMQ (needs its own connection)
export function createRedisConnection(): Redis {
  return new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: isTLS ? {} : undefined,
    maxRetriesPerRequest: null,
  });
}
