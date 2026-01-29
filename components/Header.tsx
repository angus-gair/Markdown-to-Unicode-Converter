import React from 'react';
import { SettingsIcon } from './icons/SettingsIcon.tsx';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="relative py-12 px-6 border-b-2 border-cyan-900 bg-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left relative">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-pink-500 hidden md:block"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter neon-text-cyan italic">
            MKDN_<span className="text-pink-500">X</span>_UNICODE
          </h1>
          <p className="mt-2 text-sm text-cyan-500/80 uppercase tracking-[0.3em] font-bold">
            Transcoding Signal For Social Grid_
          </p>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="group flex items-center gap-3 px-6 py-2 border-2 border-cyan-500 bg-transparent text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-300 font-bold uppercase text-sm"
            title="Terminal Settings"
          >
            <SettingsIcon />
            <span>SYS_CONFIG</span>
          </button>
        )}
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-500 pointer-events-none opacity-50"></div>
    </header>
  );
};

export default Header;