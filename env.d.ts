import type { EnvSchema } from './env.schema.ts';

// Inject env type into `process.env` type

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}
