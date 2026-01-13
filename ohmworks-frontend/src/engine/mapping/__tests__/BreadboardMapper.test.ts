import { describe, it, expect, beforeEach } from "vitest";
import { Netlist } from "../../netlist/Netlist";
import { applyBreadboard } from "../BreadboardMapper";

describe("BreadboardMapper", () => {
    let netlist: Netlist;

    // Create a mock breadboard before each test
    beforeEach(() => {
        netlist = new Netlist();

        const rows = 2;
        const cols = 2;
        const railSegments = 1;
        const railPinsPerSegment = 2;

        // All pins in one component "BB1"
        const allPins: string[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                allPins.push(`row_${r}_col_${c}`);
            }
        }
        for (let s = 0; s < railSegments; s++) {
            for (let p = 0; p < railPinsPerSegment; p++) {
                allPins.push(`rail${s}_pin_${p}`);
            }
        }
        netlist.addComponent("BB1", allPins, false);

        applyBreadboard(netlist, "BB1", { rows, cols, railSegments, railPinsPerSegment });
    });

    it("connects row pins to leftmost pin", () => {
        const nets = netlist.dump();
        for (let r = 0; r < 2; r++) {
            const net = nets.find(n => n.pins.includes(`BB1.row_${r}_col_0`));
            expect(net).toBeDefined(); // Make sure the net exists
            expect(net!.pins).toContain(`BB1.row_${r}_col_1`);
        }
    });

    it("connects rail pins to leftmost pin", () => {
        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("BB1.rail0_pin_0"));
        expect(net).toBeDefined();
        expect(net!.pins).toContain("BB1.rail0_pin_1");
    });

    it("does not connect different rows together", () => {
        const nets = netlist.dump();

        const row0Net = nets.find(n => n.pins.includes("BB1.row_0_col_0"));
        const row1Net = nets.find(n => n.pins.includes("BB1.row_1_col_0"));

        expect(row0Net).toBeDefined();
        expect(row1Net).toBeDefined();

        expect(row0Net!.node).not.toBe(row1Net!.node); // They must be different electrical nodes

        expect(row0Net!.pins).not.toContain("BB1.row_1_col_0"); // And must not contain each other’s pins
        expect(row1Net!.pins).not.toContain("BB1.row_0_col_0");
    });

    it("does not connect rows to rails", () => {
        const nets = netlist.dump();

        const rowNet = nets.find(n => n.pins.includes("BB1.row_0_col_0"));
        const railNet = nets.find(n => n.pins.includes("BB1.rail0_pin_0"));

        expect(rowNet).toBeDefined();
        expect(railNet).toBeDefined();

        expect(rowNet!.node).not.toBe(railNet!.node); // They must be different electrical nodes

        expect(rowNet!.pins).not.toContain("BB1.rail0_pin_0"); // And must not contain each other’s pins
        expect(railNet!.pins).not.toContain("BB1.row_0_col_0");
    });

    it("connecting a pin into a row connects the entire row", () => {
        // Add an external component
        netlist.addComponent("R1", ["1", "2"], false);

        // Connect resistor pin to middle of row 0
        netlist.connectPins(
            { componentID: "R1", pinID: "1" },
            { componentID: "BB1", pinID: "row_0_col_1" }
        );

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("R1.1"));

        expect(net).toBeDefined();

        // Entire row must now be connected
        expect(net!.pins).toContain("BB1.row_0_col_0");
        expect(net!.pins).toContain("BB1.row_0_col_1");
    });

    it("connecting a pin into a rail connects the entire rail", () => {
        netlist.addComponent("VCC", ["out"], false);

        netlist.connectPins(
            { componentID: "VCC", pinID: "out" },
            { componentID: "BB1", pinID: "rail0_pin_1" }
        );

        const nets = netlist.dump();
        const net = nets.find(n => n.pins.includes("VCC.out"));

        expect(net).toBeDefined();

        expect(net!.pins).toContain("BB1.rail0_pin_0");
        expect(net!.pins).toContain("BB1.rail0_pin_1");
    });
});