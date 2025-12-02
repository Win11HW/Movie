import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper for paginated endpoints - returns full response
const fetchFromTMDB = async (endpoint: string, params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}${endpoint}`, {
      params: { 
        api_key: API_KEY, 
        ...params 
      },
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching from TMDB (${endpoint}):`, error);
    throw error;
  }
};

// Movie lists with pagination
export const getPopularMovies = (page = 1) => fetchFromTMDB("/movie/popular", { page });
export const getTrendingMovies = (page = 1) => fetchFromTMDB("/trending/movie/day", { page });
export const getTopRatedMovies = (page = 1) => fetchFromTMDB("/movie/top_rated", { page });
export const getNowPlayingMovies = (page = 1) => fetchFromTMDB("/movie/now_playing", { page });
export const getUpcomingMovies = (page = 1) => fetchFromTMDB("/movie/upcoming", { page });

// TV lists with pagination
export const getTrendingTV = (page = 1) => fetchFromTMDB("/trending/tv/day", { page });
export const getTopRatedTV = (page = 1) => fetchFromTMDB("/tv/top_rated", { page });
export const getPopularTV = (page = 1) => fetchFromTMDB("/tv/popular", { page });
export const getAiringTodayTV = (page = 1) => fetchFromTMDB("/tv/airing_today", { page });
export const getOnTheAirTV = (page = 1) => fetchFromTMDB("/tv/on_the_air", { page });

// Search with pagination
export const searchMovies = async (query: string, page = 1) => {
  return fetchFromTMDB("/search/movie", { 
    query, 
    page,
    include_adult: false 
  });
};

export const searchTV = async (query: string, page = 1) => {
  return fetchFromTMDB("/search/tv", { 
    query, 
    page,
    include_adult: false 
  });
};

export const searchMulti = async (query: string, page = 1) => {
  return fetchFromTMDB("/search/multi", { 
    query, 
    page,
    include_adult: false 
  });
};

// Genre functions with pagination
export async function getMoviesByGenre(genreId: number, page = 1): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return { 
      results: [], 
      total_pages: 0, 
      page: 1,
      total_results: 0 
    };
  }
}

export async function getTVByGenre(genreId: number, page = 1): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV by genre:", error);
    return { 
      results: [], 
      total_pages: 0, 
      page: 1,
      total_results: 0 
    };
  }
}

// Extended discover functions with filters
export const discoverMovies = async (params = {}, page = 1) => {
  return fetchFromTMDB("/discover/movie", {
    sort_by: "popularity.desc",
    include_adult: false,
    include_video: false,
    page,
    ...params
  });
};

export const discoverTV = async (params = {}, page = 1) => {
  return fetchFromTMDB("/discover/tv", {
    sort_by: "popularity.desc",
    include_adult: false,
    page,
    ...params
  });
};

// Movie Videos
export const getMovieVideos = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};

export const getTVVideos = async (tvId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/videos`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV videos:", error);
    return null;
  }
};

// Details
export const getMovieDetails = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      try {
        const resTv = await axios.get(`${BASE_URL}/tv/${id}`, {
          params: { api_key: API_KEY },
        });
        return resTv.data;
      } catch {
        throw new Error("Not found");
      }
    }
    throw err;
  }
};

export const getTVDetails = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${id}`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV details:", error);
    throw error;
  }
};

// Credits
export const getMovieCredits = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

export const getTVCredits = async (tvId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/credits`, {
      params: { api_key: API_KEY },
      timeout: 10000,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV credits:", error);
    throw error;
  }
};

// Similar content
export const getSimilarMovies = async (movieId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return { results: [], total_pages: 0 };
  }
};

export const getSimilarTV = async (tvId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/similar`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching similar TV shows:", error);
    return { results: [], total_pages: 0 };
  }
};

// Recommendations
export const getMovieRecommendations = async (movieId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/recommendations`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    return { results: [], total_pages: 0 };
  }
};

export const getTVRecommendations = async (tvId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/recommendations`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV recommendations:", error);
    return { results: [], total_pages: 0 };
  }
};

// Reviews
export const getMovieReviews = async (movieId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/reviews`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return { results: [], total_pages: 0 };
  }
};

export const getTVReviews = async (tvId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/reviews`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV reviews:", error);
    return { results: [], total_pages: 0 };
  }
};

// Images
export const getMovieImages = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie images:", error);
    return null;
  }
};

export const getTVImages = async (tvId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/images`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV images:", error);
    return null;
  }
};

// Keywords
export const getMovieKeywords = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/keywords`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie keywords:", error);
    return { keywords: [] };
  }
};

// Watch providers
export const getMovieWatchProviders = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/watch/providers`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie watch providers:", error);
    return { results: {} };
  }
};

export const getTVWatchProviders = async (tvId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/tv/${tvId}/watch/providers`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV watch providers:", error);
    return { results: {} };
  }
};

// Genres
export const getMovieGenres = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return { genres: [] };
  }
};

export const getTVGenres = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/genre/tv/list`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return { genres: [] };
  }
};

// Person details
export const getPersonDetails = async (personId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/person/${personId}`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching person details:", error);
    throw error;
  }
};

export const getPersonCredits = async (personId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/person/${personId}/combined_credits`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching person credits:", error);
    throw error;
  }
};

// Lists
export const getMovieList = async (listId: string, page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/list/${listId}`, {
      params: { 
        api_key: API_KEY,
        page 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie list:", error);
    return { items: [], total_pages: 0 };
  }
};

// Configuration
export const getConfiguration = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/configuration`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return {
      images: {
        secure_base_url: "https://image.tmdb.org/t/p/",
        backdrop_sizes: ["w300", "w780", "w1280", "original"],
        logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
        poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
        profile_sizes: ["w45", "w185", "h632", "original"],
        still_sizes: ["w92", "w185", "w300", "original"]
      }
    };
  }
};

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size = "original") => {
  if (!path) return "/placeholder-image.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get YouTube trailer
export const getYouTubeTrailer = (videos: any) => {
  if (!videos || !videos.results) return null;
  const trailer = videos.results.find(
    (video: any) => 
      video.site === "YouTube" && 
      (video.type === "Trailer" || video.type === "Teaser")
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

// Cache helper for better performance
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedFetch = async <T>(
  key: string, 
  fetchFunction: () => Promise<T>
): Promise<T> => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

// Clear cache helper
export const clearCache = () => {
  cache.clear();
};