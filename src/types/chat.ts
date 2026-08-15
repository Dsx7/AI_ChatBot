export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export type PersonaType = 'Tech AI Expert' | 'Code Architect' | 'Startup Mentor' | 'Quick Debugger';

export interface AppSettings {
  userName: string;
  apiKey: string;
  model: string;
  persona: PersonaType;
  enableTTS: boolean;
  ttsSpeed: number;
}
