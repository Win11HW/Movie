"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void; // Make it optional
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      if (query.trim()) {
        if (onSearch && typeof onSearch === 'function') {
          // Use the provided onSearch function if it exists and is valid
          onSearch(query);
        } else {
          // Default behavior - navigate to search category
          router.push(`/category/search?q=${encodeURIComponent(query)}`);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Search input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="px-5 py-2.5 w-64 md:w-80 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-white/20 transition-all"
      />

      {/* Submit button with search icon */}
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white disabled:opacity-50 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        aria-label="Search"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Search size={20} className="text-white" />
        )}
      </button>
    </form>
  );
}