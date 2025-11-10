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
import Image from "next/image";

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
    <main className="min-h-screen bg-gray-900 text-white flex flex-col gap-0">
      <Navbar onSearch={handleSearch} />

      {/* 🎥 Hero Carousel for Trending Movies */}
      <HeroCarousel items={trendingMovies.slice(0, 8)} />

      <div className="p-6 flex flex-col gap-8">
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
      </div>

      <Footer />
    </main>
  );
}

/* ✅ Hero Carousel Component (top of page) */
function HeroCarousel({ items }: { items: any[] }) {
  return (
    <div className="relative w-full h-[60vh]">
      <Carousel opts={{ loop: true, align: "center" }} className="w-full h-full">
        <CarouselContent>
          {items.map((movie) => (
            <CarouselItem key={movie.id} className="relative h-[60vh]">
              {/* Use regular img */}
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || "Movie"}
                className="w-full h-full object-cover brightness-75"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">
                  {movie.title}
                </h2>
                <p className="max-w-2xl text-sm md:text-base text-gray-200 mb-4 line-clamp-3">
                  {movie.overview}
                </p>
                <Link href={`/movie/${movie.id}`}>
                  <Button className="bg-blue-600 text-white rounded-full px-5 py-2 hover:bg-blue-700">
                    Watch Now →
                  </Button>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white" />
        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white" />
      </Carousel>
    </div>
  );
}


/* ✅ Reusable Carousel Section (Trending, Top Rated, etc.) */
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link href={link}>
          <Button
            variant="outline"
            size="sm"
            className="text-white border border-white bg-transparent hover:bg-white/10 hover:text-white rounded-full"
          >
            View More →
          </Button>
        </Link>
      </div>

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
