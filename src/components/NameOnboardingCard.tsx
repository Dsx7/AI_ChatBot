"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, UserCheck, Code, Zap } from 'lucide-react';

interface NameOnboardingCardProps {
  onSetName: (name: string) => void;
}

export const NameOnboardingCard: React.FC<NameOnboardingCardProps> = ({ onSetName }) => {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    // Trigger confetti celebration effect
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#8b5cf6'],
      });
    } catch (err) {
      console.error(err);
    }

    onSetName(inputName.trim());
  };

  return (
    <div className="w-full max-w-lg mx-auto my-6 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl glow-cyan animate-fadeIn space-y-6 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Icon header */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-xl shadow-cyan-500/30 mb-2">
        <Sparkles className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-100 tracking-tight">
          Welcome to <span className="text-gradient">NexusAI</span>
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          I'm your free-minded, confident AI Tech Expert. Before we jump into programming, startup ideas, system design, or debugging:
        </p>
        <p className="text-base font-extrabold text-cyan-300 pt-1">
          What is your name? 👋
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto pt-2">
        <div className="relative">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your name (e.g. Bayazid)..."
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 text-slate-100 placeholder-slate-500 border border-slate-700/80 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!inputName.trim()}
          className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            inputName.trim()
              ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-cyan-500/30 scale-100 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Continue Conversation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Groq Powered</span>
        </div>
        <div className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved Locally</span>
        </div>
      </div>
    </div>
  );
};
