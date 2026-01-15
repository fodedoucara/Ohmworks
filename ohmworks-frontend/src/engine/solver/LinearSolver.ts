export class LinearSolver {
  /**
   * Solve a system of linear equations
   * @param A square matrix of size n x n
   * @param b right-hand side vector
   * @returns solution vector x
   */
  static solve(A: number[][], b: number[]): number[] {
    const n = A.length;

    // Make a deep copy to avoid modifying input
    const M: number[][] = A.map(row => [...row]);
    const x: number[] = [...b];

    // Gaussian elimination
    for (let k = 0; k < n; k++) {
      // Find pivot
      let maxRow = k;
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) maxRow = i;
      }

      // Swap rows in M and x
      [M[k], M[maxRow]] = [M[maxRow], M[k]];
      [x[k], x[maxRow]] = [x[maxRow], x[k]];

      // Check for zero pivot (singular)
      if (Math.abs(M[k][k]) < 1e-12) {
        throw new Error(`Matrix is singular or nearly singular at row ${k}`);
      }

      // Eliminate
      for (let i = k + 1; i < n; i++) {
        const factor = M[i][k] / M[k][k];
        for (let j = k; j < n; j++) {
          M[i][j] -= factor * M[k][j];
        }
        x[i] -= factor * x[k];
      }
    }

    // Back substitution
    const solution: number[] = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += M[i][j] * solution[j];
      }
      solution[i] = (x[i] - sum) / M[i][i];
    }

    return solution;
  }
}
