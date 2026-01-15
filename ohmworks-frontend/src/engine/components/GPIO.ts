import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist } from "../netlist/Netlist";
import { Constraint } from "../solver/Constraint";

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

    return [{
      type: "fixed_voltage",
      nodes: [node],
      value: this.state === "high" ? this.highVoltage : 0
    }];
  }

  validate(): string[] {
    return [];
  }
}
