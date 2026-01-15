import { Netlist } from "../netlist/Netlist";
import { NodeID } from "../netlist/ElectricalNode";
import {
  Constraint,
  ResistanceConstraint,
  VoltageSourceConstraint,
  CurrentSourceConstraint,
  validateConstraint
} from "./Constraint";
import { LinearSolver } from "./LinearSolver";
import * as MathUtils from "../engine-utils/MathUtils";

export interface LinearSystem {
  A: number[][];
  b: number[];
  nodeIndex: Map<NodeID, number>;
  voltageSourceCount: number;
  ground: NodeID;
}

export interface SimulationResult {
  nodeVoltages: Map<NodeID, number>;
  pinCurrents: Map<string, number>; // key = `${componentID}.${pinID}`
}

export class DCSolver {
  solve(netlist: Netlist, constraints: Constraint[]): SimulationResult {
    // Build the system
    const system = this.buildSystem(netlist, constraints);

    // Solve Ax = b
    const x = LinearSolver.solve(system.A, system.b);

    // Extract node voltages
    const nodeVoltages = new Map<NodeID, number>();
    nodeVoltages.set(system.ground, 0); // ground node = 0
    for (const [node, idx] of system.nodeIndex) {
      nodeVoltages.set(node, x[idx]);
    }

    // Compute currents per pin
    const pinCurrents = this.computeCurrents(netlist, constraints, nodeVoltages);

    return { nodeVoltages, pinCurrents };
  }

  buildSystem(netlist: Netlist, constraints: Constraint[], groundNode?: NodeID): LinearSystem {
    const nodeIDs = netlist.getAllNodeIDs();
    if (nodeIDs.length === 0) throw new Error("Netlist has no nodes");

    // Ground the first node
    let ground: NodeID;
    if (groundNode) {
      ground = groundNode;
    } else {
      // Pick negative terminal of first voltage source if any
      const firstVs = constraints.find(c => c.type === "voltage") as VoltageSourceConstraint | undefined;
      ground = firstVs ? firstVs.negative : nodeIDs[0];
    }
    const nodes = nodeIDs.filter(n => n !== ground);
    const nodeIndex = new Map<NodeID, number>();
    nodes.forEach((id, i) => nodeIndex.set(id, i));

    // Count voltage sources for MNA extra rows
    const voltageSources = constraints.filter(
      c => c.type === "voltage"
    ) as VoltageSourceConstraint[];
    const N = nodes.length;
    const M = voltageSources.length;
    const size = N + M;

    const A = Array.from({ length: size }, () => Array(size).fill(0));
    const b = Array(size).fill(0);

    // Stamp resistors and current sources first
    for (const c of constraints) {
      validateConstraint(c);
      switch (c.type) {
        case "resistance":
          this.stampResistance(A, c, nodeIndex, ground);
          break;
        case "current":
          this.stampCurrent(b, c, nodeIndex, ground);
          break;
      }
    }

    // Stamp voltage sources
    voltageSources.forEach((vs, i) => {
      this.stampVoltageSource(A, b, vs, i, nodeIndex, ground, N);
    });

    return { A, b, nodeIndex, voltageSourceCount: M, ground };
  }

  computeCurrents(
    netlist: Netlist,
    constraints: Constraint[],
    nodeVoltages: Map<NodeID, number>
  ): Map<string, number> {
    const pinCurrents = new Map<string, number>();

    for (const c of constraints) {
      switch (c.type) {
        case "resistance": {
          const va = nodeVoltages.get(c.a)!;
          const vb = nodeVoltages.get(c.b)!;
          const I = (va - vb) / MathUtils.clampMin(c.ohms, 1e-12);

          for (const pin of netlist.getPinsForNode(c.a)) {
            pinCurrents.set(`${pin.componentID}.${pin.pinID}`, -I);
          }
          for (const pin of netlist.getPinsForNode(c.b)) {
            pinCurrents.set(`${pin.componentID}.${pin.pinID}`, I);
          }
          break;
        }

        case "current": {
          const I = c.amps;
          for (const pin of netlist.getPinsForNode(c.from)) {
            pinCurrents.set(`${pin.componentID}.${pin.pinID}`, -I);
          }
          for (const pin of netlist.getPinsForNode(c.to)) {
            pinCurrents.set(`${pin.componentID}.${pin.pinID}`, I);
          }
          break;
        }

        case "voltage": {
          // voltage source currents can be extracted from MNA solution if needed
          // Phase-1: leave undefined
          break;
        }
      }
    }

    return pinCurrents;
  }

  // ---------------- STAMPING ----------------

  private stampResistance(
    A: number[][],
    c: ResistanceConstraint,
    nodeIndex: Map<NodeID, number>,
    ground: NodeID
  ) {
    const g = 1 / MathUtils.clampMin(c.ohms, 1e-12);
    const ai = c.a !== ground ? nodeIndex.get(c.a)! : null;
    const bi = c.b !== ground ? nodeIndex.get(c.b)! : null;

    if (ai !== null) A[ai][ai] += g;
    if (bi !== null) A[bi][bi] += g;
    if (ai !== null && bi !== null) {
      A[ai][bi] -= g;
      A[bi][ai] -= g;
    }
  }

  private stampCurrent(
    b: number[],
    c: CurrentSourceConstraint,
    nodeIndex: Map<NodeID, number>,
    ground: NodeID
  ) {
    const fi = c.from !== ground ? nodeIndex.get(c.from)! : null;
    const ti = c.to !== ground ? nodeIndex.get(c.to)! : null;
    if (fi !== null) b[fi] -= c.amps;
    if (ti !== null) b[ti] += c.amps;
  }

  private stampVoltageSource(
    A: number[][],
    b: number[],
    c: VoltageSourceConstraint,
    sourceIndex: number,
    nodeIndex: Map<NodeID, number>,
    ground: NodeID,
    nodeCount: number
  ) {
    const row = nodeCount + sourceIndex; // extra row in MNA for voltage source
    const pi = c.positive !== ground ? nodeIndex.get(c.positive)! : null;
    const ni = c.negative !== ground ? nodeIndex.get(c.negative)! : null;

    if (pi !== null) { A[pi][row] += 1; A[row][pi] += 1; }
    if (ni !== null) { A[ni][row] -= 1; A[row][ni] -= 1; }

    b[row] = c.volts;
  }
}
