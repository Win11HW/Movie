"use client";

import { useEffect, useState, useContext } from "react";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getTopRatedTV,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchContext } from "./layout"; // 👈 استيراد الكونتكست

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<any[]>([]);
  const { results } = useContext(SearchContext); // ✅ جلب نتائج البحث

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

  return (
    <div className="p-6 flex flex-col gap-8">
      {results ? (
        // ✅ عرض نتائج البحث
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      ) : (
        // 🔹 عرض الأقسام العادية إذا لا يوجد بحث
        <>
          <HeroCarousel items={trendingMovies.slice(0, 8)} />

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
  );
}

/* ✅ Hero Carousel Component */
function HeroCarousel({ items }: { items: any[] }) {
  return (
    <div className="relative w-full h-[60vh]">
      <Carousel opts={{ loop: true, align: "center" }} className="w-full h-full">
        <CarouselContent>
          {items.map((movie) => (
            <CarouselItem key={movie.id} className="relative h-[60vh]">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover brightness-75"
              />
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

/* ✅ Carousel Section */
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
