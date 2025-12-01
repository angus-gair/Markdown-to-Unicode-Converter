
import React, { useState, useEffect } from 'react';
import { ClearIcon } from './icons/ClearIcon.tsx';
import { AVAILABLE_MODELS } from '../constants.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onModelChange,
}) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'set' | 'unset'>('checking');
  
  useEffect(() => {
    if (isOpen) {
      checkApiKey();
    }
  }, [isOpen]);

  const checkApiKey = async () => {
    try {
      // @ts-ignore - window.aistudio is available in this environment
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyStatus(hasKey ? 'set' : 'unset');
      } else {
        // Fallback if not in the specific environment, assume managed externally or unavailable
        setApiKeyStatus('unset');
      }
    } catch (e) {
      console.error("Failed to check API key status", e);
      setApiKeyStatus('unset');
    }
  };

  const handleAuthorize = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        await checkApiKey();
      } else {
        alert("Authorization is only available in the Project IDX / AI Studio environment.");
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900/50">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ClearIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Model Selection */}
          <div>
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-300 mb-2">
              Gemini Model
            </label>
            <div className="relative">
              <select
                id="model-select"
                value={currentModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {AVAILABLE_MODELS.find(m => m.id === currentModel)?.description}
            </p>
          </div>

          {/* Authorization Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Authorization</h3>
            <p className="text-xs text-gray-400 mb-4">
              To use Gemini features, you must authorize this application with your Google account.
              You will need to select a project with billing enabled.
            </p>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md border border-gray-700">
                <span className="text-sm text-gray-300">Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  apiKeyStatus === 'set' 
                    ? 'bg-green-900/50 text-green-400 border border-green-800' 
                    : 'bg-red-900/50 text-red-400 border border-red-800'
                }`}>
                  {apiKeyStatus === 'set' ? 'Authorized' : 'Not Authorized'}
                </span>
              </div>

              <button
                onClick={handleAuthorize}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {apiKeyStatus === 'set' ? 'Switch Account / Project' : 'Connect Google Account'}
              </button>

              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 text-center mt-1"
              >
                Learn more about Gemini API billing
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
