import { useState, useRef, useEffect } from 'react';
import api from '../lib/api';

// Función para sanitizar input del usuario
const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .slice(0, 1000) // Limitar a 1000 caracteres
        .replace(/[<>]/g, '') // Remover < y >
        .replace(/javascript:/gi, '') // Remover javascript:
        .replace(/on\w+\s*=/gi, ''); // Remover event handlers
};

// Función para validar input
const validateInput = (input: string): { valid: boolean; error?: string } => {
    const sanitized = input.trim();

    if (!sanitized) {
        return { valid: false, error: 'Por favor escribe un mensaje' };
    }

    if (sanitized.length > 1000) {
        return { valid: false, error: 'El mensaje no puede exceder 1000 caracteres' };
    }

    if (sanitized.length < 2) {
        return { valid: false, error: 'El mensaje debe tener al menos 2 caracteres' };
    }

    return { valid: true };
};

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolResults?: any[];
    timestamp: Date;
}

interface ChatBotProps {
    boardId: number;
}

export function ChatBot({ boardId }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Limitar en tiempo real a 1000 caracteres
        if (value.length <= 1000) {
            setInput(value);
        }
        setError(null); // Limpiar error cuando el usuario escribe
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar input
        const validation = validateInput(input);
        if (!validation.valid) {
            setError(validation.error || 'Entrada inválida');
            return;
        }

        // Sanitizar input
        const sanitizedInput = sanitizeInput(input);

        // Agregar mensaje del usuario
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: sanitizedInput,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Enviar al backend con boardId
            const response = await api.post('/chat', {
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content
                })).concat({
                    role: 'user',
                    content: sanitizedInput
                }),
                boardId
            });

            // Validar respuesta del servidor
            if (!response.data || !response.data.message) {
                throw new Error('Respuesta inválida del servidor');
            }

            // Agregar respuesta del asistente
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: String(response.data.message).slice(0, 5000), // Limitar respuesta
                toolResults: Array.isArray(response.data.toolResults) ? response.data.toolResults : [],
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al procesar el mensaje';
            setError(errorMsg);
            console.error('Chat error:', err);
            
            // Remover el mensaje del usuario si hay error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    // Vista cerrada - Solo botón flotante
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 z-40"
                title="Abrir asistente de IA"
            >
                🤖
            </button>
        );
    }

    // Vista abierta - Chat completo
    return (
        <div className="fixed bottom-6 left-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">🤖 AI Assistant</h3>
                    <p className="text-blue-100 text-xs">
                        {boardId > 0 ? `Tablero ${boardId}` : 'Gestor de tareas'}
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-800 rounded p-1 transition"
                    title="Cerrar chat"
                >
                    ✕
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-4xl mb-2">💡</div>
                        <p className="text-gray-600 text-sm font-medium">
                            {boardId > 0 
                                ? `Asistente para el tablero ${boardId}` 
                                : 'Gestor de tareas inteligente'
                            }
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            {boardId > 0 ? 'Ejemplos:' : 'Ejemplo:'}
                        </p>
                        <ul className="text-gray-400 text-xs mt-2 space-y-1">
                            {boardId > 0 ? (
                                <>
                                    <li>• "Crea una tarea de comprar café"</li>
                                    <li>• "Marca la primera tarea como completada"</li>
                                    <li>• "Muestra mis tareas pendientes"</li>
                                    <li>• "¿Cuántas tareas completé?"</li>
                                </>
                            ) : (
                                <>
                                    <li>• "Crea una tarea"</li>
                                    <li>• "Marca como completada"</li>
                                    <li>• "Muestra estadísticas"</li>
                                </>
                            )}
                        </ul>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    message.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>

                                {/* Tool Results */}
                                {message.toolResults && message.toolResults.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-300 space-y-1">
                                        {message.toolResults.map((result, i) => (
                                            <div key={i} className="text-xs bg-white bg-opacity-50 p-1 rounded">
                                                <strong className="text-blue-600">{result.toolName}:</strong>
                                                <p className="mt-0.5">
                                                    {result.result.message || 
                                                     (typeof result.result === 'string' 
                                                        ? result.result 
                                                        : JSON.stringify(result.result).substring(0, 50))}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-300 px-3 py-2 rounded-lg rounded-bl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                <div 
                                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div 
                                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-xs border border-red-300">
                            ⚠️ {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Escribe algo..."
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                    >
                        {isLoading ? '...' : '→'}
                    </button>
                </div>
            </form>
        </div>
    );
}