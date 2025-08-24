import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number(),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  RESEND_API_KEY: z.string(),
  BASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
