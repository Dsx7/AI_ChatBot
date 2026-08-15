"use client";

import React, { useState } from 'react';
import { AppSettings, PersonaType } from '@/types/chat';
import { X, Key, Cpu, User, Volume2, Save, Sparkles, Check, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const models = [
    { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B (Versatile - Recommended)' },
    { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B (Instant & Ultra Fast)' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Long Context 32K)' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Google AI)' },
  ];

  const personas: PersonaType[] = [
    'Tech AI Expert',
    'Code Architect',
    'Startup Mentor',
    'Quick Debugger',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-slate-100">System & Engine Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-sm">
          {/* User Name Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Your Preferred Name</span>
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="e.g. Bayazid"
              className="w-full px-3.5 py-2.5 bg-slate-900/90 rounded-xl text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
            <p className="text-[11px] text-slate-400">
              Nexus AI will remember and address you by this name in all responses.
            </p>
          </div>

          {/* Groq API Key */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Groq API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2.5 bg-slate-900/90 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-xs border border-slate-800 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
            />
            <div className="flex items-start gap-1.5 text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                If left blank, the app uses the built-in AI expert engine. Providing your Groq key connects to ultra-fast 70B model inference!
              </span>
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Model Architecture</span>
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl text-slate-100 border border-slate-800 focus:outline-none focus:border-cyan-500/60 text-xs font-mono"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Persona Style */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Active Persona Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {personas.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFormData({ ...formData, persona: p })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    formData.persona === p
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Audio TTS toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Enable Text-To-Speech (Read Aloud)</span>
            </div>
            <input
              type="checkbox"
              checked={formData.enableTTS}
              onChange={(e) => setFormData({ ...formData, enableTTS: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
