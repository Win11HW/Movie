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
        className="px-5 py-2.5 w-64 md:w-80 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-white/20 transition-all"
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 hover:from-blue-500 hover:to-indigo-500 shadow-sm shadow-blue-500/20 transition-colors">
        {isPending ? "..." : "Search"}
      </button>
    </form>
  );
}
