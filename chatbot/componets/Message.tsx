// components/Message.tsx
import React from "react";
import Avatar from "./Avatar";

type Message = { 
  id: string; 
  role: "user" | "assistant"; 
  text: string; 
  createdAt: number 
};

interface MessageProps {
  message: Message;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar type="assistant" size="md" />}
      
      <div className={`px-8 py-5 rounded-2xl max-w-[75%] md:max-w-[65%] shadow-md ${
        isUser 
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm" 
          : "bg-white/95 backdrop-blur-md text-gray-800 rounded-bl-sm"
      }`}>
        <div className={`whitespace-pre-wrap text-lg leading-loose ${
          isUser ? "text-white" : "text-gray-800"
        }`}>
          {message.text}
        </div>
      </div>
      
      {isUser && <Avatar type="user" size="md" />}
    </div>
  );
}
