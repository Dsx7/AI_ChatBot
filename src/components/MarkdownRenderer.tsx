"use client";

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Parse code blocks vs regular markdown content
  const parseContent = (raw: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      const textBefore = raw.substring(lastIndex, match.index);
      if (textBefore) {
        elements.push(
          <div key={`text-${lastIndex}`} className="space-y-2 leading-relaxed">
            {renderFormattedText(textBefore)}
          </div>
        );
      }

      const language = match[1] || 'code';
      const codeSnippet = match[2].trim();
      const currentBlock = blockIndex++;

      elements.push(
        <div key={`code-${match.index}`} className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1322] shadow-2xl">
          {/* Code Block Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-semibold uppercase tracking-wider">{language}</span>
            </div>
            <button
              onClick={() => copyToClipboard(codeSnippet, currentBlock)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium border border-slate-700/50 cursor-pointer"
              title="Copy code to clipboard"
            >
              {copiedIndex === currentBlock ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {/* Code Body */}
          <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200 selection:bg-cyan-500/40">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    const textRemaining = raw.substring(lastIndex);
    if (textRemaining) {
      elements.push(
        <div key={`text-${lastIndex}`} className="space-y-2 leading-relaxed">
          {renderFormattedText(textRemaining)}
        </div>
      );
    }

    return elements;
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-100 mt-4 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full inline-block"></span>
            {formatInlineText(line.replace('### ', ''))}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-cyan-300 mt-5 mb-3 border-b border-slate-800 pb-1.5">
            {formatInlineText(line.replace('## ', ''))}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl font-black text-cyan-300 mt-6 mb-4">
            {formatInlineText(line.replace('# ', ''))}
          </h1>
        );
      }

      // Bullet List
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1 ml-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
            <div className="flex-1">{formatInlineText(itemContent)}</div>
          </div>
        );
      }

      // Numbered List
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1 ml-2 text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs font-bold border border-slate-700 shrink-0">
              {numMatch[1]}
            </span>
            <div className="flex-1 pt-0.5">{formatInlineText(numMatch[2])}</div>
          </div>
        );
      }

      // Empty line spacing
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (str: string) => {
    // Replace **bold**, *italic*, `code`
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-xs border border-slate-700/60 mx-0.5">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return <div className="markdown-content">{parseContent(content)}</div>;
};
