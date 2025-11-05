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
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-800 text-gray-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
};

export default Bubble;
