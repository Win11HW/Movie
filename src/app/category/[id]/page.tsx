"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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

// Icons
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
  Skull,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
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

// Category mapping with icons
const categoryConfig: { [key: string]: { 
  title: string; 
  fetchFunction: (page: number) => Promise<any>; 
  type: string;
  icon: React.ReactNode;
} } = {
  // Movie categories
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
  
  // TV categories
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
  
  // Trending category
  "trending": { 
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie",
    icon: <Flame className="w-5 h-5 md:w-6 md:h-6" />
  },
  "trending-now": {
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie",
    icon: <Flame className="w-5 h-5 md:w-6 md:h-6" />
  },
  
  // Genre categories by ID (matching navbar links)
  "28": { 
    title: "Action Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(28, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "12": { 
    title: "Adventure Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(12, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "53": { 
    title: "Thriller Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(53, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "80": { 
    title: "Crime Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(80, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "10752": { 
    title: "War Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(10752, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "37": { 
    title: "Western Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(37, page), 
    type: "movie",
    icon: <Sword className="w-5 h-5 md:w-6 md:h-6" />
  },
  "18": { 
    title: "Drama Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(18, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "10749": { 
    title: "Romance Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(10749, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "36": { 
    title: "History Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(36, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "10751": { 
    title: "Family Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(10751, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "10770": { 
    title: "TV Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(10770, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "14": { 
    title: "Fantasy Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(14, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "878": { 
    title: "Science Fiction Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(878, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "27": { 
    title: "Horror Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(27, page), 
    type: "movie",
    icon: <Skull className="w-5 h-5 md:w-6 md:h-6" />
  },
  "9648": { 
    title: "Mystery Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(9648, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "35": { 
    title: "Comedy Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(35, page), 
    type: "movie",
    icon: <Laugh className="w-5 h-5 md:w-6 md:h-6" />
  },
  "16": { 
    title: "Animation Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(16, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "10402": { 
    title: "Music Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(10402, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },
  "99": { 
    title: "Documentary Movies", 
    fetchFunction: (page: number) => getMoviesByGenre(99, page), 
    type: "movie",
    icon: <Drama className="w-5 h-5 md:w-6 md:h-6" />
  },

  // Search category
  "search": { 
    title: "Search Results", 
    fetchFunction: (page: number) => Promise.resolve({ results: [], total_pages: 0, total_results: 0 }),
    type: "mixed",
    icon: <Search className="w-5 h-5 md:w-6 md:h-6" />
  },
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Get search query if this is a search page
  const searchQuery = searchParams?.get('q');
  const pageFromUrl = searchParams?.get('page');
  
  const category = categoryConfig[id];
  
  // Define displayIcon here in the component scope
  const displayIcon = category?.icon || <Trophy className="w-5 h-5 md:w-6 md:h-6" />;
  
  // Define getPageTitle function here in the component scope
  const getPageTitle = () => {
    if (id === "search" && searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return category?.title || `Category: ${id}`;
  };

  useEffect(() => {
    // Parse page from URL or default to 1
    if (pageFromUrl) {
      const pageNum = parseInt(pageFromUrl);
      if (!isNaN(pageNum) && pageNum >= 1) {
        setCurrentPage(pageNum);
      }
    } else {
      setCurrentPage(1);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        setIsLoading(true);
        setError(null);

        let data;
        
        // Handle search
        if (id === "search" && searchQuery) {
          const searchData = await searchMovies(searchQuery, currentPage);
          data = searchData;
          if (data.results.length === 0 && currentPage === 1) {
            setError(`No results found for "${searchQuery}"`);
          } else {
            setItems(data.results || []);
            setTotalPages(data.total_pages || 1);
            setTotalResults(data.total_results || 0);
          }
        } 
        // Handle regular categories
        else {
          if (!category) {
            setError("Category not found");
            setIsLoading(false);
            return;
          }
          const categoryData = await category.fetchFunction(currentPage);
          data = categoryData;
          setItems(data.results || []);
          setTotalPages(data.total_pages || 1);
          setTotalResults(data.total_results || 0);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryData();
  }, [id, searchQuery, category, currentPage, pageFromUrl]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    
    router.push(`/category/${id}?${params.toString()}`, { scroll: true });
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2);
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <m.section 
            className="space-y-4 md:space-y-6 mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <m.div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
              
              {/* Page Count with Total Items */}
              <div className="flex items-center gap-3">
                <div className="text-white/60 text-sm border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="text-white/60 text-sm border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                  {totalResults.toLocaleString()} items
                </div>
              </div>
            </m.div>
          </m.section>

          {/* Content Grid */}
          {items.length > 0 ? (
            <>
              <m.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {items.map((item, index) => (
                  <m.div
                    key={`${item.id}-${currentPage}-${index}`}
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

              {/* Pagination Component */}
              {totalPages > 1 && (
                <m.div 
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 border-t border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Mobile: Simple Previous/Next */}
                  <div className="flex sm:hidden items-center justify-between w-full">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-white/60">
                        Page {currentPage} of {totalPages}
                      </span>
                      <span className="text-xs text-white/40">
                        {totalResults.toLocaleString()} total
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Desktop: Full Pagination */}
                  <div className="hidden sm:flex items-center justify-center w-full">
                    {/* Page navigation */}
                    <div className="flex items-center gap-1">
                      {/* First Page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="First Page"
                      >
                        <ChevronsLeft className="w-5 h-5" />
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 mx-2">
                        {getPageNumbers().map((pageNum, index) => (
                          pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 py-1 text-white/40">
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum as number)}
                              className={`min-w-[2.5rem] px-2 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-white/60 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        ))}
                      </div>

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Last Page"
                      >
                        <ChevronsRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </m.div>
              )}
            </>
          ) : (
            <m.div 
              className="text-center py-12"
              variants={itemVariants}
            >
              <p className="text-white/60 text-lg">No items found.</p>
            </m.div>
          )}
        </div>
      </m.div>
    </LazyMotion>
  );
}