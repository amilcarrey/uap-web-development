'use client';

import { useState, FormEvent } from 'react';
import { useChat } from 'ai/react';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  // Maneja automáticamente el estado de mensajes, input y loading
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onError: (error: Error) => {
      console.error('Chat error:', error);
      setError(error.message || 'Ocurrió un error al procesar tu mensaje');
      
      // Limpiar error después de 5 segundos
      setTimeout(() => setError(null), 5000);
    },
    onFinish: () => {
      setError(null);
    },
  });

  // Limpiar conversación
  const handleClearChat = () => {
    if (confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
      setMessages([]);
      setError(null);
    }
  };

  // Manejar envío del formulario con validación adicional
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación del lado del cliente
    if (!input.trim()) {
      setError('Por favor escribe un mensaje');
      return;
    }

    if (input.length > 10000) {
      setError('El mensaje es demasiado largo (máximo 10,000 caracteres)');
      return;
    }

    // Limpiar error previo
    setError(null);

    // Enviar mensaje
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <ChatHeader onClearChat={handleClearChat} messageCount={messages.length} />

      {/* Error Alert */}
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 mx-6 mt-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-sm">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mensajes del Chat */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading} />
        
        {/* Input del Chat */}
        <ChatInput 
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={onSubmit}
        />
      </div>

      {/* Footer con información de seguridad */}
      <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-500">
        <p>
          Secure AI Assistant • Protected API • Validated Inputs
        </p>
      </footer>
    </div>
  );
}
