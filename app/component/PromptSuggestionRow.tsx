import React from 'react';
import PromptSuggestionButton from './promptSuggestionButton';

interface PromptSuggestionRowProps {
  onPromptClick: (text: string) => void;
}

const PromptSuggestionRow: React.FC<PromptSuggestionRowProps> = ({ onPromptClick }) => {
  const promptSuggestions = [
    "What's your tech stack for fullstack development?",
    "Tell me about your blockchain experience and projects",
    "How do you integrate AI automation in your applications?",
    "What programming languages are you most proficient in?"
  ];

  return (
    <div className="mt-6">
      <p className="text-sm text-blue-300 mb-3 text-center">
        Try asking me about:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {promptSuggestions.map((prompt, index) => (
          <PromptSuggestionButton 
            key={index}  
            text={prompt} 
            onClick={() => onPromptClick(prompt)}
          />
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestionRow;
