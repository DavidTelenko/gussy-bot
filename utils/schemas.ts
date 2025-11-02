import { z } from 'zod';

export const commaSeparatedArray = z
  .string()
  .transform((value) =>
    value.split(',').map((value) => Number.parseInt(value.trim(), 10)),
  )
  .superRefine((value, context) => {
    if (value.find(Number.isNaN) === undefined) {
      return;
    }
    context.addIssue({
      code: 'invalid_type',
      expected: 'number',
      message: `${value} contains NaN`,
    });
  });
