import React, { useState } from 'react';
import { MathGame } from './components/MathGame';
import { GameMode } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('multiplication');

  const modes: { id: GameMode; label: string }[] = [
    { id: 'multiplication', label: '乘法速算' },
    { id: 'power', label: '乘方速算' },
    { id: 'factorization', label: '因数分解' },
    { id: 'pi', label: '3.14 速算' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-800 flex flex-col items-center justify-center p-4 relative">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm mb-6">
            极速<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">心算</span>
          </h1>
          
          {/* Centered Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/10 backdrop-blur-md rounded-2xl mx-auto w-fit border border-white/10">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                  ${currentMode === mode.id 
                    ? 'bg-white text-indigo-700 shadow-md transform scale-105' 
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </header>

        <MathGame mode={currentMode} />
      </div>
    </div>
  );
};

export default App;