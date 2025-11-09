"use client";
import { useState, useEffect, useRef } from "react";
import { useChat } from 'ai/react';
import { Message } from "ai";
import Bubble from "./component/Bubble";
import LoadingBubble from "./component/Loadingbubble";
import PromptSuggestionRow from "./component/PromptSuggestionRow";

export default function Home() {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit, setInput, error } = useChat({
    api: '/api/chat',
  });
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const noMessages = messages.length === 0;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const onPromptClick = (text: string) => {
    setInput('');
    const msg: Message = {
      id: crypto.randomUUID(),
      content: text,
      role: 'user',
    };
    append(msg);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glowing background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '0.75s' }}></div>
      </div>

      {/* Welcome Text */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 text-center">
          Hey, I'm ISRAEL
        </h1>
        <p className="text-blue-300/80 text-lg sm:text-xl text-center mt-2">
          What can I help you?
        </p>
      </div>
      
      {/* Chat Container with glowing border */}
      <section className="w-full max-w-4xl relative z-10 mb-8">
        <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl border border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] p-4 sm:p-6">
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-50 blur-xl"></div>
          
          {/* Messages Area */}
          <div className="relative min-h-[400px] max-h-[65vh] overflow-y-auto mb-6 p-4 sm:p-6 bg-black/60 rounded-xl border border-blue-500/30 scrollbar-thin">
            {noMessages ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 min-h-[400px]">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
                  Ask Me Anything
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                <p className="text-blue-300/80 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                  I'm Israel Ashenafi, a full-stack and blockchain developer. Ask me about my tech stack, projects, or experience!
                </p>
                <PromptSuggestionRow onPromptClick={onPromptClick} />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <Bubble key={message.id || index} message={message} />
                ))}
                {isLoading && <LoadingBubble />}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm">
                    {error.message || "An error occurred. Please try again."}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <input 
                type="text" 
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="relative w-full bg-black/80 border-2 border-blue-500/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
                disabled={isLoading}
                aria-label="Type your question here"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                  aria-label="Clear input"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isLoading || !input.trim()
                  ? 'bg-blue-500/20 text-blue-400/50 cursor-not-allowed border-2 border-blue-500/30'
                  : 'bg-blue-500 text-white border-2 border-blue-400 hover:bg-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] active:scale-95'
              }`}
              aria-label={isLoading ? 'Sending...' : 'Send message'}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span className="hidden sm:inline">Sending...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Send</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="text-center text-sm text-blue-400/60 relative z-10">
        <p>© {new Date().getFullYear()} Israel Tilahun</p>
      </footer>
    </main>
  );
}