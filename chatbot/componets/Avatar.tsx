// components/Avatar.tsx
import React from "react";

interface AvatarProps {
  type: "user" | "assistant";
  size?: "sm" | "md" | "lg";
}

export default function Avatar({ type, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9", 
    lg: "w-11 h-11"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const avatarClasses = `rounded-full flex items-center justify-center ${sizeClasses[size]} shadow-md border-2 border-white/50`;

  if (type === "user") {
    return (
      <div className={`${avatarClasses} bg-gradient-to-br from-green-400 to-green-500`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" className="text-white"/>
          <circle cx="12" cy="7" r="4" className="text-white"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`${avatarClasses} bg-gradient-to-br from-purple-400 to-purple-500`}>
      <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="white">
        {/* Cabeza del robot */}
        <rect x="5" y="7" width="14" height="12" rx="2" fill="white"/>
        {/* Ojos */}
        <circle cx="9.5" cy="12" r="1.5" fill="#764ba2"/>
        <circle cx="14.5" cy="12" r="1.5" fill="#764ba2"/>
        {/* Antena */}
        <line x1="12" y1="7" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="3" r="1" fill="white"/>
        {/* Boca */}
        <rect x="10" y="14" width="4" height="2" rx="1" fill="#764ba2"/>
      </svg>
    </div>
  );
}
