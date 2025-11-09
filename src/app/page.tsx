"use client";

import { useEffect, useState } from "react";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    getPopularMovies().then(setMovies);
  }, []);

  const handleSearch = async (query: string) => {
    const results = query ? await searchMovies(query) : await getPopularMovies();
    setMovies(results);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <Navbar onSearch={handleSearch} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 flex-grow">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>

      <Footer />
    </main>
  );
}
