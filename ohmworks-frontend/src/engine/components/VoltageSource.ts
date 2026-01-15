import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist } from "../netlist/Netlist";
import { Constraint } from "../solver/Constraint";

export class VoltageSource implements ComponentBehavior {
  readonly type = "voltage_source";

  constructor(
    public readonly id: string,
    public readonly pins: readonly ["a1", "b1"],
    private readonly voltage: number
  ) {}

  stamp(netlist: Netlist): Constraint[] {
    const pos = netlist.getPin(this.id, "a1").node.id;
    const neg = netlist.getPin(this.id, "b1").node.id;

    return [{
      type: "fixed_voltage",
      nodes: [pos, neg],
      value: this.voltage
    }];
  }

  validate(netlist: Netlist): string[] {
    const pos = netlist.getPin(this.id, "a1").node.id;
    const neg = netlist.getPin(this.id, "b1").node.id;

    if (pos === neg) {
      return [`Voltage source ${this.id} is shorted`];
    }
    return [];
  }
}
