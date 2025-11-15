"use client";

import { createContext, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { searchMovies } from "@/lib/tmdb";
import "./globals.css";

export const SearchContext = createContext({
  results: null as any[] | null,
  setResults: (r: any[] | null) => {},
  handleSearch: async (query: string) => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) {
      setResults(null);
      return;
    }
    const data = await searchMovies(query);
    setResults(data);
  };

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <SearchContext.Provider value={{ results, setResults, handleSearch }}>
          <Navbar onSearch={handleSearch} />
          <main className="flex-1">
              {children}
          </main>
          <Footer />
        </SearchContext.Provider>
      </body>
    </html>
  );
}