import { describe, it, expect, beforeEach } from "vitest";
import { Netlist } from "../Netlist";

describe("Netlist", () => {
    let netlist: Netlist;

    beforeEach(() => {
        netlist = new Netlist();
    });

    it("adds a single component correctly", () => {
        netlist.addComponent("R1", ["1", "2"], false); // Pins are independent, so internalPinsConnected = false
        const nets = netlist.dump();

        expect(nets.length).toBe(2); // Each pin is its own net initially
        expect(nets.flatMap(n => n.pins)).toContain("R1.1");
        expect(nets.flatMap(n => n.pins)).toContain("R1.2");
    });

    it("connects two pins into the same net", () => {
        netlist.addComponent("R1", ["1", "2"], false);
        netlist.addComponent("R2", ["1", "2"], false);

        netlist.connectPins({ componentID: "R1", pinID: "2" }, { componentID: "R2", pinID: "1" });

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("R1.2"));
        expect(net?.pins).toContain("R2.1");
    });

    it("merges multiple nets through sequential connections", () => {
        netlist.addComponent("R1", ["1", "2"], false);
        netlist.addComponent("R2", ["1", "2"], false);
        netlist.addComponent("LED1", ["1", "2"], false);

        // Connect sequentially
        netlist.connectPins({ componentID: "R1", pinID: "2" }, { componentID: "R2", pinID: "1" });
        netlist.connectPins({ componentID: "R2", pinID: "2" }, { componentID: "LED1", pinID: "1" });

        const nets = netlist.dump();

        // Only check connected pins
        const netR1R2_1 = nets.find(n => n.pins.includes("R1.2"));
        expect(netR1R2_1?.pins).toContain("R2.1");
        expect(netR1R2_1?.pins).toContain("R1.2");

        const netR2_2LED1 = nets.find(n => n.pins.includes("R2.2"));
        expect(netR2_2LED1?.pins).toContain("R2.2");
        expect(netR2_2LED1?.pins).toContain("LED1.1");
    });

    it("handles multi-pin components", () => {
        netlist.addComponent("MCU1", ["1", "2", "3", "4"], true); // Internal pins connected, all pins share the same node
        const nets = netlist.dump();

        expect(nets.length).toBe(1); // All pins share the same node
        expect(nets[0].pins).toContain("MCU1.3");
        expect(nets[0].pins).toContain("MCU1.1");
    });

    it("dump() returns nodes with correct shape", () => {
        netlist.addComponent("R1", ["1"], false);
        const dumped = netlist.dump();
        expect(dumped[0]).toHaveProperty("node");
        expect(dumped[0]).toHaveProperty("pins");
    });

    it("connecting pins multiple times is idempotent", () => {
        netlist.addComponent("R1", ["1", "2"], false);
        netlist.addComponent("LED1", ["1", "2"], false);

        netlist.connectPins({ componentID: "R1", pinID: "2" }, { componentID: "LED1", pinID: "1" });
        netlist.connectPins({ componentID: "LED1", pinID: "1" }, { componentID: "R1", pinID: "2" });

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("R1.2"));
        expect(net?.pins).toContain("LED1.1");
    });

    
    // ---- NEW TESTS FOR THE HELPER FUNCTIONS ----

    it("getAllNodeIDs returns all current node IDs", () => {
        netlist.addComponent("R1", ["1", "2"], false);
        const nodeIDs = netlist.getAllNodeIDs();
        expect(nodeIDs.length).toBe(2); // Each pin is its own node
    });

    it("getPinsForNode returns correct pins", () => {
        netlist.addComponent("R1", ["1", "2"], false);
        const nodeIDs = netlist.getAllNodeIDs();

        const pinsNode0 = netlist.getPinsForNode(nodeIDs[0]);
        expect(pinsNode0.map(p => `${p.componentID}.${p.pinID}`)).toContain("R1.1");

        const pinsNode1 = netlist.getPinsForNode(nodeIDs[1]);
        expect(pinsNode1.map(p => `${p.componentID}.${p.pinID}`)).toContain("R1.2");
    });
});