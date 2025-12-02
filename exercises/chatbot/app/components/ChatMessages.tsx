'use client';

import { useEffect, useRef } from 'react';
import { Message } from 'ai/react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-normal text-gray-700">Welcome</h2>
              <p className="text-sm text-gray-500">Start a conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="text-xs font-medium mb-1 opacity-50">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </div>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Indicador de escritura */}
        {isLoading && (
          <div className="flex justify-start mt-6">
            <div className="bg-gray-100 text-gray-900 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="text-xs font-medium opacity-60">Assistant</div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
