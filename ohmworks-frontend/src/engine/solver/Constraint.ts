import { NodeID } from "../netlist/ElectricalNode";
import * as MathUtils from "../engine-utils/MathUtils";

/**
 * Constraint types for DC solver
 */
export type Constraint = 
  | ResistanceConstraint
  | VoltageSourceConstraint
  | CurrentSourceConstraint
  | DiodeConstraint;

/**
 * Linear resistor between nodes
 */
export interface ResistanceConstraint {
  type: "resistance";
  a: NodeID;
  b: NodeID;
  ohms: number; // must be finite and > 0
}

/**
 * Ideal voltage source
 */
export interface VoltageSourceConstraint {
  type: "voltage";
  positive: NodeID;
  negative: NodeID;
  volts: number; // must be finite
}

/**
 * Ideal current source
 */
export interface CurrentSourceConstraint {
  type: "current";
  from: NodeID;
  to: NodeID;
  amps: number; // must be finite
}

/**
 * Ideal diode (approximated as fixed forward voltage)
 */
export interface DiodeConstraint {
  type: "diode";
  anode: NodeID;
  cathode: NodeID;
  volts: number; // forward voltage drop, must be finite
}

/**
 * Helper to validate a single constraint numerically
 */
export function validateConstraint(c: Constraint): void {
  switch(c.type) {
    case "resistance":
      if (!Number.isFinite(c.ohms) || MathUtils.isNearZero(c.ohms)) {
        throw new Error(`Invalid resistance value: ${c.ohms} Ω`);
      }
      break;
    case "voltage":
      MathUtils.assertFinite(c.volts, "voltage source");
      break;
    case "current":
      MathUtils.assertFinite(c.amps, "current source");
      break;
    case "diode":
      MathUtils.assertFinite(c.volts, "diode forward voltage");
      break;
    default:
      const _exhaustive: never = c;
      throw new Error(`Unknown constraint type: ${_exhaustive}`);
  }
}
