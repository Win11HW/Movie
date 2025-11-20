"use client";

import { useEffect, useState, useRef } from "react";
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

// Framer Motion with LazyMotion for minimal bundle size
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

// Import Lucide icons
import { Clapperboard, Star, Flame, MonitorPlay, Trophy } from 'lucide-react';

// Animation variants with proper typing
const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

// Separate variants for different elements
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    }
  },
  hover: {
    y: -8,
    scale: 1.05,
    transition: {
      duration: 0.3,
    }
  }
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
    }
  }
};

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    }
  },
  tap: {
    scale: 0.95,
  }
};

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for scrolling to sections
  const moviesRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Make sure toggleSection is defined
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

  // Show loading placeholders
  if (isLoading) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="p-4 md:p-6 flex flex-col gap-8 md:gap-12">
          {/* Hero Carousel Placeholder */}
          <div className="relative w-full h-[50vh] md:h-screen rounded-2xl overflow-hidden bg-gray-800 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-lg">Loading...</div>
            </div>
          </div>

          {/* Section Placeholders - Exact structure */}
          <div className="flex flex-col gap-10 md:gap-14">
            <SectionPlaceholder 
              title="Trending Movies" 
              icon={<div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>}
            />
            <SectionPlaceholder 
              title="Top Rated Movies" 
              icon={<div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>}
            />
            <SectionPlaceholder 
              title="Trending Now" 
              icon={<div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>}
            />
            <SectionPlaceholder 
              title="Trending TV Shows" 
              icon={<div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>}
            />
            <SectionPlaceholder 
              title="Top Rated TV Shows" 
              icon={<div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>}
            />
          </div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div 
        className="p-4 md:p-6 flex flex-col gap-8 md:gap-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Hero Carousel with Fade Up */}
        <m.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroCarousel 
            items={trendingMovies.slice(0, 8)} 
            onNavigateToSection={handleNavigateToSection}
          />
        </m.div>

        {/* Movies Section with Fade Up */}
        <AnimatePresence>
          {showMovies && (
            <m.div 
              ref={moviesRef} 
              className="flex flex-col gap-10 md:gap-14 mt-4 md:mt-0"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ExpandableSection
                title="Trending Movies"
                icon={<Clapperboard className="w-5 h-5 md:w-6 md:h-6" />}
                items={trendingMovies}
                sectionId="trending-movies"
                isExpanded={expandedSections["trending-movies"]}
                onToggle={() => toggleSection("trending-movies")}
              />
              <ExpandableSection
                title="Top Rated Movies"
                icon={<Star className="w-5 h-5 md:w-6 md:h-6" />}
                items={topRatedMovies}
                sectionId="top-rated-movies"
                isExpanded={expandedSections["top-rated-movies"]}
                onToggle={() => toggleSection("top-rated-movies")}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* Trend Section with Fade Up */}
        <AnimatePresence>
          {showTrend && (
            <m.div 
              ref={trendRef} 
              className="flex flex-col gap-10 md:gap-14"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ExpandableSection
                title="Trending Now"
                icon={<Flame className="w-5 h-5 md:w-6 md:h-6" />}
                items={trendingMovies}
                sectionId="trending-now"
                isExpanded={expandedSections["trending-now"]}
                onToggle={() => toggleSection("trending-now")}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* TV Section with Fade Up */}
        <AnimatePresence>
          {showTV && (
            <m.div 
              ref={tvRef} 
              className="flex flex-col gap-10 md:gap-14"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ExpandableSection
                title="Trending TV Shows"
                icon={<MonitorPlay className="w-5 h-5 md:w-6 md:h-6" />}
                items={trendingTV}
                sectionId="trending-tv"
                isExpanded={expandedSections["trending-tv"]}
                onToggle={() => toggleSection("trending-tv")}
              />
              <ExpandableSection
                title="Top Rated TV Shows"
                icon={<Trophy className="w-5 h-5 md:w-6 md:h-6" />}
                items={topRatedTV}
                sectionId="top-rated-tv"
                isExpanded={expandedSections["top-rated-tv"]}
                onToggle={() => toggleSection("top-rated-tv")}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* Show message when a specific section is active */}
        <AnimatePresence>
          {!showAllSections && (
            <m.div 
              className="text-center py-6 md:py-8"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <m.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={() => handleNavigateToSection("home")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full px-6 py-3 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 cursor-pointer"
                >
                  ← Back to All Sections
                </Button>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );
}

/* Section Placeholder Component - Exact match to ExpandableSection */
function SectionPlaceholder({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <section className="space-y-4 md:space-y-6">
      {/* Title Placeholder - Exact structure */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
          <div className="flex items-center gap-2">
            {icon}
            <div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse border border-gray-600"></div>
      </div>

      {/* Carousel Placeholder - Exact carousel structure */}
      <div className="relative">
        <div className="flex gap-4 md:gap-6 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(33.333%-10px)] md:flex-[0_0_calc(20%-10px)] lg:flex-[0_0_calc(16.666%-10px)]"
            >
              <div className="group bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="aspect-[2/3] relative overflow-hidden bg-gray-700 animate-pulse">
                  {/* Image placeholder */}
                </div>
                <div className="p-3">
                  <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Navigation Placeholders */}
        <div className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 bg-gray-700 rounded-full animate-pulse border-none z-10"></div>
        <div className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 bg-gray-700 rounded-full animate-pulse border-none z-10"></div>
      </div>
    </section>
  );
}

/* Hero Carousel Component with Auto-Sliding Only */
function HeroCarousel({ items, onNavigateToSection }: { items: any[], onNavigateToSection?: (section: string) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide configuration
  const AUTO_SLIDE_INTERVAL = 7000; // 7 seconds

  // Initialize auto slide
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % items.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [items.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + items.length) % items.length);
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        className="relative w-full h-[50vh] md:h-screen rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Carousel 
          opts={{ 
            loop: true, 
            align: "center",
            startIndex: currentSlide
          }} 
          className="w-full h-full"
        >
          <CarouselContent style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {items.map((movie, index) => (
              <CarouselItem key={movie.id} className="relative h-[50vh] md:h-[99vh] basis-full">
                <m.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title || "Movie"}
                    className="w-full h-full object-cover brightness-75 rounded-2xl"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent flex flex-col justify-end p-4 md:p-10 rounded-b-2xl">
                    <m.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    >
                      <h2 className="text-xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-3 text-white">
                        {movie.title}
                      </h2>
                      <m.p 
                        className="max-w-2xl text-xs md:text-sm lg:text-base text-gray-200 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {movie.overview}
                      </m.p>
                      <m.div 
                        className="flex gap-3 md:gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Link href={`/movie/${movie.id}`}>
                          <m.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full px-4 py-2 md:px-5 md:py-2 text-sm md:text-base hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg cursor-pointer">
                              Watch Now →
                            </Button>
                          </m.div>
                        </Link>
                      </m.div>
                    </m.div>
                  </div>
                </m.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious 
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-8 w-8 md:h-12 md:w-12 border-none z-10 shadow-lg cursor-pointer rounded-full"
            onClick={prevSlide}
          />
          <CarouselNext 
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-8 w-8 md:h-12 md:w-12 border-none z-10 shadow-lg cursor-pointer rounded-full"
            onClick={nextSlide}
          />
        </Carousel>
      </m.div>
    </LazyMotion>
  );
}

/* Expandable Section Component with Framer Motion */
function ExpandableSection({
  title,
  icon,
  items,
  sectionId,
  isExpanded,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  sectionId: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Show only 10 items in carousel view, all items in expanded view
  const displayedItems = isExpanded ? items : items.slice(0, 10);

  return (
    <LazyMotion features={domAnimation}>
      <m.section 
        className="space-y-4 md:space-y-6"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <m.div 
          className="flex items-center justify-between"
          variants={titleVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            </div>
          </div>
          <m.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-white border border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer"
              onClick={onToggle}
            >
              {isExpanded ? "Show Less ↑" : "View More →"}
            </Button>
          </m.div>
        </m.div>

        {!isExpanded ? (
          // Carousel view for collapsed state - Each card with fade-up
          <div className="relative">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {displayedItems.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
                  >
                    <m.div
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover="hover"
                      custom={index}
                    >
                      <MovieCard {...item} />
                    </m.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-6 w-6 md:h-8 md:w-8 border-none z-10 shadow-lg cursor-pointer" />
              <CarouselNext className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-6 w-6 md:h-8 md:w-8 border-none z-10 shadow-lg cursor-pointer" />
            </Carousel>
          </div>
        ) : (
          // Grid view for expanded state - Each card with fade-up and stagger
          <m.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {displayedItems.map((item, index) => (
              <m.div
                key={item.id}
                variants={cardVariants}
                whileHover="hover"
                custom={index}
              >
                <MovieCard {...item} />
              </m.div>
            ))}
          </m.div>
        )}
      </m.section>
    </LazyMotion>
  );
}