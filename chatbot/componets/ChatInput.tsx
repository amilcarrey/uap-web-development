// components/ChatInput.tsx
import React from "react";
import Avatar from "./Avatar";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  onStop: () => void;
}

export default function ChatInput({ 
  input, 
  setInput, 
  onSend, 
  loading, 
  onStop 
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg border-t border-white/20 px-4 py-4 rounded-t-2xl mb-6">
      <div className="w-full max-w-full">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-white/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-6 py-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
              maxLength={1000}
              disabled={loading}
            />
            
            <button 
              onClick={onSend} 
              disabled={loading || !input.trim()} 
              className="mr-2 p-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {loading && (
          <div className="mt-3 flex justify-center">
            <button 
              onClick={onStop} 
              className="px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full transition-all text-sm font-medium border border-white/30"
            >
              Detener
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
