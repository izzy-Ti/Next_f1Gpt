"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useChat } from 'ai/react';
import { Message } from "ai";
import Bubble from "./component/Bubble";
import LoadingBubble from "./component/Loadingbubble";
import PromptSuggestionRow from "./component/PromptSuggestionRow";
import logo from './assets/logo.jpg';

export default function Home() {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit, setInput } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const noMessages = messages.length === 0;

  useEffect(() => {
    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const onPromptClick = (text: string) => {
    setInput(''); // Clear input field
    const msg: Message = {
      id: crypto.randomUUID(),
      content: text,
      role: 'user',
    };
    append(msg);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 flex flex-col items-center justify-start sm:justify-center">
      {/* Logo */}
      <div className="mt-4 sm:mt-0 mb-6 sm:mb-8">
        <Image 
          src={logo} 
          alt="Israel's Logo" 
          width={isMobile ? 80 : 96}
          height={isMobile ? 80 : 96}
          className="rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/50 object-cover hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
      
      {/* Chat Section */}
      <section className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/10 p-4 sm:p-6 md:p-8 mb-8">
        {/* Messages Area */}
        <div className="min-h-[300px] max-h-[60vh] overflow-y-auto mb-6 p-4 bg-black/30 rounded-xl border border-blue-500/10 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
          {noMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 mb-4">
                Ask Me Anything
              </h1>
              <p className="text-blue-200/80 text-sm sm:text-base leading-relaxed max-w-md">
                I'm Israel, a passionate developer with expertise in full-stack development, blockchain, and AI. 
                Ask me about my experience, projects, or anything else!
              </p>
              <PromptSuggestionRow onPromptClick={onPromptClick} />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <Bubble key={message.id || index} message={message} />
              ))}
              {isLoading && <LoadingBubble />}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="w-full bg-gray-800/80 border border-blue-500/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              disabled={isLoading}
              aria-label="Type your question here"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              isLoading || !input.trim()
                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/40 active:scale-95'
            }`}
            aria-label={isLoading ? 'Sending...' : 'Send message'}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="hidden sm:inline">Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <span className="hidden sm:inline">→</span>
              </>
            )}
          </button>
        </form>
      </section>
      
      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-4">
        <p>© {new Date().getFullYear()} Israel Tilahun. All rights reserved.</p>
      </footer>
    </main>
  );
}