"use client";

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot, User, Volume2, VolumeX, Copy, Check, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  userName?: string;
  enableTTS?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, userName, enableTTS = true }) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for speech
    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, 'Code snippet provided in chat.')
      .replace(/[*#`_]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group flex items-start gap-3 sm:gap-4 py-4 px-3 sm:px-5 rounded-2xl transition-all duration-200 ${
        isUser
          ? 'bg-slate-900/40 border border-slate-800/40 ml-4 sm:ml-12'
          : 'bg-[#0e1626]/80 border border-slate-800/80 mr-2 sm:mr-8 shadow-xl glass-panel'
      }`}
    >
      {/* Avatar Icon */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-900/30 ring-2 ring-cyan-500/20 font-bold text-sm">
            {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
        ) : (
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-900/40 ring-2 ring-violet-500/30">
              <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#090d16] rounded-full"></span>
          </div>
        )}
      </div>

      {/* Message Body & Actions */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Top Header info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm text-slate-200">
              {isUser ? userName || 'You' : 'Nexus AI Expert'}
            </span>
            {!isUser && (
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                AI Expert
              </span>
            )}
            <span className="text-[11px] text-slate-500 font-mono">
              {message.timestamp}
            </span>
          </div>

          {/* Action buttons (Copy / Speak) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {!isUser && (
              <button
                onClick={toggleSpeech}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer ${
                  isSpeaking ? 'text-cyan-400 bg-slate-800 animate-pulse' : ''
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={copyMessage}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy message text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="text-slate-100 text-sm sm:text-base leading-relaxed">
          {message.content ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="flex items-center gap-2 text-slate-400 py-1 font-mono text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Thinking and formulating answer...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
