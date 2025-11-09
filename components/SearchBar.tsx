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
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="px-3 py-1.5 rounded-md text-black w-64"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-1.5 bg-blue-600 rounded-md text-white disabled:opacity-60"
      >
        {isPending ? "..." : "Search"}
      </button>
    </form>
  );
}
