import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Editor from './components/Editor.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import { convertMarkdownToUnicode } from './services/markdownToUnicode.ts';
import { improveContent, formatContent, summarizeContent } from './services/geminiService.ts';
import { APP_VERSION, AVAILABLE_MODELS } from './constants.ts';

const defaultMarkdown = `# Markdown to Unicode Converter

Welcome! This tool helps you format your text for platforms like LinkedIn that don't support standard Markdown.

## Features
- **Bold Text**: \`**Make your skills stand out**\`
- *Italic Text*: \`*Emphasize key points*\`
- ***Bold & Italic***: \`***For maximum impact!***\`
- \`Monospace for code or technical terms\`
- ~~Strikethrough text~~

### Example Usage
Here's how you can format your experience:

**Senior React Engineer** | _Tech Solutions Inc._
- Developed and maintained complex user interfaces using React, TypeScript, and Tailwind CSS.
- Led the migration of a legacy codebase to a modern React stack, improving performance by 30%.
- Mentored junior developers and conducted code reviews to ensure high-quality standards.

---

1. Simply type or paste your Markdown text on the left.
2. The Unicode version will appear instantly on the right.
3. Click the copy button and paste it into your profile or post!`;

const App: React.FC = () => {
  const [markdownText, setMarkdownText] = useState<string>(defaultMarkdown);
  const [unicodeText, setUnicodeText] = useState<string>('');
  const [previousMarkdownText, setPreviousMarkdownText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<false | 'improve' | 'format' | 'summarize'>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Default to Gemini 3 Pro Preview as per instructions for complex tasks, or allow user override
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);

  useEffect(() => {
    const convertedText = convertMarkdownToUnicode(markdownText);
    setUnicodeText(convertedText);
  }, [markdownText]);

  const handleImprove = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading('improve');
    setPreviousMarkdownText(markdownText);
    try {
      // Pass selected model
      const improvedText = await improveContent(markdownText, selectedModel);
      setMarkdownText(improvedText);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setPreviousMarkdownText(null); // Clear undo state on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormat = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading('format');
    setPreviousMarkdownText(markdownText);
    try {
      // Pass selected model
      const formattedText = await formatContent(markdownText, selectedModel);
      setMarkdownText(formattedText);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setPreviousMarkdownText(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading('summarize');
    setPreviousMarkdownText(markdownText);
    try {
      // Pass selected model
      const summarizedText = await summarizeContent(markdownText, selectedModel);
      setMarkdownText(summarizedText);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setPreviousMarkdownText(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousMarkdownText !== null) {
      setMarkdownText(previousMarkdownText);
      setPreviousMarkdownText(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans antialiased">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Editor
          markdownText={markdownText}
          setMarkdownText={setMarkdownText}
          unicodeText={unicodeText}
          setUnicodeText={setUnicodeText}
          onImprove={handleImprove}
          onFormat={handleFormat}
          onSummarize={handleSummarize}
          onUndo={handleUndo}
          isLoading={isLoading}
          canUndo={previousMarkdownText !== null}
        />
      </main>
      
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Built for enhanced text formatting on social platforms. AI-powered by Gemini. <span className="text-gray-700 ml-2">v{APP_VERSION}</span></p>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
};

export default App;