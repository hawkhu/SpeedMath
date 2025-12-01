import React from 'react';
import { MathGame } from './components/MathGame';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-800 flex items-center justify-center p-4">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            Speed<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Math</span>
          </h1>
          <p className="text-indigo-200 mt-2 font-medium">Keep it under 200</p>
        </header>

        <MathGame />
      </div>
    </div>
  );
};

export default App;
