"use client";

import { useEffect, useState, useContext, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState<string>("home");
  const { results } = useContext(SearchContext);

  // Refs for scrolling to sections
  const moviesRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);

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

  const handleNavigateToSection = (section: string) => {
    setActiveSection(section);
    
    // Scroll to the appropriate section
    setTimeout(() => {
      switch (section) {
        case "movies":
          moviesRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "trend":
          trendRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "tv":
          tvRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "home":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
      }
    }, 100);
  };

  // Filter sections based on active navigation
  const showAllSections = activeSection === "home";
  const showMovies = showAllSections || activeSection === "movies";
  const showTrend = showAllSections || activeSection === "trend";
  const showTV = showAllSections || activeSection === "tv";

  return (
    <div className="p-4 md:p-6 flex flex-col gap-8 md:gap-12"> {/* Reduced mobile padding and gap */}
      {results ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      ) : (
        // 🔹 Display regular sections if no search
        <>
          <HeroCarousel 
            items={trendingMovies.slice(0, 8)} 
            onNavigateToSection={handleNavigateToSection}
          />

          {/* Movies Section */}
          {showMovies && (
            <div ref={moviesRef} className="flex flex-col gap-10 md:gap-14 mt-4 md:mt-0"> {/* Added mobile gap and top margin */}
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
                title="🔥 Trending Now"
                items={trendingMovies}
                sectionId="trending-now"
                isExpanded={expandedSections["trending-now"]}
                onToggle={() => toggleSection("trending-now")}
              />
              <ExpandableSection
                title="📺 Trending TV Shows"
                items={trendingTV}
                sectionId="trending-tv"
                isExpanded={expandedSections["trending-tv"]}
                onToggle={() => toggleSection("trending-tv")}
              />
              <ExpandableSection
                title="🏆 Top Rated TV Shows"
                items={topRatedTV}
                sectionId="top-rated-tv"
                isExpanded={expandedSections["top-rated-tv"]}
                onToggle={() => toggleSection("top-rated-tv")}
              />
            </div>
          )}

          {/* Show message when a specific section is active */}
          {!showAllSections && (
            <div className="text-center py-6 md:py-8">
              <Button
                onClick={() => handleNavigateToSection("home")}
                className="bg-blue-600 text-white rounded-full px-6 py-3 hover:bg-blue-700"
              >
                ← Back to All Sections
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ✅ Hero Carousel Component */
function HeroCarousel({ items, onNavigateToSection }: { items: any[], onNavigateToSection?: (section: string) => void }) {
  return (
    <div className="relative w-full h-[50vh] md:h-screen"> {/* Reduced mobile height */}
      <Carousel opts={{ loop: true, align: "center" }} className="w-full h-full">
        <CarouselContent>
          {items.map((movie) => (
            <CarouselItem key={movie.id} className="relative h-[50vh] md:h-[99vh]"> {/* Reduced mobile height */}
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || "Movie"}
                className="w-full h-full object-cover brightness-75"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-10"> {/* Reduced mobile padding */}
                <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-3"> {/* Responsive text size */}
                  {movie.title}
                </h2>
                <p className="max-w-2xl text-xs md:text-sm lg:text-base text-gray-200 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3"> {/* Responsive text and line clamp */}
                  {movie.overview}
                </p>
                <div className="flex gap-3 md:gap-4"> {/* Responsive gap */}
                  <Link href={`/movie/${movie.id}`}>
                    <Button className="bg-blue-600 text-white rounded-full px-4 py-2 md:px-5 md:py-2 text-sm md:text-base hover:bg-blue-700"> {/* Responsive button */}
                      Watch Now →
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-8 w-8 md:h-12 md:w-12 border-none z-10" /> {/* Smaller on mobile */}
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-8 w-8 md:h-12 md:w-12 border-none z-10" /> {/* Smaller on mobile */}
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
    <section className="space-y-4 md:space-y-6"> {/* Reduced space on mobile */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2> {/* Smaller title on mobile */}
        <Button
          variant="outline"
          size="sm"
          className="text-white border border-white bg-transparent hover:bg-white/10 hover:text-white rounded-full text-xs md:text-sm"
          onClick={onToggle}
        >
          {isExpanded ? "Show Less ↑" : "View More →"}
        </Button>
      </div>

      {!isExpanded ? (
        // Carousel view for collapsed state
        <div className="relative">
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
            <CarouselPrevious className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-6 w-6 md:h-8 md:w-8 border-none z-10" /> {/* Smaller on mobile */}
            <CarouselNext className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-6 w-6 md:h-8 md:w-8 border-none z-10" /> {/* Smaller on mobile */}
          </Carousel>
        </div>
      ) : (
        // Grid view for expanded state
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"> {/* Smaller gap on mobile */}
          {displayedItems.map((item) => (
            <MovieCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}