import { env } from "@/infra/env";

export const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
} as const;
