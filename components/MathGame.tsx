import React, { useState, useEffect, useRef } from 'react';
import { generateProblem } from '../utils/gameLogic';
import { MathProblem, GameStatus, GameMode } from '../types';
import { Button } from './Button';
import { Trophy, Flame, RefreshCcw, CheckCircle2, XCircle, Keyboard, MousePointerClick } from 'lucide-react';
import { playGameSound } from '../utils/audio';

interface MathGameProps {
  mode: GameMode;
}

type InputType = 'choice' | 'text';

export const MathGame: React.FC<MathGameProps> = ({ mode }) => {
  const [problem, setProblem] = useState<MathProblem>(() => generateProblem(mode));
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [inputType, setInputType] = useState<InputType>('choice');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset game when mode changes
  useEffect(() => {
    handleReset();
  }, [mode]);

  // Focus input on mount, after submission, or mode change if in text mode
  useEffect(() => {
    if (inputType === 'text' && status === 'idle') {
      inputRef.current?.focus();
    }
  }, [problem, status, mode, inputType]);

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

  const handleCorrectAnswer = () => {
    playGameSound('correct');
    setStatus('correct');
    setScore(s => s + 10 + (streak * 2)); 
    setStreak(s => {
      const newStreak = s + 1;
      if (newStreak % 5 === 0) triggerConfetti();
      return newStreak;
    });
    triggerConfetti();

    setTimeout(() => {
      setProblem(generateProblem(mode));
      setInputValue('');
      setStatus('idle');
    }, 600);
  };

  const handleWrongAnswer = () => {
    playGameSound('wrong');
    setStatus('wrong');
    setStreak(0);
    
    setTimeout(() => {
      setStatus('idle');
      setInputValue('');
    }, 500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue) return;

    const userAnswer = parseFloat(inputValue);
    if (userAnswer === problem.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleOptionClick = (val: number) => {
    if (status !== 'idle') return;
    
    // For visualization consistency, set the input value to the clicked option
    setInputValue(val.toString());

    if (val === problem.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
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
    if (inputType === 'text') inputRef.current?.focus();
  };

  // Render Logic helpers
  const renderProblemDisplay = () => {
    if (mode === 'factorization' && problem.customVisual) {
      const { root, left, right } = problem.customVisual;
      
      const leftDisplay = left === '?' ? (inputValue || '?') : left;
      const rightDisplay = right === '?' ? (inputValue || '?') : right;
      
      const isLeftActive = left === '?';
      const isRightActive = right === '?';

      return (
        <div className="flex flex-col items-center justify-center w-full max-w-[240px] h-[180px] relative">
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="50%" y1="25%" x2="20%" y2="75%" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
            <line x1="50%" y1="25%" x2="80%" y2="75%" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg ring-4 ring-indigo-100">
              {root}
            </div>
          </div>
          <div className="absolute bottom-0 w-full flex justify-between px-4">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-md transition-colors z-10 ${isLeftActive ? 'bg-white border-4 border-indigo-400 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              {leftDisplay}
            </div>
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-md transition-colors z-10 ${isRightActive ? 'bg-white border-4 border-indigo-400 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              {rightDisplay}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center flex flex-col items-center justify-center">
        <div className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight whitespace-nowrap">
          {problem.display.main}
        </div>
        {problem.display.sub && (
           <div className="text-4xl md:text-5xl font-black text-indigo-400 mt-2 tracking-tight">
             {problem.display.sub}
           </div>
        )}
      </div>
    );
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
        relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 transition-all duration-300
        ${status === 'wrong' ? 'border-red-400 animate-shake bg-red-50' : ''}
        ${status === 'correct' ? 'border-green-400 bg-green-50 scale-105' : 'border-transparent'}
      `}>
        {/* Toggle Input Mode Switch */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => {
              setInputType(prev => prev === 'choice' ? 'text' : 'choice');
              setInputValue('');
              inputRef.current?.focus();
            }}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            title={inputType === 'choice' ? "切换到填空模式" : "切换到选择题模式"}
          >
            {inputType === 'choice' ? <Keyboard size={20} /> : <MousePointerClick size={20} />}
          </button>
        </div>

        {/* Status Indicator Icon */}
        <div className="absolute top-4 right-4 transition-opacity duration-300">
          {status === 'correct' && <CheckCircle2 className="text-green-500 w-8 h-8" />}
          {status === 'wrong' && <XCircle className="text-red-500 w-8 h-8" />}
        </div>

        <div className="mb-8 mt-4 flex flex-col items-center justify-center min-h-[160px]">
          {renderProblemDisplay()}
          
          <div className="mt-4 text-gray-400 font-medium text-sm bg-gray-50 px-3 py-1 rounded-full">
            {problem.display.hintText}
          </div>
        </div>

        {/* Input Area: Choice vs Text */}
        {inputType === 'choice' ? (
          <div className="grid grid-cols-3 gap-3">
             {problem.options?.map((option, idx) => (
               <button
                 key={idx}
                 onClick={() => handleOptionClick(option)}
                 disabled={status !== 'idle'}
                 className={`
                    py-4 rounded-xl text-xl font-bold shadow-sm transition-all border-b-4 active:border-b-0 active:translate-y-1
                    ${status === 'idle' 
                       ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' 
                       : (option === problem.answer 
                          ? 'bg-green-500 text-white border-green-700' 
                          : 'bg-gray-100 text-gray-400 border-gray-200')
                    }
                 `}
               >
                 {option}
               </button>
             ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text" 
              inputMode="decimal" 
              pattern="[0-9.]*"
              value={inputValue}
              onChange={(e) => {
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
        )}
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
      
      {/* Instructions Overlay */}
      {inputType === 'text' && (
        <div className="mt-4 text-center text-indigo-200/60 text-xs">
          按 <span className="font-bold border border-indigo-200/40 rounded px-1 mx-1">Enter</span> 键提交
        </div>
      )}
    </div>
  );
};
