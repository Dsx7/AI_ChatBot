"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatSession, AppSettings } from '@/types/chat';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { SettingsModal } from '@/components/SettingsModal';
import { NameOnboardingCard } from '@/components/NameOnboardingCard';
import { Footer } from '@/components/Footer';
import { Sparkles, Bot, Trash2 } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  userName: '',
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  persona: 'Tech AI Expert',
  enableTTS: true,
  ttsSpeed: 1.0,
};

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const [hasServerKey, setHasServerKey] = useState<boolean>(false);

  // Initialize state from localStorage and check server API key status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasServerKey) {
          setHasServerKey(true);
        }
      })
      .catch((err) => console.error(err));

    // Load user name
    const savedName = localStorage.getItem('nexus_user_name') || '';

    // Load settings
    const savedSettingsRaw = localStorage.getItem('nexus_app_settings');
    let loadedSettings = DEFAULT_SETTINGS;
    if (savedSettingsRaw) {
      try {
        loadedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettingsRaw) };
      } catch (e) {
        console.error(e);
      }
    }
    if (savedName) {
      loadedSettings.userName = savedName;
    }
    setSettings(loadedSettings);

    // Load sessions
    const savedSessionsRaw = localStorage.getItem('nexus_chat_sessions');
    if (savedSessionsRaw) {
      try {
        const parsedSessions: ChatSession[] = JSON.parse(savedSessionsRaw);
        if (parsedSessions.length > 0) {
          setSessions(parsedSessions);
          setCurrentSessionId(parsedSessions[0].id);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Initialize first default session
    createNewSession(savedName);
  }, []);

  // Save settings when modified
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_app_settings', JSON.stringify(updated));
      if (newSettings.userName !== undefined) {
        localStorage.setItem('nexus_user_name', newSettings.userName);
      }
    }
  };

  const updateUserName = (name: string) => {
    updateSettings({ userName: name });

    // Update active chat greeting if it's the initial prompt
    if (currentSessionId && sessions.length > 0) {
      const currentSession = sessions.find((s) => s.id === currentSessionId);
      if (currentSession && currentSession.messages.length <= 2) {
        const newWelcomeMessage: Message = {
          id: 'welcome-ack-' + Date.now(),
          role: 'assistant',
          content: `Great to connect with you, **${name}**! 🎉 I've saved your name for our conversation.\n\nAs your free-minded AI Tech Expert, I'm ready to assist you with programming, debugging, system architecture, web development, or startup ideas.\n\nWhat are we building or tackling today, **${name}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedSessions = sessions.map((s) => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: [s.messages[0], newWelcomeMessage],
            };
          }
          return s;
        });

        saveSessions(updatedSessions);
      }
    }
  };

  // Helper to persist sessions array
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_chat_sessions', JSON.stringify(updatedSessions));
    }
  };

  // Create a new Chat session thread
  const createNewSession = (nameOverride?: string) => {
    const name = nameOverride !== undefined ? nameOverride : settings.userName;
    const newId = 'session-' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const initialGreeting: Message = {
      id: 'init-msg-' + Date.now(),
      role: 'assistant',
      content: name
        ? `Hi **${name}**! 👋 Welcome back. I'm your free-minded AI Tech Expert. What technical challenge or idea shall we work on today?`
        : `Hi there! Welcome! 🚀 I'm your free-minded AI Tech Expert. Before we jump into code, system design, or startup ideas—**what is your name?**`,
      timestamp,
    };

    const newSession: ChatSession = {
      id: newId,
      title: name ? `Tech Chat (${new Date().toLocaleDateString()})` : 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [initialGreeting],
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    setCurrentSessionId(newId);
  };

  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Handle sending user message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !activeSession || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
      timestamp,
    };

    // Check if the user is answering with their name for the first time
    if (!settings.userName) {
      const namePatterns = [
        /(?:my name is|i'm|i am|call me|this is)\s+([a-zA-Z0-9_\-\s]{2,25})/i,
        /^([a-zA-Z]{2,20})$/i,
      ];
      for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          const candidate = match[1].trim();
          if (!['hi', 'hello', 'hey', 'what', 'yes', 'no', 'help'].includes(candidate.toLowerCase())) {
            updateSettings({ userName: candidate });
            break;
          }
        }
      }
    }

    // Append user message immediately
    const updatedMessages = [...activeSession.messages, userMsg];
    
    // Auto title chat session based on first user question
    let newTitle = activeSession.title;
    if (activeSession.messages.length <= 1) {
      newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title: newTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    const nextSessions = sessions.map((s) => (s.id === currentSessionId ? updatedSession : s));
    saveSessions(nextSessions);

    // Create placeholder assistant message for streaming
    const assistantMsgId = 'ast-' + Date.now();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const streamingMessages = [...updatedMessages, assistantMsg];
    saveSessions(
      nextSessions.map((s) => (s.id === currentSessionId ? { ...s, messages: streamingMessages } : s))
    );

    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages,
          userName: settings.userName,
          apiKey: settings.apiKey,
          model: settings.model,
          persona: settings.persona,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server response error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response stream received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let lineBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split('\n');
        // Keep the last incomplete line fragment in lineBuffer
        lineBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const dataStr = trimmedLine.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                accumulatedContent += delta;

                // Update assistant streaming message content live
                setSessions((prevSessions) =>
                  prevSessions.map((s) => {
                    if (s.id === currentSessionId) {
                      const msgs = s.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m
                      );
                      return { ...s, messages: msgs };
                    }
                    return s;
                  })
                );
              }
            } catch (e) {
              // Ignore non-JSON or partial chunk line
            }
          }
        }
      }

      // Process any remaining fragment in lineBuffer
      if (lineBuffer.trim().startsWith('data: ')) {
        const dataStr = lineBuffer.trim().slice(6).trim();
        if (dataStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              accumulatedContent += delta;
            }
          } catch (e) {}
        }
      }

      // Persist final accumulated response to localStorage
      setSessions((prevSessions) => {
        const finalSessions = prevSessions.map((s) => {
          if (s.id === currentSessionId) {
            const msgs = s.messages.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m
            );
            return { ...s, messages: msgs };
          }
          return s;
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('nexus_chat_sessions', JSON.stringify(finalSessions));
        }
        return finalSessions;
      });

    } catch (err: any) {
      console.error('Chat stream failure:', err);
      // Fallback error message
      setSessions((prevSessions) =>
        prevSessions.map((s) => {
          if (s.id === currentSessionId) {
            const msgs = s.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `⚠️ Communication error: ${err.message || 'Unable to connect'}. Please check your network or Groq API key configuration in Settings.`,
                  }
                : m
            );
            return { ...s, messages: msgs };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    saveSessions(filtered);
    if (filtered.length > 0) {
      setCurrentSessionId(filtered[0].id);
    } else {
      createNewSession();
    }
  };

  const handleExportChat = () => {
    if (!activeSession) return;
    const content = activeSession.messages
      .map((m) => `### ${m.role === 'user' ? settings.userName || 'User' : 'Nexus AI'} (${m.timestamp})\n\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_chat_${activeSession.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => setCurrentSessionId(id)}
        onNewChat={() => createNewSession()}
        onDeleteSession={handleDeleteSession}
        onExportChat={handleExportChat}
        hasApiKey={!!settings.apiKey || hasServerKey}
        activeModel={settings.model}
        userName={settings.userName}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Header */}
        <Header
          settings={settings}
          onUpdateSettings={updateSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onUpdateName={updateUserName}
        />

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Show Onboarding Name Card if user name is not yet set */}
            {!settings.userName && (
              <NameOnboardingCard onSetName={(name) => updateUserName(name)} />
            )}

            {/* Message bubbles */}
            {activeSession?.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userName={settings.userName}
                enableTTS={settings.enableTTS}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          isLoading={isLoading}
          hasMessages={activeSession ? activeSession.messages.length > 2 : false}
          userName={settings.userName}
        />

        {/* Footer */}
        <Footer />
      </div>

      {/* Configuration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => updateSettings(newSettings)}
      />
    </div>
  );
}
