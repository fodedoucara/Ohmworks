import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist} from "../netlist/Netlist";
import { Constraint } from "../solver/Constraint";

//V1: DC steady state so capacitor = open circuit

export class Capacitor implements ComponentBehavior {
  readonly type = "capacitor";

  constructor(
    public readonly id: string,
    public readonly pins: readonly ["a1", "b1"],
    private readonly capacitance: number
  ) {}

  stamp(netlist: Netlist): Constraint[] { 
    return []; 
  }

  validate(): string[] {
    if (this.capacitance <= 0) {
      return [`Capacitor ${this.id} has invalid capacitance`];
    }
    return [];
  }
}
