"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-8">
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
          <CarouselSection
            title="🎬 Trending Movies"
            items={trendingMovies}
            link="/movies/trending"
          />
          <CarouselSection
            title="⭐ Top Rated Movies"
            items={topRatedMovies}
            link="/movies/top-rated"
          />
          <CarouselSection
            title="📺 Trending TV"
            items={trendingTV}
            link="/tv/trending"
          />
          <CarouselSection
            title="🏆 Top Rated TV"
            items={topRatedTV}
            link="/tv/top-rated"
          />
        </>
      )}

      <Footer />
    </main>
  );
}

// ✅ Carousel section with “View More” button
function CarouselSection({
  title,
  items,
  link,
}: {
  title: string;
  items: any[];
  link: string;
}) {
  return (
    <section className="space-y-4">
      {/* Header row: title + button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link href={link}>
          <Button variant="outline" size="sm" className="text-white border border-white bg-transparent hover:bg-white/10 hover:text-white rounded-full">
            View More →
          </Button>
        </Link>
      </div>

      {/* Carousel content */}
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
            >
              <MovieCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
