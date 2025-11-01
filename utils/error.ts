export type OkType<T> = {
  data: T;
  error?: never;
  ok: true;
};

export type ErrorType<E extends Error = Error> = {
  data?: never;
  error: E;
  ok: false;
};

/**
 * Discriminated union of `Ok` or `Err` types
 */
export type Result<T, E extends Error = Error> = OkType<T> | ErrorType<E>;

export type GetOptions = {
  /**
   * Error message to provide in wrapped `Error`
   */
  errorMessage?: string;
};

/**
 * Helper for creation of `Ok` type.
 *
 * @param data wrapped data
 * @returns `Ok` type where `error` is `null` and `data` is present
 */
export const ok = <T>(data: T): OkType<T> => ({
  data,
  ok: true,
});

/**
 * Helper for creation of `Err` type.
 *
 * @param error any error which extends from `Error`
 * @returns `Err` type where `data` is `null` and `error` is present
 */
export const error = <E extends Error>(error: E): ErrorType<E> => ({
  error,
  ok: false,
});

/**
 * @param value Any value that can be undefined or null
 * @param options You can leave the comment here
 * @throws
 * @returns Definite value
 */
export const getOrThrow = <T>(
  value: T | null | undefined,
  options?: GetOptions,
) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  throw new Error(options?.errorMessage ?? 'Value cannot be null or undefined');
};

/**
 * @param value Any value that can be undefined or null
 * @param options You can leave the error message
 * @returns Result value either data or error null
 */
export const getOrError = <T>(
  value: T | null | undefined,
  options?: GetOptions,
) => {
  if (value !== null && value !== undefined) {
    return ok(value);
  }
  return error(
    new Error(options?.errorMessage ?? 'Value cannot be null or undefined'),
  );
};

/**
 * Safely get any async value, if data awaiting throws, returns {@link Result} with
 * error set, otherwise returns it with data set
 *
 * @param value data that may throw
 */
export const safeGetAsync = async <T, E extends Error = Error>(
  value: Promise<T> | T,
) => {
  try {
    return ok(await value);
  } catch (caughtError) {
    return error(caughtError as E);
  }
};

/**
 * Safely evaluate any sync expression, if expression throws, returns {@link Result} with
 * error set, otherwise returns it with data set
 *
 * @param expression expression that may throw
 */
export const safeEval = <T, E extends Error = Error>(
  expression: () => T,
): Result<T, E> => {
  try {
    return ok(expression());
  } catch (caughtError) {
    return error(caughtError as E);
  }
};

/**
 * Safely evaluate any async expression, if expression throws, returns promise to {@link Result} with
 * error set, otherwise returns it with data set
 *
 * @param expression async expression that may throw
 */
export const safeEvalAsync = async <T, E extends Error = Error>(
  expression: () => Promise<T>,
): Promise<Result<T, E>> => {
  try {
    return ok(await expression());
  } catch (error_) {
    return error(error_ as E);
  }
};
