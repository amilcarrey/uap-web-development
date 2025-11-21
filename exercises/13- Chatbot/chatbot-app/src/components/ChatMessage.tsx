import { FC } from 'react';

export const ChatMessage: FC<{ message: { role: string; content: string } }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`p-4 rounded-lg ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};