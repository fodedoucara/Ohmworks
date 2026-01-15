//placeholder for constraints
export type ConstraintType =
  | "ohms_law"
  | "fixed_voltage"
  | "equal_voltage"
  | "diode";

export interface Constraint {
  type: ConstraintType;
  nodes: string[]; // ElectricalNode IDs
  value?: number;
  meta?: Record<string, any>;
}
