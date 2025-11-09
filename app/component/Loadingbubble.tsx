import React from 'react';

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-black/80 border border-blue-500/40 rounded-xl rounded-bl-sm px-5 py-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-blue-300 font-medium">Israel is thinking...</p>
      </div>
    </div>
  );
};

export default LoadingBubble;