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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-black border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,243,255,0.3)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b-2 border-cyan-900 bg-cyan-950/20">
          <h2 className="text-2xl font-black text-cyan-500 uppercase italic tracking-tighter">System_Configuration</h2>
          <button
            onClick={onClose}
            className="text-cyan-500 hover:text-white transition-colors p-2 border border-transparent hover:border-cyan-500"
          >
            <ClearIcon />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Model Selection */}
          <div className="space-y-4">
            <label htmlFor="model-select" className="block text-xs font-black text-pink-500 uppercase tracking-widest">
              Neural_Engine_Select [AI]
            </label>
            <div className="relative group">
              <select
                id="model-select"
                value={currentModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full bg-black border-2 border-cyan-900 text-cyan-400 px-5 py-4 focus:outline-none focus:border-cyan-500 appearance-none font-bold text-sm"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id} className="bg-black text-cyan-500">
                    {model.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500 group-hover:text-pink-500 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            <div className="p-4 bg-cyan-950/20 border border-cyan-900">
              <p className="text-[10px] text-cyan-600 uppercase leading-relaxed font-bold">
                CORE_LOG: {AVAILABLE_MODELS.find(m => m.id === currentModel)?.description.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="border-t border-cyan-900 pt-6">
             <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-3">Billing_&_API</h3>
             <p className="text-[10px] text-gray-500 mb-4 uppercase">Direct link to Gemini API billing console for production keys.</p>
             <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block text-xs text-cyan-500 hover:text-pink-500 font-bold border-b border-cyan-500 hover:border-pink-500 transition-all uppercase italic"
              >
                Access_Documentation &gt;&gt;
              </a>
          </div>
        </div>

        <div className="p-6 border-t-2 border-cyan-900 bg-black flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-cyan-500 hover:bg-pink-500 text-black font-black uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_15px_rgba(255,0,255,0.4)]"
          >
            Finalize_Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;