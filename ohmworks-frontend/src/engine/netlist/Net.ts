import { ElectricalNode } from "./ElectricalNode";
import { PinRef } from "./PinRef";

// A group of pins electrically tied together, multiple pins in a net = same voltage, usually connected by something like a wire
export class Net {
    readonly node: ElectricalNode;
    readonly pins: Set<PinRef>; // Set instead of array to ignore duplicates

    constructor(node: ElectricalNode) {
        this.node = node;
        this.pins = new Set();
    }

    // Adds a pin to the Net and updates the pin's node to this Net's node
    addPin(pin: PinRef) {
        this.pins.add(pin);
        pin.node = this.node;
    }
}