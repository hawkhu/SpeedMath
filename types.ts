export interface MathProblem {
  factorA: number;
  factorB: number;
  product: number;
}

export type GameStatus = 'idle' | 'playing' | 'correct' | 'wrong';

// Declaration for the global confetti function loaded via CDN
declare global {
  interface Window {
    confetti: (options?: any) => Promise<null> | null;
  }
}
