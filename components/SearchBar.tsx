"use client";

import { useState, useTransition } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => onSearch(query));
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Search input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="px-6 py-2 w-64 rounded-full border border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 rounded-full bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-all duration-200">
        {isPending ? "..." : "Search"}
      </button>
    </form>
  );
}
