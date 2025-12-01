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
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleClear = () => {
    setMarkdownText('');
    if (markdownTextareaRef.current) {
      markdownTextareaRef.current.focus();
    }
  };

  // Logic for Input Panel (Markdown)
  const insertMarkdownFormatting = (prefix: string, suffix: string) => {
    if (!markdownTextareaRef.current) return;

    const textarea = markdownTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = markdownText;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
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

    // Expand selection to full lines
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;

    const selectedText = text.substring(lineStart, lineEnd);
    const lines = selectedText.split('\n');

    const processedLines = lines.map((line, i) => {
        // match indentation and existing markers
        const match = line.match(/^(\s*)(.*)/);
        const indent = match ? match[1] : '';
        const content = match ? match[2] : line;
        
        // check if already list
        const listMatch = content.match(/^([*+\-]|\d+\.)\s+(.*)/);
        
        if (listMatch) {
            // Already a list item.
            const existingMarker = listMatch[1];
            const innerContent = listMatch[2];
            
            // If clicking UL and it is UL, remove.
            if (type === 'ul' && ['*', '-', '+'].includes(existingMarker)) {
                return indent + innerContent;
            }
            // If clicking OL and it is OL, remove.
            if (type === 'ol' && /^\d+\.$/.test(existingMarker)) {
                return indent + innerContent;
            }
            // If switching type (e.g. was UL, now OL)
            if (type === 'ol') return `${indent}${i + 1}. ${innerContent}`;
            if (type === 'ul') return `${indent}* ${innerContent}`;
        }
        
        // Not a list item
        if (type === 'ul') return `${indent}* ${content}`;
        if (type === 'ol') return `${indent}${i + 1}. ${content}`;
        
        return line;
    });

    const newText = text.substring(0, lineStart) + processedLines.join('\n') + text.substring(lineEnd);
    setMarkdownText(newText);
    
    // Restore selection
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart + processedLines.join('\n').length);
    }, 0);
  };

  // Logic for Output Panel (Direct Unicode Transformation)
  const applyUnicodeStyle = (transformFn: (text: string) => string) => {
    if (!unicodeTextareaRef.current) return;
    
    const textarea = unicodeTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = unicodeText;

    if (start === end) return; // No selection to transform

    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const transformedSelection = transformFn(selection);
    const newText = before + transformedSelection + after;
    
    setUnicodeText(newText);

    setTimeout(() => {
        textarea.focus();
        // Keep the selection over the transformed text
        textarea.setSelectionRange(start, start + transformedSelection.length);
    }, 0);
  };

  const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
  }> = ({ icon, onClick, title }) => (
    <button
      onClick={onClick}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
      title={title}
    >
      {icon}
    </button>
  );

  const AiButton: React.FC<{
    onClick: () => void;
    loading: boolean;
    children: React.ReactNode;
    title: string;
    'aria-label': string;
  }> = ({ onClick, loading, children, title, 'aria-label': ariaLabel }) => (
    <button
      onClick={onClick}
      disabled={loading}
      title={title}
      aria-label={ariaLabel}
      className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
    >
      <SparkleIcon />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{children === 'Improve' ? 'Imp' : children === 'Format' ? 'Fmt' : 'Sum'}</span>
      {loading && <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-[65vh] md:h-[70vh]">
      {/* Input Panel */}
      <div className="flex flex-col rounded-lg bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
        {/* Top Header with AI Actions */}
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800/50">
          <h2 className="font-semibold text-gray-300 text-sm sm:text-base">Input (Markdown)</h2>
          <div className="flex items-center gap-2">
             <AiButton onClick={onFormat} loading={isLoading === 'format'} title="Reformat the text with AI" aria-label="Format with AI">
              Format
            </AiButton>
            <AiButton onClick={onImprove} loading={isLoading === 'improve'} title="Improve the text with AI" aria-label="Improve with AI">
              Improve
            </AiButton>
            <AiButton onClick={onSummarize} loading={isLoading === 'summarize'} title="Summarize the text with AI" aria-label="Summarize with AI">
              Summarize
            </AiButton>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-700 bg-gray-900/50 flex-wrap">
          <ToolbarButton icon={<BoldIcon />} onClick={() => insertMarkdownFormatting('**', '**')} title="Bold (Ctrl+B)" />
          <ToolbarButton icon={<ItalicIcon />} onClick={() => insertMarkdownFormatting('*', '*')} title="Italic (Ctrl+I)" />
          <ToolbarButton icon={<UnderlineIcon />} onClick={() => insertMarkdownFormatting('<u>', '</u>')} title="Underline" />
          <ToolbarButton icon={<StrikethroughIcon />} onClick={() => insertMarkdownFormatting('~~', '~~')} title="Strikethrough" />
          <ToolbarButton icon={<CodeIcon />} onClick={() => insertMarkdownFormatting('`', '`')} title="Inline Code" />
          
          <div className="w-px h-5 bg-gray-700 mx-2 hidden sm:block"></div>
          
          <ToolbarButton icon={<ListIcon />} onClick={() => applyListFormatting('ul')} title="Bulleted List" />
          <ToolbarButton icon={<OrderedListIcon />} onClick={() => applyListFormatting('ol')} title="Numbered List" />

          <div className="w-px h-5 bg-gray-700 mx-2 hidden sm:block"></div>

          <button
            onClick={onUndo}
            disabled={!canUndo || !!isLoading}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            title="Undo last AI action"
          >
            <UndoIcon />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
            title="Clear all text"
          >
            <ClearIcon />
          </button>
        </div>

        <textarea
          ref={markdownTextareaRef}
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="flex-grow p-4 bg-transparent text-gray-300 resize-none focus:outline-none placeholder-gray-500 w-full font-mono text-sm leading-relaxed"
          spellCheck="false"
        />
      </div>

      {/* Output Panel */}
      <div className="flex flex-col rounded-lg bg-gray-800 border border-gray-700 shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800/50">
          <h2 className="font-semibold text-gray-300 text-sm sm:text-base">Unicode Output</h2>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-2 ${
              isCopied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <CopyIcon />
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        {/* Output Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-700 bg-gray-900/50 flex-wrap">
            <span className="text-xs text-gray-500 px-2 select-none hidden sm:inline">Select text to style:</span>
            <ToolbarButton icon={<BoldIcon />} onClick={() => applyUnicodeStyle(transformToBold)} title="Convert selection to Unicode Bold" />
            <ToolbarButton icon={<ItalicIcon />} onClick={() => applyUnicodeStyle(transformToItalic)} title="Convert selection to Unicode Italic" />
            <ToolbarButton icon={<BoldItalicIcon />} onClick={() => applyUnicodeStyle(transformToBoldItalic)} title="Convert selection to Unicode Bold Italic" />
            <ToolbarButton icon={<UnderlineIcon />} onClick={() => applyUnicodeStyle(transformToUnderline)} title="Add underline to selection" />
        </div>

        <textarea
          ref={unicodeTextareaRef}
          value={unicodeText}
          onChange={(e) => setUnicodeText(e.target.value)}
          placeholder="Formatted text will appear here. You can also type or edit directly."
          className="flex-grow p-4 bg-gray-800 text-gray-300 resize-none focus:outline-none placeholder-gray-500 w-full cursor-text font-sans text-base leading-relaxed"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Editor;