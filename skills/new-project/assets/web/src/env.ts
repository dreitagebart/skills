import { z } from 'zod'

// Single entry point for environment variables. Parsing fails at startup when something is missing or malformed.
// Keep only the variables the project really uses; browser variables need the NEXT_PUBLIC_ prefix and live separately.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  APP_URL: z.url().default('http://localhost:3000'),

  // Database (skill `database`)
  DATABASE_URL: z.url(),

  // Authentication (skill `auth`)
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
})

export const env = schema.parse(process.env)
