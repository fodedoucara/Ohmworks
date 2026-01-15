import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist } from "../netlist/Netlist";
import { VoltageSourceConstraint, Constraint } from "../solver/Constraint";

export type GPIOMode = "input" | "output";
export type GPIOState = "high" | "low";

export class GPIO implements ComponentBehavior {
  readonly type = "gpio";

  constructor(
    public readonly id: string,
    public readonly pins: readonly ["a1"],
    private readonly mode: GPIOMode,
    private readonly state: GPIOState,
    private readonly highVoltage = 5
  ) {}

  stamp(netlist: Netlist): Constraint[] {
    if (this.mode !== "output") {
      return [];
    }

    const node = netlist.getPin(this.id, "a1").node.id;
    const ground = netlist.getAllNodeIDs()[0];

    return [{
            type: "voltage",
            positive: node,
            negative: ground,
            volts: this.state === "high" ? this.highVoltage : 0
        } as VoltageSourceConstraint];
    }

  validate(): string[] {
    return [];
  }
}
