export type NodeID = string; // NodeID must be a string

let NODE_COUNTER = 0; // Global counter for total number of nodes

// Single, unique electrical node with an ID but no properties
export class ElectricalNode {
    readonly id: NodeID;

    constructor() {
        this.id = `N${NODE_COUNTER++}`; // Create an ElectricalNode() and increment NODE_COUNTER
    }
}