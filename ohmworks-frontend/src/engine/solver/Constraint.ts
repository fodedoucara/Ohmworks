//Brandon: these are just the constraints I can think of for now
// feel free to add more as you implement them in the solver
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
