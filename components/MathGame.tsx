import React, { useState, useEffect, useRef } from 'react';
import { generateProblem } from '../utils/gameLogic';
import { MathProblem, GameStatus, GameMode } from '../types';
import { Button } from './Button';
import { Trophy, Flame, RefreshCcw, CheckCircle2, XCircle } from 'lucide-react';

interface MathGameProps {
  mode: GameMode;
}

export const MathGame: React.FC<MathGameProps> = ({ mode }) => {
  const [problem, setProblem] = useState<MathProblem>(() => generateProblem(mode));
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset game when mode changes
  useEffect(() => {
    handleReset();
  }, [mode]);

  // Focus input on mount, after submission, or mode change
  useEffect(() => {
    inputRef.current?.focus();
  }, [problem, status, mode]);

  const triggerConfetti = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#14b8a6']
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue) return;

    // Use parseFloat to handle decimal answers for PI mode
    const userAnswer = parseFloat(inputValue);
    
    // Check for equality. For floating points in this specific game (2 decimals max), exact match is expected.
    // If we needed loose tolerance, we would use Math.abs(userAnswer - problem.answer) < Number.EPSILON
    if (userAnswer === problem.answer) {
      // Correct Answer
      setStatus('correct');
      setScore(s => s + 10 + (streak * 2)); // Bonus for streaks
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak % 5 === 0) triggerConfetti(); // Extra celebration every 5
        return newStreak;
      });
      triggerConfetti();

      // Delay generating next problem slightly to show success state
      setTimeout(() => {
        setProblem(generateProblem(mode));
        setInputValue('');
        setStatus('idle');
      }, 600);
      
    } else {
      // Wrong Answer
      setStatus('wrong');
      setStreak(0);
      
      // Reset status to idle after shake animation
      setTimeout(() => {
        setStatus('idle');
        setInputValue('');
      }, 500);
    }
  };

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  const handleReset = () => {
    setScore(0);
    setStreak(0);
    setProblem(generateProblem(mode));
    setInputValue('');
    setStatus('idle');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Score Header */}
      <div className="flex justify-between items-center mb-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/50">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">得分</span>
          <span className="text-2xl font-black text-gray-800 font-mono">{score}</span>
        </div>
        
        <div className="flex flex-col items-center">
           <div className={`flex items-center space-x-1 ${streak > 2 ? 'text-orange-500' : 'text-gray-400'}`}>
            <Flame size={18} className={streak > 2 ? 'fill-orange-500 animate-pulse' : ''} />
            <span className="font-bold">{streak}</span>
           </div>
           <span className="text-[10px] font-bold text-gray-400 uppercase">连胜</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">最高</span>
          <div className="flex items-center space-x-1">
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-xl font-bold text-gray-700 font-mono">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Card */}
      <div className={`
        relative bg-white rounded-3xl shadow-2xl p-8 border-4 transition-all duration-300
        ${status === 'wrong' ? 'border-red-400 animate-shake bg-red-50' : ''}
        ${status === 'correct' ? 'border-green-400 bg-green-50 scale-105' : 'border-transparent'}
      `}>
        {/* Status Indicator Icon */}
        <div className="absolute top-4 right-4 transition-opacity duration-300">
          {status === 'correct' && <CheckCircle2 className="text-green-500 w-8 h-8" />}
          {status === 'wrong' && <XCircle className="text-red-500 w-8 h-8" />}
        </div>

        <div className="text-center mb-8 mt-4 flex flex-col items-center justify-center min-h-[120px]">
          {/* Main Problem Text */}
          <div className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight whitespace-nowrap">
            {problem.display.main}
          </div>
          
          {/* Sub Problem Text (e.g. result for factorization) */}
          {problem.display.sub && (
             <div className="text-4xl md:text-5xl font-black text-indigo-400 mt-2 tracking-tight">
               {problem.display.sub}
             </div>
          )}

          <div className="mt-4 text-gray-400 font-medium text-sm bg-gray-50 px-3 py-1 rounded-full">
            {problem.display.hintText}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text" 
            inputMode="decimal" // Better mobile keyboard for decimals
            pattern="[0-9.]*"
            value={inputValue}
            onChange={(e) => {
                // Allow numbers and a single decimal point
                const val = e.target.value;
                if (/^[\d.]*$/.test(val)) setInputValue(val);
            }}
            placeholder="?"
            className={`
              w-full h-20 text-center text-4xl font-bold rounded-2xl border-2 outline-none transition-all
              placeholder-gray-200 text-gray-800
              ${status === 'wrong' 
                ? 'border-red-300 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                : status === 'correct'
                  ? 'border-green-300 bg-green-50'
                  : 'border-indigo-100 bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20'
              }
            `}
          />
          <div className="mt-6">
            <Button 
              type="submit" 
              fullWidth 
              disabled={!inputValue || status !== 'idle'}
            >
              {status === 'idle' ? '提交答案' : status === 'correct' ? '回答正确！' : '再试一次'}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer / Reset */}
      <div className="mt-8 text-center">
        <button 
          onClick={handleReset}
          className="inline-flex items-center space-x-2 text-indigo-100 hover:text-white transition-colors text-sm font-medium opacity-80 hover:opacity-100"
        >
          <RefreshCcw size={14} />
          <span>重置游戏</span>
        </button>
      </div>

      {/* Instructions Overlay (Subtle) */}
      <div className="mt-4 text-center text-indigo-200/60 text-xs">
        按 <span className="font-bold border border-indigo-200/40 rounded px-1 mx-1">Enter</span> 键提交
      </div>
    </div>
  );
};