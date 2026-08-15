"use client";

import React, { useState } from 'react';
import { AppSettings, PersonaType } from '@/types/chat';
import {
  Sparkles,
  Settings,
  User,
  Volume2,
  VolumeX,
  Menu,
  ChevronDown,
  BrainCircuit,
  Terminal,
  Rocket,
  Wrench,
  Check,
  Edit2
} from 'lucide-react';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  onUpdateName: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onToggleSidebar,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(settings.userName);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const personas: { type: PersonaType; label: string; icon: any }[] = [
    { type: 'Tech AI Expert', label: 'Tech AI Expert', icon: BrainCircuit },
    { type: 'Code Architect', label: 'Code Architect', icon: Terminal },
    { type: 'Startup Mentor', label: 'Startup Mentor', icon: Rocket },
    { type: 'Quick Debugger', label: 'Quick Debugger', icon: Wrench },
  ];

  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-3 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left Section: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors lg:hidden cursor-pointer"
            title="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-gradient">NexusAI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800/50">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Free-Minded Tech AI Expert</p>
            </div>
          </div>
        </div>

        {/* Center: Persona Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">{settings.persona}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showPersonaMenu && (
            <div className="absolute left-0 mt-2 w-52 rounded-xl glass-panel border border-slate-700 shadow-2xl py-1 z-50">
              {personas.map((p) => {
                const IconComp = p.icon;
                return (
                  <button
                    key={p.type}
                    onClick={() => {
                      onUpdateSettings({ persona: p.type });
                      setShowPersonaMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-cyan-400" />
                      <span>{p.label}</span>
                    </div>
                    {settings.persona === p.type && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Section: User Name Badge, Speech Toggle, Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Name Badge & Quick Edit */}
          <div className="relative">
            {isEditingName ? (
              <div className="flex items-center gap-1 bg-slate-900 border border-cyan-500/50 rounded-xl px-2 py-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  placeholder="Your Name..."
                  className="bg-transparent text-xs text-slate-100 focus:outline-none w-24 sm:w-28"
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempName(settings.userName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-200 transition-all cursor-pointer group"
                title="Click to change your name"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-semibold max-w-[100px] truncate">
                  {settings.userName ? settings.userName : 'Set Name'}
                </span>
                <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-300" />
              </button>
            )}
          </div>

          {/* Speech TTS Toggle */}
          <button
            onClick={() => onUpdateSettings({ enableTTS: !settings.enableTTS })}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              settings.enableTTS
                ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={settings.enableTTS ? 'Audio TTS Enabled' : 'Audio TTS Muted'}
          >
            {settings.enableTTS ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title="Configure API key & AI model"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
