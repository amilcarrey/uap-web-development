// src/components/SearchInput.tsx
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-pink-700 placeholder:text-pink-300"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
    </div>
  );
}
