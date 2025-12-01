export type GameMode = 'multiplication' | 'power' | 'factorization' | 'pi';

export interface MathProblem {
  mode: GameMode;
  answer: number;
  display: {
    main: string;      // The primary part (e.g., "12 × 5", "15²", "12 × ?")
    sub?: string;      // Optional secondary part (e.g., "= 96" for factorization)
    hintText: string;  // Contextual text (e.g., "Result ≤ 200")
  };
  // Optional structure for advanced visualizations (like the binary tree)
  customVisual?: {
    root: number;
    left: number | '?';
    right: number | '?';
  };
}

export type GameStatus = 'idle' | 'playing' | 'correct' | 'wrong';

// Declaration for the global confetti function loaded via CDN
declare global {
  interface Window {
    confetti: (options?: any) => Promise<null> | null;
  }
}