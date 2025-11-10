"use client";

import { useEffect, useState } from "react";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getTopRatedTV,
  searchMovies,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [trendM, topM, trendT, topT] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getTrendingTV(),
        getTopRatedTV(),
      ]);
      setTrendingMovies(trendM);
      setTopRatedMovies(topM);
      setTrendingTV(trendT);
      setTopRatedTV(topT);
    }

    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    const results = await searchMovies(query);
    setSearchResults(results);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <Navbar onSearch={handleSearch} />

      {searchResults ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <Section title="Trending Movies" items={trendingMovies} />
          <Section title="Top Rated Movies" items={topRatedMovies} />
          <Section title="Trending TV" items={trendingTV} />
          <Section title="Top Rated TV" items={topRatedTV} />
        </>
      )}

      <Footer />
    </main>
  );
}

function Section({ title, items }: { title: string; items: any[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <MovieCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
