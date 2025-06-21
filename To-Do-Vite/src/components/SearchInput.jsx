import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchInput({ onSearchChange, placeholder = "Buscar...", initialValue = "", debounceDelay = 300, className = "" }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearchChange, debounceDelay]);

  return (
    <div className={`relative w-full mb-4 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-white/40" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 pl-10 rounded-lg bg-white/10 text-white border border-transparent focus:border-purple-400 focus:outline-none focus:bg-white/5 transition-colors"
      />
    </div>
  );
} 