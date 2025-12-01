
import React from 'react';
import { SettingsIcon } from './icons/SettingsIcon.tsx';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="pt-8 pb-4 sm:pt-12 sm:pb-6 relative px-4">
      {onOpenSettings && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Markdown to Unicode Converter
        </h1>
        <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
          Elevate your LinkedIn posts and comments with rich text formatting.
        </p>
      </div>
    </header>
  );
};

export default Header;
