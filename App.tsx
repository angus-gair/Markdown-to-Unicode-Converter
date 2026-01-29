import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Editor from './components/Editor.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import { convertMarkdownToUnicode } from './services/markdownToUnicode.ts';
import { improveContent, formatContent, summarizeContent } from './services/geminiService.ts';
import { APP_VERSION, AVAILABLE_MODELS } from './constants.ts';

const defaultMarkdown = `# MD_TRANSCODER_V1.4

## SYSTEM_FEATURES
- **Bold**: \`**Stand out in the sprawl**\`
- *Italic*: \`*Emphasize the signal*\`
- ***Bold_Italic***: \`***Maximum bandwidth!***\`
- \`Monospace for netrunners\`
- ~~Strikethrough old data~~

### INPUT_PROTOCOL
1. Feed the Markdown on the left.
2. Signal translates to Unicode instantly.
3. Extract and deploy to your feed.

**NETRUNNER_STATUS** | _LEVEL 7_
- High-fidelity text mapping active.
- Neuro-link formatting optimized for LinkedIn.
- AI Co-processor (Gemini) standby.`;

const App: React.FC = () => {
  const [markdownText, setMarkdownText] = useState<string>(defaultMarkdown);
  const [unicodeText, setUnicodeText] = useState<string>('');
  const [previousMarkdownText, setPreviousMarkdownText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<false | 'improve' | 'format' | 'summarize'>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      const improvedText = await improveContent(markdownText, selectedModel);
      setMarkdownText(improvedText);
    } catch (e: any) {
      setError(e.message || 'IO_ERROR_NEURAL_LINK_FAILED');
      setPreviousMarkdownText(null);
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
      const formattedText = await formatContent(markdownText, selectedModel);
      setMarkdownText(formattedText);
    } catch (e: any) {
      setError(e.message || 'IO_ERROR_PROTOCOL_FAILED');
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
      const summarizedText = await summarizeContent(markdownText, selectedModel);
      setMarkdownText(summarizedText);
    } catch (e: any) {
      setError(e.message || 'IO_ERROR_COMPRESSION_FAILED');
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
    <div className="min-h-screen bg-transparent text-gray-300 font-mono antialiased overflow-x-hidden">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-black border-2 border-red-600 text-red-500 px-6 py-4 mb-8 flex items-center justify-between shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <div>
              <strong className="uppercase tracking-widest font-bold">SYSTEM_ERROR: </strong>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-white transition-colors">
              [X]
            </button>
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
      
      <footer className="text-center py-8 text-gray-600 text-[10px] tracking-widest uppercase">
        <p>
          <span className="text-cyan-500">PROJECT_UNICODE</span> // 
          <span className="mx-2 text-pink-500">CO-PROCESSOR_GEMINI</span> // 
          <span className="ml-2">v{APP_VERSION}</span>
        </p>
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