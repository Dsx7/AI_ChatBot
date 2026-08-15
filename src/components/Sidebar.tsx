"use client";

import React, { useState } from 'react';
import { ChatSession } from '@/types/chat';
import {
  Plus,
  MessageSquare,
  Trash2,
  Download,
  X,
  Sparkles,
  Zap,
  Key,
  Database,
  Code,
  ShieldAlert,
  Search
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onExportChat: () => void;
  hasApiKey: boolean;
  activeModel: string;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onExportChat,
  hasApiKey,
  activeModel,
  userName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-72 sm:w-80 glass-panel border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & New Chat Button */}
        <div className="p-4 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversations
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Chat Thread</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 rounded-lg text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs font-mono">
              No matching conversations.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 border border-slate-700/80 font-medium'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{session.title}</span>
                  </div>

                  {/* Delete session button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                    title="Delete chat thread"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & System Status */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          {/* Export Chat */}
          <button
            onClick={onExportChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Chat Transcript</span>
          </button>

          {/* Model Status Card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Engine Status:</span>
              {hasApiKey ? (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/50">
                  Groq API Connected
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/50">
                  Built-in AI Mode
                </span>
              )}
            </div>
            <div className="text-slate-400 truncate">
              Model: <span className="text-slate-200 font-mono">{activeModel}</span>
            </div>
            <div className="text-slate-400 truncate">
              User: <span className="text-cyan-300 font-semibold">{userName || 'Unset'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
