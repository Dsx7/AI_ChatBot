<div align="center">

  <img src="public/logo.webp" alt="NexusAI Logo" width="120" height="120" style="border-radius: 24px; margin-bottom: 10px;" />

  # ⚡ NexusAI - Smart Free-Minded AI Expert ChatBot

  <p align="center">
    <b>A personal, friendly, confident, and technically skilled AI assistant built for modern web applications.</b>
  </p>

  <p align="center">
    <a href="https://github.com/Dsx7/AI_ChatBot/stargazers"><img src="https://img.shields.io/github/stars/Dsx7/AI_ChatBot?style=for-the-badge&color=06b6d4" alt="Stars"></a>
    <a href="https://github.com/Dsx7/AI_ChatBot/network/members"><img src="https://img.shields.io/github/forks/Dsx7/AI_ChatBot?style=for-the-badge&color=10b981" alt="Forks"></a>
    <a href="https://github.com/Dsx7/AI_ChatBot/issues"><img src="https://img.shields.io/github/issues/Dsx7/AI_ChatBot?style=for-the-badge&color=8b5cf6" alt="Issues"></a>
    <a href="https://github.com/Dsx7/AI_ChatBot/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Dsx7/AI_ChatBot?style=for-the-badge&color=38bdf8" alt="License"></a>
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-environment-variables">Environment Variables</a> •
    <a href="#-author--credits">Author</a>
  </p>

</div>

---

## 🌟 Overview

**NexusAI** is a state-of-the-art AI chatbot designed with a **free-minded, confident, and human-like persona**. It is built specifically to assist developers, startup founders, and tech enthusiasts with programming, debugging, web development, cloud system design, and product ideas.

Unlike standard chatbots, NexusAI prioritizes **personalization**: it warmly asks for your name upon onboarding, remembers it across browser sessions in local storage, and incorporates it naturally into intelligent, context-aware conversations.

---

## ✨ Key Features

- 🧠 **Smart Onboarding & Name Memory**: 
  - Asks for the user's name on first arrival with interactive celebration confetti (`canvas-confetti`).
  - Persists identity in `localStorage` and uses it naturally in conversation.
  - Allows quick inline name editing directly from the header badge.

- ⚡ **Groq API Real-Time Streaming & Fallback**:
  - Connects to ultra-fast Groq models (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`).
  - Includes a built-in intelligent fallback engine for zero-key local operation out of the box.

- ⏹️ **Interactive Response Control**:
  - Abort stream at any time with a glowing real-time **Stop Generation** button (`AbortController`).

- 🎨 **Glassmorphism Dark UI & Aesthetics**:
  - Futuristic dark design tokens with glowing cyan/emerald accents and micro-animations.
  - Fenced code blocks with language syntax highlighting and 1-click **Copy Code** button.

- 🎙️ **Voice Dictation & Text-to-Speech (TTS)**:
  - Speech Recognition (Speech-to-Text) for hands-free voice input.
  - Built-in Web Speech Synthesis to read responses aloud.

- 🎭 **Persona Selector**:
  - Switch between focused expertise personas: *Tech AI Expert*, *Code Architect*, *Startup Mentor*, and *Quick Debugger*.

- 📜 **Chat History & Exporting**:
  - Multiple chat thread management saved locally.
  - Search past conversation history instantly.
  - Export chat transcripts as formatted Markdown (`.md`) files.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Frontend Library**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom Glassmorphism Tokens
- **Icons & Animations**: [Lucide React](https://lucide.dev/), `canvas-confetti`
- **AI Inference API**: [Groq API](https://groq.com/) (`llama-3.3-70b-versatile`)
- **Deployment**: [Netlify](https://www.netlify.com/)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or higher
- npm, pnpm, or yarn

### 2. Clone Repository
```bash
git clone https://github.com/Dsx7/AI_ChatBot.git
cd AI_ChatBot
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Get your API key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 🔒 Security & Netlify Deployment

This repository includes a pre-configured `netlify.toml` file that disables secrets scanning for build cache artifacts while preserving environment variable secrecy server-side:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "GROQ_API_KEY"
  SECRETS_SCAN_ENABLED = "false"
```

---

## 👤 Author & Credits

Designed and developed with ❤️ by **Al Helal Mohammod Bayazid**.

- **GitHub Profile**: [@Dsx7](https://github.com/Dsx7/)
- **Project Repository**: [Dsx7/AI_ChatBot](https://github.com/Dsx7/AI_ChatBot)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
