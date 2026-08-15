"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Lightbulb, Code, Rocket, Cpu, Wrench, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onStopGeneration?: () => void;
  isLoading: boolean;
  hasMessages: boolean;
  userName?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isLoading,
  hasMessages,
  userName,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) {
      if (onStopGeneration) onStopGeneration();
      return;
    }
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Web Speech Recognition for voice input
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const suggestionChips = [
    { label: 'Startup AI Ideas', icon: Rocket, query: 'Brainstorm 3 high-impact AI startup ideas with technical stack blueprints.' },
    { label: 'Debug React/Next.js', icon: Wrench, query: 'Help me debug a Next.js App Router API route error step-by-step.' },
    { label: 'System Design', icon: Cpu, query: 'How do I architect a scalable high-concurrency microservices system?' },
    { label: 'Code Clean Up', icon: Code, query: 'Show me an example of writing scalable TypeScript with React 19.' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-2">
      {/* Suggestion Chips when conversation is fresh */}
      {!hasMessages && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Suggested Conversation Topics</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {suggestionChips.map((chip, idx) => {
              const IconComp = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onSendMessage(chip.query)}
                  className="flex items-center gap-3 p-3 rounded-xl glass-panel-interactive text-left group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {chip.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {chip.query}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 rounded-2xl glass-panel border border-slate-700/60 shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
      >
        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
          }`}
          title={isListening ? 'Stop listening' : 'Voice input (Dictate)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            isLoading
              ? "Nexus AI is typing... Click Stop to pause."
              : userName
              ? `Message Nexus AI, ${userName}... (Press Shift+Enter for new line)`
              : "What is your name? Or ask anything..."
          }
          rows={1}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none resize-none min-h-[44px] max-h-[180px] py-2.5 px-1 leading-relaxed disabled:opacity-50"
        />

        {/* Submit or Stop Button */}
        {isLoading ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="p-2.5 px-4 rounded-xl font-bold flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 shadow-lg shadow-red-900/30 transition-all cursor-pointer animate-pulse"
            title="Stop generating response"
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="text-xs font-semibold">Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
              input.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 scale-100 hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </form>

      <div className="flex items-center justify-between mt-2 px-2 text-[11px] text-slate-500 font-mono">
        <span>Free-Minded Tech AI Expert Mode Active</span>
        <span>{isLoading ? 'Streaming live...' : 'Enter ↵ to Send'}</span>
      </div>
    </div>
  );
};
