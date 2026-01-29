import React, { useState, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon.tsx';
import { ClearIcon } from './icons/ClearIcon.tsx';
import { SparkleIcon } from './icons/SparkleIcon.tsx';
import { UndoIcon } from './icons/UndoIcon.tsx';
import { BoldIcon, ItalicIcon, BoldItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon, ListIcon, OrderedListIcon } from './icons/FormatIcons.tsx';
import { transformToBold, transformToItalic, transformToBoldItalic, transformToUnderline } from '../services/unicodeUtils.ts';

interface EditorProps {
  markdownText: string;
  setMarkdownText: (text: string) => void;
  unicodeText: string;
  setUnicodeText: (text: string) => void;
  onImprove: () => void;
  onFormat: () => void;
  onSummarize: () => void;
  onUndo: () => void;
  isLoading: false | 'improve' | 'format' | 'summarize';
  canUndo: boolean;
}

const Editor: React.FC<EditorProps> = ({
  markdownText,
  setMarkdownText,
  unicodeText,
  setUnicodeText,
  onImprove,
  onFormat,
  onSummarize,
  onUndo,
  isLoading,
  canUndo,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);
  const unicodeTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(unicodeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setMarkdownText('');
    markdownTextareaRef.current?.focus();
  };

  const insertMarkdownFormatting = (prefix: string, suffix: string) => {
    if (!markdownTextareaRef.current) return;
    const textarea = markdownTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = markdownText;
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    setMarkdownText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const applyListFormatting = (type: 'ul' | 'ol') => {
    if (!markdownTextareaRef.current) return;
    const textarea = markdownTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = markdownText;
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;
    const lines = text.substring(lineStart, lineEnd).split('\n');
    const processedLines = lines.map((line, i) => {
      const match = line.match(/^(\s*)(.*)/);
      const indent = match ? match[1] : '';
      const content = match ? match[2] : line;
      if (type === 'ul') return `${indent}* ${content}`;
      return `${indent}${i + 1}. ${content}`;
    });
    const newText = text.substring(0, lineStart) + processedLines.join('\n') + text.substring(lineEnd);
    setMarkdownText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + processedLines.join('\n').length);
    }, 0);
  };

  const applyUnicodeStyle = (transformFn: (text: string) => string) => {
    if (!unicodeTextareaRef.current) return;
    const textarea = unicodeTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = unicodeText;
    if (start === end) return;
    const transformedSelection = transformFn(text.substring(start, end));
    const newText = text.substring(0, start) + transformedSelection + text.substring(end);
    setUnicodeText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + transformedSelection.length);
    }, 0);
  };

  const ToolbarButton: React.FC<{ icon: React.ReactNode; onClick: () => void; title: string }> = ({ icon, onClick, title }) => (
    <button
      onClick={onClick}
      className="p-2 text-cyan-500 hover:text-black hover:bg-cyan-500 border border-cyan-900 transition-all duration-200"
      title={title}
    >
      {icon}
    </button>
  );

  const AiButton: React.FC<{ onClick: () => void; loading: boolean; children: React.ReactNode; color: 'pink' | 'cyan' }> = ({ onClick, loading, children, color }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 disabled:opacity-50
        ${color === 'pink' ? 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]' : 
                          'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]'}`}
    >
      {loading ? 'PROCESSING...' : children}
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[75vh]">
      {/* Input Module */}
      <div className="flex flex-col border-2 border-cyan-500 bg-black shadow-[0_0_20px_rgba(0,243,255,0.15)] relative">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] border border-cyan-500">
          Module_A // Source_Stream
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-cyan-900 bg-cyan-950/20 gap-4">
          <h2 className="font-black text-cyan-500 text-lg uppercase italic tracking-wider">Input_Raw</h2>
          <div className="flex flex-wrap items-center gap-3">
             <AiButton onClick={onFormat} loading={isLoading === 'format'} color="cyan">Format</AiButton>
             <AiButton onClick={onImprove} loading={isLoading === 'improve'} color="pink">Optimize</AiButton>
             <AiButton onClick={onSummarize} loading={isLoading === 'summarize'} color="cyan">Compress</AiButton>
          </div>
        </div>

        <div className="flex items-center gap-1 p-3 bg-black border-b border-cyan-900 flex-wrap overflow-x-auto">
          <ToolbarButton icon={<BoldIcon />} onClick={() => insertMarkdownFormatting('**', '**')} title="Bold" />
          <ToolbarButton icon={<ItalicIcon />} onClick={() => insertMarkdownFormatting('*', '*')} title="Italic" />
          <ToolbarButton icon={<UnderlineIcon />} onClick={() => insertMarkdownFormatting('<u>', '</u>')} title="Underline" />
          <ToolbarButton icon={<StrikethroughIcon />} onClick={() => insertMarkdownFormatting('~~', '~~')} title="Strikethrough" />
          <ToolbarButton icon={<CodeIcon />} onClick={() => insertMarkdownFormatting('`', '`')} title="Monospace" />
          <div className="w-px h-6 bg-cyan-900 mx-1"></div>
          <ToolbarButton icon={<ListIcon />} onClick={() => applyListFormatting('ul')} title="UL" />
          <ToolbarButton icon={<OrderedListIcon />} onClick={() => applyListFormatting('ol')} title="OL" />
          <div className="ml-auto flex gap-1">
            <ToolbarButton icon={<UndoIcon />} onClick={onUndo} title="Revert" />
            <button onClick={handleClear} className="p-2 text-red-500 hover:bg-red-500 hover:text-black border border-red-900 transition-colors"><ClearIcon /></button>
          </div>
        </div>

        <textarea
          ref={markdownTextareaRef}
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
          placeholder="ENTER_SOURCE_MARKDOWN..."
          className="flex-grow p-8 bg-transparent text-cyan-50/90 resize-none focus:outline-none placeholder-cyan-900 w-full text-base leading-relaxed scrollbar-thin"
          spellCheck="false"
        />
      </div>

      {/* Output Module - Now with unified structural Cyan border/label */}
      <div className="flex flex-col border-2 border-cyan-500 bg-black shadow-[0_0_20px_rgba(0,243,255,0.15)] relative">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] border border-cyan-500">
          Module_B // Decoded_Output
        </div>

        <div className="flex justify-between items-center p-6 border-b border-cyan-900 bg-cyan-950/20">
          <h2 className="font-black text-pink-500 text-lg uppercase italic tracking-wider">Unicode_Signal</h2>
          <button
            onClick={handleCopy}
            className={`px-8 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 flex items-center gap-3
              ${isCopied ? 'bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 
                           'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]'}`}
          >
            <CopyIcon />
            {isCopied ? 'SYNCED' : 'TRANSFER'}
          </button>
        </div>
        
        <div className="flex items-center gap-1 p-3 bg-black border-b border-cyan-900 flex-wrap overflow-x-auto">
            <span className="text-[10px] text-cyan-700 px-2 uppercase font-bold select-none">TRANSFORM_SELECTION:</span>
            <ToolbarButton icon={<BoldIcon />} onClick={() => applyUnicodeStyle(transformToBold)} title="Bold" />
            <ToolbarButton icon={<ItalicIcon />} onClick={() => applyUnicodeStyle(transformToItalic)} title="Italic" />
            <ToolbarButton icon={<BoldItalicIcon />} onClick={() => applyUnicodeStyle(transformToBoldItalic)} title="Bold+Italic" />
            <ToolbarButton icon={<UnderlineIcon />} onClick={() => applyUnicodeStyle(transformToUnderline)} title="Underline" />
        </div>

        <textarea
          ref={unicodeTextareaRef}
          value={unicodeText}
          onChange={(e) => setUnicodeText(e.target.value)}
          placeholder="WAITING_FOR_SIGNAL..."
          className="flex-grow p-8 bg-black text-pink-50/90 resize-none focus:outline-none placeholder-pink-900 w-full text-lg leading-relaxed scrollbar-thin"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Editor;