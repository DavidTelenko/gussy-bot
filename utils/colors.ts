export type ColorTransformer = (input: string) => string;

const colorize = (color: number): ColorTransformer =>
  process.env.DISABLE_COLOR
    ? (value: string) => value
    : (value: string) => `\u001B[${color}m${value}\u001B[0m`;

export const red = colorize(31);
export const green = colorize(32);
export const yellow = colorize(33);
export const blue = colorize(34);
export const purple = colorize(35);
export const cyan = colorize(36);
export const grey = colorize(37);
