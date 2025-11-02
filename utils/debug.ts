/**
 * Dirty debugging pass-through helper
 *
 * @param value Any console log-able value
 * @param log consumer for value
 *
 * @example
 * This will print the return value of `getSomeValue()`, at the same time returning it and assigning to the `value`.
 * ```typescript
 * const value = debug(getSomeValue())
 * ```
 */
export const debug = <T>(
  value: T,
  log: (argument: T) => void = console.log.bind(console),
): T => {
  log(value);
  return value;
};
