import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900/50">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ClearIcon />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
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
          
          <div className="border-t border-gray-700 pt-4">
             <h3 className="text-sm font-medium text-gray-300 mb-2">Gemini Billing</h3>
             <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 block"
              >
                View Gemini API Pricing & Billing Info
              </a>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;