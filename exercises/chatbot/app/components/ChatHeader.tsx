'use client';

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export default function ChatHeader({ onClearChat, messageCount }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-lg font-normal text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">          
          <button
            onClick={onClearChat}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            title="Clear conversation"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}
