import { ComponentBehavior } from "./ComponentBehavior";
import { Netlist} from "../netlist/Netlist";
import { ResistanceConstraint, Constraint } from "../solver/Constraint";

export class Resistor implements ComponentBehavior {
    readonly type = "resistor";

    constructor(
        public readonly id: string,
        public readonly pins: readonly ["a1", "b1"],
        private readonly resistance: number //in ohms
    ){}

    stamp(netlist: Netlist): Constraint[] {
        const a = netlist.getPin(this.id, "a1").node.id;
        const b = netlist.getPin(this.id, "b1").node.id;

        return [{
            type: "resistance",
            a,
            b,
            ohms: this.resistance
        } as ResistanceConstraint];
    }

    validate(netlist: Netlist): string[] {
        const a = netlist.getPin(this.id, "a1").node.id;
        const b = netlist.getPin(this.id, "b1").node.id;

        if (a === b){
            return [`Resistor ${this.id} is shorted`];
        }

        if (this.resistance <= 0){
            return [`Resistor ${this.id} has invalid resistance`];
        }

        return [];


    }

}