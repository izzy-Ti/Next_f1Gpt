"use client"
import Image from "next/image";
import logo from './assets/logo.jpg'
import { useChat } from 'ai/react';
import { Message } from "ai";
import Bubble from "./component/Bubble";
import Loadingbubble from "./component/Loadingbubble";
import PromptSuggestionRow from "./component/PromptSuggestionRow";

export default function Home() {

  const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()

  const noMessages = messages.length === 0 || !messages;

  const onPromptClick = (text) =>{
    const msg ={
      id : crypto.randomUUID,
      content: text,
      role: 'user'
    }
    append(msg)
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      {/* Logo */}
      <Image 
        src={logo} 
        alt="logo" 
        className="rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/50 w-32 h-32 mb-8 object-cover"
      />
      
      {/* Chat Section */}
      <section className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 p-8">
        
        {/* Messages Area */}
        <div className="min-h-64 mb-6 p-4 bg-black/40 rounded-xl border border-blue-400/20">
          {noMessages ? (
            <div className="text-center">
              <p className="text-lg text-blue-300/90 leading-relaxed">
                Ask Israel anything about himself, 
                and it will come back with the most detailed 
                and accurate answers.
                <br />
                <span className="text-blue-400 font-semibold mt-4 inline-block">
                  We hope you enjoy the conversation!
                </span>
                <br/>
                <PromptSuggestionRow onPromptClick={onPromptClick} />
              </p>
            </div>
          ) : (
            <>
            {messages.map((message, index) =><Bubble key={index} message={message}/>)}
              {isLoading && <Loadingbubble />}
            </>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input 
            type="text" 
            onChange={handleInputChange} 
            value={input} 
            placeholder="Ask any question you have..."
            className="flex-1 bg-gray-800 border border-blue-500/40 rounded-xl px-4 py-3 text-white placeholder-blue-300/60 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/30 transition-all duration-300"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </section>
    </main>
  );
}