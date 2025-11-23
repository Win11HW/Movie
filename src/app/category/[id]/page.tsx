"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getTopRatedTV,
  getMoviesByGenre,
  searchMovies
} from "@/lib/tmdb";

// Framer Motion with LazyMotion for minimal bundle size
import { LazyMotion, domAnimation, m } from "framer-motion";
import type { Variants } from "framer-motion";

// Icons for different categories
import { 
  Star, 
  Trophy, 
  MonitorPlay, 
  Flame,
  Search,
  Sword,
  Laugh,
  Drama,
  Clapperboard,
  Skull
} from 'lucide-react';

// Animation variants with proper TypeScript types
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Updated Category mapping with icons - Make sure this matches the sectionIds from homepage
const categoryConfig: { [key: string]: { 
  title: string; 
  fetchFunction: () => Promise<any[]>; 
  type: string;
  icon: React.ReactNode;
} } = {
  // Movie categories - match homepage sections
  "trending-movies": { 
    title: "Trending Movies", 
    fetchFunction: getTrendingMovies, 
    type: "movie",
    icon: <Clapperboard className="w-5 h-5 md:w-6 md:h-6" />
  },
  "top-rated-movies": { 
    title: "Top Rated Movies", 
    fetchFunction: getTopRatedMovies, 
    type: "movie",
    icon: <Star className="w-5 h-5 md:w-6 md:h-6" />
  },
  
  // TV categories - match homepage sections
  "trending-tv": { 
    title: "Trending TV Shows", 
    fetchFunction: getTrendingTV, 
    type: "tv",
    icon: <MonitorPlay className="w-5 h-5 md:w-6 md:h-6" />
  },
  "top-rated-tv": { 
    title: "Top Rated TV Shows", 
    fetchFunction: getTopRatedTV, 
    type: "tv",
    icon: <Trophy className="w-5 h-5 md:w-6 md:h-6" />
  },
  
  // Trending category - match homepage section
  "trending": { 
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie",
    icon: <Flame className="w-5 h-5 md:w-6 md:h-6" />
  },
  "trending-now": { // Add this to handle the sectionId from homepage
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie",
    icon: <Flame className="w-5 h-5 md:w-6 md:h-6" />
  },
  
  // Genre categories
  "28": { 
    title: "Action Movies", 
    fetchFunction: () => getMoviesByGenre(28), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "35": { 
    title: "Comedy Movies", 
    fetchFunction: () => getMoviesByGenre(35), 
    type: "movie",
    icon: <Laugh className="w-5 h-5 md:w-6 md:h-6" />
  },
  "18": { 
    title: "Drama Movies", 
    fetchFunction: () => getMoviesByGenre(18), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "27": { 
    title: "Horror Movies", 
    fetchFunction: () => getMoviesByGenre(27), 
    type: "movie",
    icon: <Skull className="w-5 h-5 md:w-6 md:h-6" />
  },

  // Search category
  "search": { 
    title: "Search Results", 
    fetchFunction: () => Promise.resolve([]),
    type: "mixed",
    icon: <Search className="w-5 h-5 md:w-6 md:h-6" />
  },
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search query if this is a search page
  const searchQuery = searchParams?.get('q');

  const category = categoryConfig[id];
  const displayTitle = category?.title || `Category: ${id}`;
  const displayIcon = category?.icon || <Trophy className="w-5 h-5 md:w-6 md:h-6" />;

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        setIsLoading(true);
        setError(null);

        let data;
        
        // Handle search
        if (id === "search" && searchQuery) {
          data = await searchMovies(searchQuery);
          if (data.length === 0) {
            setError(`No results found for "${searchQuery}"`);
          } else {
            setItems(data);
          }
        } 
        // Handle regular categories
        else {
          if (!category) {
            setError("Category not found");
            setIsLoading(false);
            return;
          }
          data = await category.fetchFunction();
          setItems(data);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryData();
  }, [id, searchQuery, category]);

  // Get page title
  const getPageTitle = () => {
    if (id === "search" && searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return displayTitle;
  };

  // Show loading state
  if (isLoading) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gray-900 pt-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Loading Skeleton matching the exact structure */}
            <section className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse border border-gray-600"></div>
              </div>

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
          </div>
        </div>
      </LazyMotion>
    );
  }

  // Show error state
  if (error) {
    return (
      <LazyMotion features={domAnimation}>
        <m.div 
          className="min-h-screen bg-gray-900 pt-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <m.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={itemVariants}
            >
              {id === "search" && searchQuery ? `Search: "${searchQuery}"` : "Error"}
            </m.h1>
            <m.p 
              className="text-white/60 text-lg"
              variants={itemVariants}
            >
              {error}
            </m.p>
            {id === "search" && searchQuery && (
              <m.div 
                className="mt-6"
                variants={itemVariants}
              >
                <p className="text-white/80 mb-4">Suggestions:</p>
                <ul className="text-white/60 list-disc list-inside space-y-1">
                  <li>Check your spelling</li>
                  <li>Try more general terms</li>
                  <li>Try different keywords</li>
                </ul>
              </m.div>
            )}
          </div>
        </m.div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div 
        className="min-h-screen bg-gray-900 pt-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Exact same structure as homepage sections with Framer Motion */}
          <m.section 
            className="space-y-4 md:space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Header with blue bar and icon - identical to homepage */}
            <m.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  {displayIcon}
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>
              {/* Item count badge */}
              <div className="text-white/60 text-sm border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </div>
            </m.div>

            {/* Movies/TV Shows Grid with staggered animation */}
            {items.length > 0 ? (
              <m.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {items.map((item, index) => (
                  <m.div
                    key={item.id}
                    variants={gridItemVariants}
                    custom={index}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MovieCard {...item} />
                  </m.div>
                ))}
              </m.div>
            ) : (
              <m.div 
                className="text-center py-12"
                variants={itemVariants}
              >
                <p className="text-white/60 text-lg">No items found.</p>
              </m.div>
            )}
          </m.section>
        </div>
      </m.div>
    </LazyMotion>
  );
}