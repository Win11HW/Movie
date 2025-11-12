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
import { SearchContext } from "./layout";

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const { results } = useContext(SearchContext);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      {results ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      ) : (
        // 🔹 Display regular sections if no search
        <>
          <HeroCarousel items={trendingMovies.slice(0, 8)} />

          <ExpandableSection
            title="🎬 Trending Movies"
            items={trendingMovies}
            sectionId="trending-movies"
            isExpanded={expandedSections["trending-movies"]}
            onToggle={() => toggleSection("trending-movies")}
          />
          <ExpandableSection
            title="⭐ Top Rated Movies"
            items={topRatedMovies}
            sectionId="top-rated-movies"
            isExpanded={expandedSections["top-rated-movies"]}
            onToggle={() => toggleSection("top-rated-movies")}
          />
          <ExpandableSection
            title="📺 Trending TV"
            items={trendingTV}
            sectionId="trending-tv"
            isExpanded={expandedSections["trending-tv"]}
            onToggle={() => toggleSection("trending-tv")}
          />
          <ExpandableSection
            title="🏆 Top Rated TV"
            items={topRatedTV}
            sectionId="top-rated-tv"
            isExpanded={expandedSections["top-rated-tv"]}
            onToggle={() => toggleSection("top-rated-tv")}
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

/* ✅ Expandable Section Component */
function ExpandableSection({
  title,
  items,
  sectionId,
  isExpanded,
  onToggle,
}: {
  title: string;
  items: any[];
  sectionId: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Show only 10 items in carousel view, all items in expanded view
  const displayedItems = isExpanded ? items : items.slice(0, 10);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-white border border-white bg-transparent hover:bg-white/10 hover:text-white rounded-full"
          onClick={onToggle}
        >
          {isExpanded ? "Show Less ↑" : "View More →"}
        </Button>
      </div>

      {!isExpanded ? (
        // Carousel view for collapsed state
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {displayedItems.map((item) => (
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
      ) : (
        // Grid view for expanded state
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {displayedItems.map((item) => (
            <MovieCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}