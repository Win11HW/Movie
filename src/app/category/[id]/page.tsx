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

// Updated Category mapping to match navbar/footer links
const categoryConfig: { [key: string]: { title: string; fetchFunction: () => Promise<any[]>; type: string } } = {
  // Movie categories - match navbar links
  "trending-movies": { 
    title: "Trending Movies", 
    fetchFunction: getTrendingMovies, 
    type: "movie" 
  },
  "top-rated-movies": { 
    title: "Top Rated Movies", 
    fetchFunction: getTopRatedMovies, 
    type: "movie" 
  },
  
  // TV categories - match navbar links
  "trending-tv": { 
    title: "Trending TV Shows", 
    fetchFunction: getTrendingTV, 
    type: "tv" 
  },
  "top-rated-tv": { 
    title: "Top Rated TV Shows", 
    fetchFunction: getTopRatedTV, 
    type: "tv" 
  },
  
  // Trending category - match navbar link
  "trending": { 
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie" 
  },
  
  // Genre categories - match footer links
  "28": { 
    title: "Action Movies", 
    fetchFunction: () => getMoviesByGenre(28), 
    type: "movie" 
  },
  "35": { 
    title: "Comedy Movies", 
    fetchFunction: () => getMoviesByGenre(35), 
    type: "movie" 
  },
  "18": { 
    title: "Drama Movies", 
    fetchFunction: () => getMoviesByGenre(18), 
    type: "movie" 
  },
  "27": { 
    title: "Horror Movies", 
    fetchFunction: () => getMoviesByGenre(27), 
    type: "movie" 
  },

  // Search category
  "search": { 
    title: "Search Results", 
    fetchFunction: () => Promise.resolve([]), // Will be handled separately
    type: "mixed" 
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
          const category = categoryConfig[id];
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
  }, [id, searchQuery]);

  // Get page title
  const getPageTitle = () => {
    if (id === "search" && searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return categoryConfig[id]?.title || `Category: ${id}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {id === "search" && searchQuery ? `Search: "${searchQuery}"` : "Error"}
          </h1>
          <p className="text-white/60 text-lg">{error}</p>
          {id === "search" && searchQuery && (
            <div className="mt-6">
              <p className="text-white/80 mb-4">Suggestions:</p>
              <ul className="text-white/60 list-disc list-inside space-y-1">
                <li>Check your spelling</li>
                <li>Try more general terms</li>
                <li>Try different keywords</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-white/60">
            {items.length} {items.length === 1 ? 'item' : 'items'} found
            {id === "search" && searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Movies/TV Shows Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {items.map((item) => (
              <MovieCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}