/**
 * Metric prefix multipliers
 */
const PREFIX_MULTIPLIERS: Record<string, number> = {
  "": 1,
  k: 1e3,
  M: 1e6,
  G: 1e9,
  m: 1e-3,
  u: 1e-6,
  n: 1e-9,
  p: 1e-12,
};

/**
 * Base unit suffixes we accept but ignore numerically
 * (since everything is converted to SI numbers)
 */
const BASE_UNITS = ["V", "A", "Ohm", "Ω", "F", "H", "W"];

/**
 * Parse a string like:
 *  - "10k"
 *  - "4.7uF"
 *  - "0.7V"
 *  - "100"
 *
 * Returns a number in SI units.
 */
export function parseValue(input: string): number {
  const trimmed = input.trim();

  const match = trimmed.match(
    /^([+-]?\d*\.?\d+(?:e[+-]?\d+)?)\s*([a-zA-ZΩ]*)$/
  );

  if (!match) {
    throw new Error(`Invalid value format: "${input}"`);
  }

  const [, rawValue, unitPart] = match;
  const numeric = parseFloat(rawValue);

  if (!Number.isFinite(numeric)) {
    throw new Error(`Invalid numeric value: "${rawValue}"`);
  }

  // Strip known base units (V, A, Ohm, etc.)
  let suffix = unitPart;
  for (const unit of BASE_UNITS) {
    if (suffix.endsWith(unit)) {
      suffix = suffix.slice(0, -unit.length);
      break;
    }
  }

  const multiplier = PREFIX_MULTIPLIERS[suffix];
  if (multiplier === undefined) {
    throw new Error(`Unknown unit prefix: "${suffix}"`);
  }

  return numeric * multiplier;
}

/**
 * Explicit helpers (optional but nice for readability)
 */
export const parseResistance = parseValue;
export const parseVoltage = parseValue;
export const parseCapacitance = parseValue;
export const parseInductance = parseValue;
