import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper for list endpoints
const fetchFromTMDB = async (endpoint: string, params = {}) => {
  const res = await axios.get(`${BASE_URL}${endpoint}`, {
    params: { api_key: API_KEY, ...params },
  });
  return res.data.results;
};

// ✅ Movie lists
export const getPopularMovies = () => fetchFromTMDB("/movie/popular");
export const getTrendingMovies = () => fetchFromTMDB("/trending/movie/day");
export const getTopRatedMovies = () => fetchFromTMDB("/movie/top_rated");

// ✅ TV lists
export const getTrendingTV = () => fetchFromTMDB("/trending/tv/day");
export const getTopRatedTV = () => fetchFromTMDB("/tv/top_rated");

// ✅ Search
export const searchMovies = async (query: string) => {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query },
  });
  return res.data.results;
};

// Add to your existing tmdb.ts file

// Get movies by genre
export async function getMoviesByGenre(genreId: number): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
}

// Get TV shows by genre (if needed in the future)
export async function getTVByGenre(genreId: number): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV by genre:", error);
    return [];
  }
}

// ✅ Movie Videos/Trailers
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

// ✅ Details (Movie or TV)
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

// ✅ Movie Credits (using axios)
export const getMovieCredits = async (movieId: string) => {
  try {
    console.log('Attempting to fetch credits for movie:', movieId);
    console.log('API Key available:', !!API_KEY); // Should log 'true'
    
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: API_KEY },
      timeout: 10000, // Set a 10-second timeout
    });
    
    console.log('Response status:', res.status);
    return res.data;
    
  } catch (error) {
    // Log detailed error information
    console.error('Full error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error message:', error.message);
      console.error('HTTP status code:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    
    // Return a fallback or re-throw the error
    throw error;
  }
};

// ✅ Similar Movies (using axios)
export const getSimilarMovies = async (movieId: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return null;
  }
};