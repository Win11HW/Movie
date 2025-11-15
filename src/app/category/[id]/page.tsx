"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTV,
  getTopRatedTV,
  getMoviesByGenre,
  getTVByGenre,
  searchMovies
} from "@/lib/tmdb";

// Category mapping
const categoryConfig: { [key: string]: { title: string; fetchFunction: () => Promise<any[]>; type: string } } = {
  // Movie categories
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
  
  // TV categories
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
  "trending": { 
    title: "Trending Now", 
    fetchFunction: getTrendingMovies, 
    type: "movie" 
  },
  
  // Genre categories (Movies)
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
  "10749": { 
    title: "Romance Movies", 
    fetchFunction: () => getMoviesByGenre(10749), 
    type: "movie" 
  },
  "878": { 
    title: "Sci-Fi Movies", 
    fetchFunction: () => getMoviesByGenre(878), 
    type: "movie" 
  },
  "53": { 
    title: "Thriller Movies", 
    fetchFunction: () => getMoviesByGenre(53), 
    type: "movie" 
  },
};

export default function CategoryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = categoryConfig[id];
  const displayTitle = category?.title || `Category: ${id}`;

  useEffect(() => {
    async function fetchCategoryData() {
      if (!category) {
        setError("Category not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await category.fetchFunction();
        setItems(data);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError("Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryData();
  }, [id, category]);

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
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white/60">{error}</p>
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
            {displayTitle}
          </h1>
          <p className="text-white/60">
            {items.length} {items.length === 1 ? 'item' : 'items'} found
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
            <p className="text-white/60 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}