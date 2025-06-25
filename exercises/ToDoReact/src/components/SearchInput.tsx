import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useDebounce } from "../hooks/useDebounce";
import { X, Search } from "lucide-react";

interface SearchInputProps {
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const { tabId } = useParams({ from: "/tab/$tabId" });
  const search = useSearch({ from: "/tab/$tabId" });
  const [searchTerm, setSearchTerm] = useState(search.search || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(search.search || "");
  }, [search.search]);

  // Update URL when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== (search.search || "")) {
      navigate({
        to: "/tab/$tabId",
        params: { tabId },
        search: { search: debouncedSearchTerm || "" },
        replace: true, // Replace instead of push to avoid cluttering history
      });
    }
  }, [debouncedSearchTerm, navigate, tabId, search.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    // Focus back to input after clearing
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent losing focus on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks..."
          className=" px-4 py-2 pl-10 pr-10 bg-orange-900/50 border-2 border-amber-300 rounded-lg text-amber-100 placeholder-amber-300/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200"
        />

        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-amber-300" />
        </div>

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-100 transition-colors duration-200"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search indicator */}
    </div>
  );
};

export default SearchInput;
