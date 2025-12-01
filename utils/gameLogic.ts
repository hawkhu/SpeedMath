import { MathProblem, GameMode } from '../types';

/**
 * Generates a random integer between min and max (inclusive).
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles an array in place.
 */
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Generates distractors (wrong answers) close to the real answer.
 */
const generateOptions = (answer: number, isFloat: boolean = false): number[] => {
  const options = new Set<number>();
  options.add(answer);

  let attempts = 0;
  while (options.size < 3 && attempts < 20) {
    attempts++;
    let offset = 0;
    
    if (isFloat) {
      // For Pi mode (e.g. 28.26), vary by small amounts or whole numbers
      const type = Math.random();
      if (type < 0.33) offset = 0.01 * (Math.random() > 0.5 ? 1 : -1);
      else if (type < 0.66) offset = 0.1 * (Math.random() > 0.5 ? 1 : -1);
      else offset = randomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
      
      let candidate = parseFloat((answer + offset).toFixed(2));
      if (candidate > 0) options.add(candidate);
    } else {
      // For integers
      // Generate offsets like +/- 1, +/- 2, +/- 10, or random small int
      const r = Math.random();
      if (r < 0.4) offset = randomInt(1, 2) * (Math.random() > 0.5 ? 1 : -1); // close miss
      else if (r < 0.7) offset = 10 * (Math.random() > 0.5 ? 1 : -1); // ten error
      else offset = randomInt(3, 15) * (Math.random() > 0.5 ? 1 : -1); // random
      
      let candidate = answer + offset;
      if (candidate > 0) options.add(candidate);
    }
  }

  // Fallback if we couldn't find unique distractors (rare for valid inputs)
  while(options.size < 3) {
    options.add(answer + options.size + 1);
  }

  return shuffleArray(Array.from(options));
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
  const factorA = randomInt(2, 100);
  const maxFactorB = Math.floor(200 / factorA);
  const factorB = randomInt(2, maxFactorB);

  const swap = Math.random() > 0.5;
  const a = swap ? factorB : factorA;
  const b = swap ? factorA : factorB;
  const answer = a * b;

  return {
    mode: 'multiplication',
    answer: answer,
    display: {
      main: `${a} × ${b}`,
      hintText: '得数 ≤ 200'
    },
    options: generateOptions(answer)
  };
};

const generatePowerProblem = (): MathProblem => {
  const base = randomInt(2, 20);
  const exponent = 2;
  const answer = Math.pow(base, exponent);

  return {
    mode: 'power',
    answer: answer,
    display: {
      main: `${base}²`,
      hintText: '20以内数字平方'
    },
    options: generateOptions(answer)
  };
};

const generateFactorizationProblem = (): MathProblem => {
  const factorA = randomInt(2, 100);
  const maxFactorB = Math.floor(200 / factorA);
  const factorB = randomInt(2, maxFactorB);
  
  const product = factorA * factorB;

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
    customVisual: {
      root: product,
      left: hideFirst ? '?' : factorA,
      right: hideFirst ? factorB : '?'
    },
    options: generateOptions(answer)
  };
};

const generatePiProblem = (): MathProblem => {
  const factor = randomInt(2, 9);
  const answer = parseFloat((factor * 3.14).toFixed(2));

  return {
    mode: 'pi',
    answer: answer,
    display: {
      main: `${factor} × 3.14`,
      hintText: 'π 近似值速算'
    },
    options: generateOptions(answer, true)
  };
};