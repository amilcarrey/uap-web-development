'use client';

import { FormEvent, KeyboardEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit 
}: ChatInputProps) {
  
  // Manejar envío con Enter (Shift+Enter para nueva línea)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        // Crear un evento sintético para el formulario
        const form = e.currentTarget.form;
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
              rows={1}
              className="w-full resize-none border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              style={{
                minHeight: '44px',
                maxHeight: '200px',
                overflowY: input.split('\n').length > 3 ? 'scroll' : 'hidden'
              }}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">Enter to send • Shift+Enter for new line</span>
              <span className={`text-xs ${input.length > 8000 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                {input.length}/10000
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gray-900 text-white text-[15px] rounded-xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-normal"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}

