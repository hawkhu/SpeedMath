import { MathProblem, GameMode } from '../types';

/**
 * Generates a random integer between min and max (inclusive).
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a problem based on the selected game mode.
 */
export const generateProblem = (mode: GameMode): MathProblem => {
  switch (mode) {
    case 'power':
      return generatePowerProblem();
    case 'factorization':
      return generateFactorizationProblem();
    case 'pi':
      return generatePiProblem();
    case 'multiplication':
    default:
      return generateMultiplicationProblem();
  }
};

const generateMultiplicationProblem = (): MathProblem => {
  // Factor A must be at least 2. Max 100 (since 100 * 2 = 200).
  const factorA = randomInt(2, 100);
  const maxFactorB = Math.floor(200 / factorA);
  const factorB = randomInt(2, maxFactorB);

  // Randomize order
  const swap = Math.random() > 0.5;
  const a = swap ? factorB : factorA;
  const b = swap ? factorA : factorB;

  return {
    mode: 'multiplication',
    answer: a * b,
    display: {
      main: `${a} × ${b}`,
      hintText: '得数 ≤ 200'
    }
  };
};

const generatePowerProblem = (): MathProblem => {
  // Powers for numbers within 20 (Interpretation: Squares of 2-20)
  const base = randomInt(2, 20);
  const exponent = 2; // Focusing on squares as it's the core of "Speed Math"

  return {
    mode: 'power',
    answer: Math.pow(base, exponent),
    display: {
      main: `${base}²`,
      hintText: '20以内数字平方'
    }
  };
};

const generateFactorizationProblem = (): MathProblem => {
  // Reuse multiplication constraints: Product <= 200
  const factorA = randomInt(2, 100);
  const maxFactorB = Math.floor(200 / factorA);
  const factorB = randomInt(2, maxFactorB);
  
  const product = factorA * factorB;

  // Decide which factor to hide
  const hideFirst = Math.random() > 0.5;
  const answer = hideFirst ? factorA : factorB;
  const knownFactor = hideFirst ? factorB : factorA;

  return {
    mode: 'factorization',
    answer: answer,
    display: {
      main: hideFirst ? `? × ${knownFactor}` : `${knownFactor} × ?`,
      sub: `= ${product}`,
      hintText: '填入缺失的因数'
    },
    // Data for the Tree Visualization
    customVisual: {
      root: product,
      left: hideFirst ? '?' : factorA,
      right: hideFirst ? factorB : '?'
    }
  };
};

const generatePiProblem = (): MathProblem => {
  // Integers 2 through 9 multiplied by 3.14
  const factor = randomInt(2, 9);
  // Calculate precise float result
  // 3.14 * 9 = 28.26, max decimal places is 2.
  const answer = parseFloat((factor * 3.14).toFixed(2));

  return {
    mode: 'pi',
    answer: answer,
    display: {
      main: `${factor} × 3.14`,
      hintText: 'π 近似值速算'
    }
  };
};