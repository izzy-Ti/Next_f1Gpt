import React from 'react'

const Loadingbubble = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-800/80 border border-blue-400/30 rounded-2xl p-4 shadow-lg shadow-blue-400/20">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}

export default Loadingbubble