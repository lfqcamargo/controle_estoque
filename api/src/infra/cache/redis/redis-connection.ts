import { Redis } from "ioredis";
import { redisConfig } from "./config";

export const redisConnection = new Redis(redisConfig);
