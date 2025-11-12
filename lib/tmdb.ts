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
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: { api_key: API_KEY },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null;
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