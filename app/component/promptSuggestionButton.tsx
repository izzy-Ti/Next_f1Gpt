import React from 'react';

interface PromptSuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mb-2 mr-2 px-4 py-2 text-sm text-blue-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 border border-blue-500/30 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label={`Ask: ${text}`}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
