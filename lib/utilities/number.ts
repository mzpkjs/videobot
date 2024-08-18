export const clamp = (value: number, lower: number = 0, upper: number = 1): number =>
  Math.min(Math.max(value, lower), upper)
