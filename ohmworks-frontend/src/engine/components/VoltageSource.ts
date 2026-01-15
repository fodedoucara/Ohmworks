import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist } from "../netlist/Netlist";
import { VoltageSourceConstraint, Constraint } from "../solver/Constraint";
import { NodeID } from "../netlist/ElectricalNode";

export class VoltageSource implements ComponentBehavior {
  readonly type = "voltage_source";

  constructor(
    public readonly id: string,
    public readonly pins: readonly ["a1", "b1"],
    private readonly voltage: number
  ) {}

  stamp(netlist: Netlist, ground?: NodeID): Constraint[] {
    const pos = netlist.getPin(this.id, "a1").node.id;
    const neg = netlist.getPin(this.id, "b1").node.id;

    // If positive node is same as ground, swap
    const [positive, negative] = pos === neg ? [pos, ground] : [pos, neg];


    return [{
            type: "voltage",
            positive,
            negative,
            volts: this.voltage
        } as VoltageSourceConstraint];
    }

  validate(netlist: Netlist): string[] {
    const positive = netlist.getPin(this.id, "a1").node.id;
    const negative = netlist.getPin(this.id, "b1").node.id;

    if (positive === negative) {
      return [`Voltage source ${this.id} is shorted`];
    }
    return [];
  }
}
