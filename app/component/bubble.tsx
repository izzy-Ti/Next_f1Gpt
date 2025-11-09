import React from 'react';
import { Message } from 'ai';

interface BubbleProps {
  message: Message;
}

const Bubble: React.FC<BubbleProps> = ({ message }) => {
  const { content, role } = message;
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-sm shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
            : 'bg-black/80 text-blue-100 rounded-bl-sm border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">{content}</p>
      </div>
    </div>
  );
};

export default Bubble;
