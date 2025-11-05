import React from 'react';

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-800/90 border border-blue-500/30 rounded-2xl px-5 py-3 shadow-lg shadow-blue-500/10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-xs text-blue-300/70 mt-1">Israel is thinking...</p>
      </div>
    </div>
  );
};

export default LoadingBubble;