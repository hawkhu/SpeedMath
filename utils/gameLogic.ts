import { MathProblem } from '../types';

/**
 * Generates a random integer between min and max (inclusive).
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a multiplication problem where:
 * 1. Factors are not 1.
 * 2. Product is <= 200.
 * 3. Returns { factorA, factorB, product }
 */
export const generateProblem = (): MathProblem => {
  // Factor A must be at least 2.
  // The maximum possible factor A is 100 (since 100 * 2 = 200).
  const factorA = randomInt(2, 100);

  // Factor B constraint:
  // Must be >= 2.
  // Must satisfy: factorA * factorB <= 200  =>  factorB <= floor(200 / factorA)
  const maxFactorB = Math.floor(200 / factorA);

  // If maxFactorB is less than 2, it means factorA was too large (e.g., 101),
  // though our initial range prevents this, we handle edge cases or logic changes.
  // In our case factorA max is 100, so 200/100 = 2. Safe.
  const factorB = randomInt(2, maxFactorB);

  // Randomize order of display for variety (e.g., 5*3 vs 3*5)
  const swap = Math.random() > 0.5;

  return {
    factorA: swap ? factorB : factorA,
    factorB: swap ? factorA : factorB,
    product: factorA * factorB,
  };
};
