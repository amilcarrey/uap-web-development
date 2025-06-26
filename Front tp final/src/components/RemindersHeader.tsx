// src/components/RemindersHeader.tsx
import { Link } from "@tanstack/react-router";
import { ChevronLeft, MoreHorizontal, Users } from "lucide-react";

interface RemindersHeaderProps {
  board?: { name: string; owner_id: string };
  canInviteUsers: boolean;
  onInviteClick: () => void;
}

export function RemindersHeader({ board, canInviteUsers, onInviteClick }: RemindersHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-pink-100 shadow-sm">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-pink-600 hover:text-pink-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-pink-700">
          Mis Recordatorios
          {board && (
            <span className="block text-base font-normal text-pink-600">
              Tablero: {board.name}
            </span>
          )}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {canInviteUsers && (
          <button
            onClick={onInviteClick}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
            title="Invitar usuario"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Invitar</span>
          </button>
        )}
        
        <Link to="/boards/configuracion">
          <MoreHorizontal className="text-pink-600 w-6 h-6 hover:text-pink-800 transition" />
        </Link>
      </div>
    </header>
  );
}
