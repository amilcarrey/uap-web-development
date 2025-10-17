'use client';

type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const containerAlignment = message.role === 'user' ? 'justify-end' : 'justify-start';
  const bubbleStyles =
    message.role === 'user'
      ? 'bg-blue-600 text-white rounded-br-sm'
      : 'bg-slate-100 text-slate-900 rounded-bl-sm';

  return (
    <div className={`flex w-full gap-3 ${containerAlignment}`}>
      {message.role === 'assistant' ? (
        <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700 sm:flex">
          AI
        </div>
      ) : null}

      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:text-base ${bubbleStyles}`}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.timestamp ? (
          <span className="mt-2 block text-xs opacity-70">{message.timestamp}</span>
        ) : null}
      </div>

      {message.role === 'user' ? (
        <div className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 sm:flex">
          Tú
        </div>
      ) : null}
    </div>
  );
}
