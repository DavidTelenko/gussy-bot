import fs from 'node:fs';
import z from 'zod';
import { cyan, green } from './colors.js';
import { safeEval } from './error.js';

const environmentFileRepresentation = green('.env');

export type EnvSetupOptions<I, O> = {
  /**
   * .env file to parse
   */
  path: string;

  /**
   * Schema of expected env shape and type
   */
  schema: z.Schema<O, I>;
};

/**
 * Dynamically load environment from `.env` file, validating it with provided
 * `zod` scheme, if `.env` file is not present (CI environment), doesn't bail,
 * attempting to validate `process.env` either way
 */
export const loadEnv = <I, O>({ path, schema }: EnvSetupOptions<I, O>) => {
  loadFromFile(path);

  const { data: parsedEnvironment, error: parseError } = schema.safeParse(
    process.env,
  );

  if (!parseError) {
    console.log('[env] > environment variables loaded and validated!');

    process.env = {
      ...process.env,
      ...parsedEnvironment,
    };

    return process.env;
  }

  console.error(
    `\n[env] > ${environmentFileRepresentation} file validation error!\n\n`,
    z.prettifyError(parseError),
  );

  process.exit(1);
};

const loadFromFile = (path: string) => {
  if (!fs.existsSync(path)) {
    return console.warn(
      `[env] > ${environmentFileRepresentation} file is not present, attempting to parse ${cyan('process.env')} as is`,
    );
  }

  const { error: loadError } = safeEval(() => process.loadEnvFile(path));

  if (loadError) {
    console.error(loadError.message);
    process.exit(1);
  }
};
