import { ElectricalNode } from "./ElectricalNode";
import { PinRef } from "./PinRef";
import { Net } from "./Net";

export class Netlist {
    private components = new Map<string, Map<string, PinRef>>(); // Key: componentID, Value: (Map<Key: pinID, Value: PinRef>)
    private nets = new Map<string, Net>(); // Store all Nets by nodeID

    // Create a new ElectricalNode and Net
    private createElectricalNode(): ElectricalNode {
        const node = new ElectricalNode();
        this.nets.set(node.id, new Net(node)); // Add element to nets map with Key: nodeID, Value: new Net with new ElectricalNode
        return node;
    }

    // Add a component to the Netlist
    addComponent(instanceID: string, pinIDs: string[], internalPinsConnected: boolean) {
        const pinMap = new Map<string, PinRef>(); // Map of pins for the new component
        let sharedNode: ElectricalNode | null = null;

        for (const pinID of pinIDs) {
            let node: ElectricalNode;

            if (internalPinsConnected) {
                node = sharedNode || (sharedNode = this.createElectricalNode());
            }
            else {
                node = this.createElectricalNode();
            }

            const pin = new PinRef(instanceID, pinID, node); // Create a PinRef pointing to new node
            pinMap.set(pinID, pin); // Store pin and its ID to the component's pinMap
            this.nets.get(node.id)!.addPin(pin); // Add current pin to net
        }

        this.components.set(instanceID, pinMap); // Add component to the Netlist
    }

    // Get a PinRef through its componentID and pinID on that component
    getPin(componentID: string, pinID: string): PinRef {
        const comp = this.components.get(componentID); // Get a component from the Map of components by its componentID
        if (!comp) { throw new Error(`Component ${componentID} not found`); }

        const pin = comp.get(pinID); // Get a pin from the component by its pinID
        if (!pin) { throw new Error(`Pin ${pinID} not found on component ${componentID}`)};

        return pin;
    }

    // Connect 2 pins by their component IDs and pin IDs
    connectPins(
        a: { componentID: string; pinID: string },
        b: { componentID: string; pinID: string }
    ) {
        const pinA = this.getPin(a.componentID, a.pinID); // Get PinRef for pinA
        const pinB = this.getPin(b.componentID, b.pinID);
        this.mergeNodes(pinA.node, pinB.node);
    }

    // Updates all pins in nodeB to nodeA and deletes nodeB, if they are connected and need the same properties
    private mergeNodes(nodeA: ElectricalNode, nodeB: ElectricalNode) {
        if (nodeA === nodeB) { return; } // Already same node, do nothing
        
        const netA = this.nets.get(nodeA.id)!; // Get the Net for nodeA, ! means the value is guaranteed a Net and not undefined
        const netB = this.nets.get(nodeB.id)!;

        // Move pins from nodeB to node A
        for (const pin of netB.pins) {
            pin.node = nodeA; // Update pin's node reference
            netA.addPin(pin);
        }

        this.nets.delete(nodeB.id); // Delete nodeB
    }

    // Returns an object showing all nets for debug
    dump () {
        return [...this.nets.values()].map(net => ({
            node: net.node.id,
            pins: [...net.pins].map(p => `${p.componentID}.${p.pinID}`)
        }));
    }

    
    // ---- New Helpers for DCSolver ----

    /**
     * Returns all ElectricalNode IDs in the netlist
     */
    getAllNodeIDs(): string[] {
        return [...this.nets.keys()];
    }

    /**
     * Returns all PinRefs attached to a node
     */
    getPinsForNode(nodeID: string): PinRef[] {
        const net = this.nets.get(nodeID);
        if (!net) throw new Error(`Node ${nodeID} not found`);
        return [...net.pins];
    }
}