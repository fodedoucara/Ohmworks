import { describe, it, expect, beforeEach } from "vitest";
import { DCSolver } from "../DCSolver";
import { Netlist } from "../../netlist/Netlist";
import type { NodeID } from "../../netlist/ElectricalNode";
import {
  ResistanceConstraint,
  VoltageSourceConstraint,
  CurrentSourceConstraint,
  validateConstraint
} from "../Constraint";

describe("DCSolver – DC Simulation", () => {
  let netlist: Netlist;
  let solver: DCSolver;

  beforeEach(() => {
    netlist = new Netlist();
    solver = new DCSolver();
  });

  it("validates voltage source constraint", () => {
    netlist.addComponent("V1", ["+", "-"], false);
    const nodes = netlist.getAllNodeIDs();
    const vs: VoltageSourceConstraint = {
      type: "voltage",
      positive: nodes[0],
      negative: nodes[1],
      volts: 5
    };
    expect(() => validateConstraint(vs)).not.toThrow();
  });

  it("validates current source constraint", () => {
    netlist.addComponent("I1", ["from", "to"], false);
    const nodes = netlist.getAllNodeIDs();
    const cs: CurrentSourceConstraint = {
      type: "current",
      from: nodes[0],
      to: nodes[1],
      amps: 0.01
    };
    expect(() => validateConstraint(cs)).not.toThrow();
  });

  it("solves a simple resistor voltage divider", () => {
    // Add components
    netlist.addComponent("V1", ["+", "-"], false);
    netlist.addComponent("R1", ["1", "2"], false);
    netlist.addComponent("R2", ["a", "b"], false);

    const [vPlus, vMinus, r1a, r1b, r2a, r2b] = netlist.getAllNodeIDs();

    // Voltage source 10V
    const vs: VoltageSourceConstraint = {
      type: "voltage",
      positive: vPlus,
      negative: vMinus,
      volts: 10
    };

    // Resistors
    const r1: ResistanceConstraint = {
      type: "resistance",
      a: r1a,
      b: r1b,
      ohms: 1000
    };
    const r2: ResistanceConstraint = {
      type: "resistance",
      a: r2a,
      b: r2b,
      ohms: 1000
    };

    const constraints = [vs, r1, r2];

    // Solve
    const result = solver.solve(netlist, constraints);

    const vNode = result.nodeVoltages.get(r1b)!; // Node between R1 and R2
    // Voltage divider: Vout = Vin * R2 / (R1 + R2) = 10 * 1000 / 2000 = 5V
    expect(vNode).toBeCloseTo(5, 3);
  });

  it("computes currents for a current source", () => {
    netlist.addComponent("I1", ["from", "to"], false);
    const [n1, n2] = netlist.getAllNodeIDs();

    const cs: CurrentSourceConstraint = {
      type: "current",
      from: n1,
      to: n2,
      amps: 0.02
    };

    const nodeVoltages = new Map<NodeID, number>([
      [n1, 5],
      [n2, 0]
    ]);

    const currents = solver.computeCurrents(netlist, [cs], nodeVoltages);
    expect(currents.get("I1.from")).toBeCloseTo(-0.02);
    expect(currents.get("I1.to")).toBeCloseTo(0.02);
  });

  it("computes currents in a mixed circuit (resistor + current source)", () => {
    netlist.addComponent("R1", ["1", "2"], false);
    netlist.addComponent("I1", ["from", "to"], false);

    const [n1, n2, n3, n4] = netlist.getAllNodeIDs();

    const constraints = [
      { type: "resistance", a: n1, b: n2, ohms: 100 } as ResistanceConstraint,
      { type: "current", from: n3, to: n4, amps: 0.01 } as CurrentSourceConstraint
    ];

    // Fake node voltages
    const nodeVoltages = new Map<NodeID, number>([
      [n1, 5],
      [n2, 0],
      [n3, 3],
      [n4, 0]
    ]);

    const currents = solver.computeCurrents(netlist, constraints, nodeVoltages);

    expect(currents.get("R1.1")).toBeCloseTo(-0.05); // I = (5-0)/100
    expect(currents.get("R1.2")).toBeCloseTo(0.05);

    expect(currents.get("I1.from")).toBeCloseTo(-0.01);
    expect(currents.get("I1.to")).toBeCloseTo(0.01);
  });
});
