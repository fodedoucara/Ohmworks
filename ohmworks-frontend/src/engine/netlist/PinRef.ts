import { ElectricalNode } from "./ElectricalNode";

// Reference to a single pin on a component, points to an ElectricalNode
export class PinRef {
    readonly componentID: string;
    readonly pinID: string;
    node: ElectricalNode; // Not readonly bc node can change if a wire connects this pin to another net

    constructor(componentID: string, pinID: string, node: ElectricalNode) {
        this.componentID = componentID;
        this.pinID = pinID;
        this.node = node;
    }
}