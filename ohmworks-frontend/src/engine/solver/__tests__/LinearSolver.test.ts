import { describe, it, expect } from "vitest";
import { LinearSolver } from "../LinearSolver";

describe("LinearSolver", () => {
  it("solves a simple 2x2 system", () => {
    const A = [
      [2, -1],
      [-1, 1]
    ];
    const b = [1, 0];

    const x = LinearSolver.solve(A, b);

    expect(x[0]).toBeCloseTo(1);
    expect(x[1]).toBeCloseTo(1);
  });

  it("solves a 3x3 system", () => {
    const A = [
      [3, -1, 0],
      [-1, 3, -1],
      [0, -1, 2]
    ];
    const b = [2, 4, 2];

    const x = LinearSolver.solve(A, b);

    expect(x[0]).toBeCloseTo(1.538);
    expect(x[1]).toBeCloseTo(2.615);
    expect(x[2]).toBeCloseTo(2.307);
  });

  it("throws on singular matrix", () => {
    const A = [
      [1, 2],
      [2, 4]
    ];
    const b = [3, 6];

    expect(() => LinearSolver.solve(A, b)).toThrow(/singular/i);
  });
});
