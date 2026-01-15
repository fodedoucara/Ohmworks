import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist} from "../netlist/Netlist";
import { Constraint } from "../solver/Constraint";

export class Diode implements ComponentBehavior {
  readonly type = "diode";

  constructor(
    public readonly id: string,
    public readonly pins: readonly ["a1", "b1"],
    private readonly forwardVoltage: number
  ) {}

  stamp(netlist: Netlist): Constraint[] {
    const a = netlist.getPin(this.id, "a1").node.id;
    const b = netlist.getPin(this.id, "b1").node.id;

    return [{
      type: "diode",
      nodes: [a, b],
      value: this.forwardVoltage
    }];
  }

  validate(): string[] {
    return [];
  }
}
