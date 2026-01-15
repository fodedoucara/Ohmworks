/**
 * Global numeric tolerance used throughout the engine
 * Keep this tight but safe for floating point math
 */
export const EPSILON = 1e-12;

/**
 * Returns true if |x| is effectively zero
 */
export function isNearZero(
  x: number,
  eps: number = EPSILON
): boolean {
  return Math.abs(x) < eps;
}

/**
 * Clamp a value to a minimum magnitude.
 * Useful for preventing divide-by-zero in solvers.
 */
export function clampMin(
  value: number,
  min: number
): number {
  if (Math.abs(value) < min) {
    return value >= 0 ? min : -min;
  }
  return value;
}

/**
 * Ensure a number is finite (not NaN or Infinity)
 */
export function assertFinite(
  value: number,
  label?: string
): void {
  if (!Number.isFinite(value)) {
    throw new Error(
      `Non-finite value${label ? ` for ${label}` : ""}: ${value}`
    );
  }
}

/**
 * Compare two numbers with tolerance
 */
export function nearlyEqual(
  a: number,
  b: number,
  eps: number = EPSILON
): boolean {
  return Math.abs(a - b) < eps;
}

/**
 * Sum an array with improved numerical stability
 */
export function stableSum(values: number[]): number {
  let sum = 0;
  for (const v of values) {
    sum += v;
  }
  return sum;
}
