import React from 'react';

interface PromptSuggestionButtonProps {
  text: string;
  onClick: () => void;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mb-2 mr-2 px-4 py-2.5 text-sm text-blue-300 hover:text-white bg-black/60 hover:bg-black/80 border border-blue-500/50 hover:border-blue-400 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      aria-label={`Ask: ${text}`}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
