// components/ChatContainer.tsx
import React, { useEffect, useRef, useState } from "react";
import { sanitizeInput } from "../utils/senitize";
import Message from "./Message";
import ChatInput from "./ChatInput";
import Avatar from "./Avatar";
import ParticlesBackground from "./ParticlesBackground";

type Message = { 
  id: string; 
  role: "user" | "assistant"; 
  text: string; 
  createdAt: number 
};

const STORAGE_KEY = "chat_conversation_v1";

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mounted, setMounted] = useState(false);

  // Cargar mensajes del sessionStorage solo en el cliente
  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          setMessages(JSON.parse(raw));
        }
      }
    } catch {
      // Ignorar errores
    }
  }, []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const streamTextRef = useRef("");

  // Guardar mensajes en sessionStorage solo en el cliente
  useEffect(() => {
    if (!mounted) return;
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); 
      }
    } catch {
      // Ignorar errores
    }
  }, [messages, mounted]);

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isTyping, mounted]);

  const appendMessage = (m: Message) => setMessages(prev => [...prev, m]);

  async function sendMessage() {
    const raw = input.trim();
    if (!raw) return;
    
    const sanitized = sanitizeInput(raw);
    const userMsg: Message = { 
      id: `${Date.now()}-u`, 
      role: "user", 
      text: sanitized, 
      createdAt: Date.now() 
    };
    
    appendMessage(userMsg);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    controllerRef.current = new AbortController();
    streamTextRef.current = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.role, 
            content: m.text 
          })), 
          model: undefined 
        }),
        headers: { "Content-Type": "application/json" },
        signal: controllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Error del servidor: ${res.status} ${text}`);
      }

      const assistantId = `${Date.now()}-a`;
      appendMessage({ 
        id: assistantId, 
        role: "assistant", 
        text: "", 
        createdAt: Date.now() 
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          streamTextRef.current += chunk;
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { 
              ...m, 
              text: sanitizeInput(streamTextRef.current) 
            } : m))
          );
        }
      }

      setIsTyping(false);
      setLoading(false);
      controllerRef.current = null;
    } catch (err: unknown) {
      console.error(err);
      setIsTyping(false);
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : String(err);
      appendMessage({ 
        id: `${Date.now()}-err`, 
        role: "assistant", 
        text: `Error: ${errorMessage}`, 
        createdAt: Date.now() 
      });
    }
  }

  function stopStream() {
    controllerRef.current?.abort();
    setIsTyping(false);
    setLoading(false);
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden chat-background">
      {/* Fondo con partículas animadas */}
      <ParticlesBackground />
      
      {/* Contenedor del chat centrado con márgenes */}
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 z-10">
        {/* Área de mensajes */}
        <div 
          className="flex-1 overflow-y-auto mb-4 min-h-0" 
          id="messages" 
          style={{scrollBehavior: 'smooth'}}
        >
          {messages.length === 0 && (
            <div className="text-center py-32 animate-fadeIn">
              <div className="inline-block p-6 bg-white/10 backdrop-blur-md rounded-full mb-6">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-white mb-3">Hola</h1>
              <p className="text-white/90 text-xl">¿En qué puedo ayudarte hoy?</p>
            </div>
          )}
          
          <div className="space-y-4">
            {messages.map((m, index) => (
              <div key={m.id} className="animate-floatUp" style={{animationDelay: `${index * 0.05}s`}}>
                <Message message={m} />
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-3 text-white/80 animate-fadeIn">
                <Avatar type="assistant" size="md" />
                <div className="bg-white/20 backdrop-blur-md rounded-3xl rounded-bl-md px-10 py-6">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input - Centrado en la parte inferior */}
        <div className="w-full">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
            onStop={stopStream}
          />
        </div>
      </div>
    </div>
  );
}
