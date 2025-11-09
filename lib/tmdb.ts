import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
};

export const searchMovies = async (query: string) => {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: { api_key: API_KEY, query },
  });
  return res.data.results;
};

export const getMovieDetails = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
  });
  return res.data;
};