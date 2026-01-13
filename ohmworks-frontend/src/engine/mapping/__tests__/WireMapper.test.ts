import { describe, it, expect, beforeEach } from "vitest";
import { Netlist } from "../../netlist/Netlist";
import { applyBreadboard } from "../BreadboardMapper";
import { applyWires } from "../WireMapper";

describe("WireMapper", () => {
    let netlist: Netlist;

    beforeEach(() => {
        netlist = new Netlist();

        // Resistors and LEDs have independent pins
        netlist.addComponent("R1", ["1", "2"], false);
        netlist.addComponent("LED1", ["1", "2"], false);
    });

    it("connects a single wire", () => {
        applyWires(netlist, [
            { from: { componentID: "R1", pinID: "2" }, to: { componentID: "LED1", pinID: "1" } }
        ]);

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("R1.2"));
        expect(net?.pins).toContain("LED1.1");
    });

    it("connects multiple wires", () => {
        applyWires(netlist, [
            { from: { componentID: "R1", pinID: "1" }, to: { componentID: "LED1", pinID: "2" } },
            { from: { componentID: "R1", pinID: "2" }, to: { componentID: "LED1", pinID: "1" } }
        ]);

        const nets = netlist.dump();
        const net1 = nets.find(n => n.pins.includes("R1.1"));
        const net2 = nets.find(n => n.pins.includes("R1.2"));

        expect(net1?.pins).toContain("LED1.2");
        expect(net2?.pins).toContain("LED1.1");
    });

    it("connects different breadboard rows via explicit wiring", () => {
        const rows = 2;
        const cols = 2;

        // Add breadboard
        const allPins: string[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                allPins.push(`row_${r}_col_${c}`);
            }
        }

        netlist.addComponent("BB1", allPins, false);

        // Apply breadboard topology
        applyBreadboard(netlist, "BB1", {
            rows,
            cols,
            railSegments: 0,
            railPinsPerSegment: 0
        });

        // Explicit wire connecting two rows
        applyWires(netlist, [
            {
                from: { componentID: "BB1", pinID: "row_0_col_0" },
                to: { componentID: "BB1", pinID: "row_1_col_0" }
            }
        ]);

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("BB1.row_0_col_0"));

        expect(net).toBeDefined();
        expect(net!.pins).toContain("BB1.row_1_col_0");
    });
});