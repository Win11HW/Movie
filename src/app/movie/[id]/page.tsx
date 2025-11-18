"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieVideos } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Calendar, 
  Clock, 
  Clapperboard, 
  Video, 
  X,
  Users,
  Film
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define TypeScript interfaces
interface Genre {
  id: number;
  name: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface SimilarMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres?: Genre[];
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
  size: number;
}

// Slower Animation variants with proper TypeScript types
const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 80,
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2, // Slower duration
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Slower stagger
      delayChildren: 0.4, // Longer initial delay
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 1.0, // Slower duration
    }
  },
  hover: {
    y: -12, // More pronounced hover effect
    scale: 1.08,
    transition: {
      duration: 0.6, // Slower hover
    }
  }
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.0, // Slower duration
    }
  }
};

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<any>(null);
  const [videos, setVideos] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieData() {
      try {
        setIsLoading(true);
        setError(null);

        const [movieData, creditsData, similarData, videosData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getSimilarMovies(id),
          getMovieVideos(id)
        ]);

        if (!movieData || !(movieData as MovieDetails).id) {
          throw new Error("Movie not found");
        }

        setMovie(movieData as MovieDetails);
        setCredits(creditsData);
        setSimilarMovies(similarData);
        setVideos(videosData);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  // Show loading state
  if (isLoading) {
    return (
      <LazyMotion features={domAnimation}>
        <m.div 
          className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        >
          <m.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1.2,
            }}
          >
            <m.div 
              className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2, // Slower spinner
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <m.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Loading movie details...
            </m.p>
          </m.div>
        </m.div>
      </LazyMotion>
    );
  }

  // Show error state
  if (error || !movie) {
    return (
      <LazyMotion features={domAnimation}>
        <m.main 
          className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-6"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <m.div 
            className="text-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          >
            <m.div 
              className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center"
              whileHover={{ 
                scale: 1.15,
                rotate: 5,
                transition: { duration: 0.5 }
              }}
            >
              <X className="w-8 h-8 text-red-400" />
            </m.div>
            <m.h1 
              className="text-3xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.0 }}
            >
              Movie Not Found
            </m.h1>
            <m.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.0 }}
            >
              {error || "We couldn't find details for this title. Please try another one."}
            </m.p>
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.0 }}
            >
              <Link href="/" className="inline-block mt-6 text-blue-400 hover:text-blue-300 transition-colors duration-500">
                ← Back to Home
              </Link>
            </m.div>
          </m.div>
        </m.main>
      </LazyMotion>
    );
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.jpg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  // Get top 10 cast members
  const topCast = (credits?.cast?.slice(0, 10) || []) as CastMember[];
  
  // Get similar movies (up to 6)
  const similar = (similarMovies?.results?.slice(0, 6) || []) as SimilarMovie[];

  // Get trailer video (first YouTube trailer found)
  const trailer = (videos?.results || []).find(
    (video: Video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <m.main 
        className="min-h-screen bg-gray-900 text-white"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Background Section with Backdrop */}
        <m.div 
          className="relative h-96 md:h-[500px] bg-cover bg-center bg-no-repeat"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2 }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        </m.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 -mt-20 relative z-20">
          <div className="max-w-6xl mx-auto">
            <m.div 
              className="flex flex-col lg:flex-row gap-8 mb-12"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Poster Card */}
              <m.div 
                className="w-full lg:w-1/3 flex justify-center lg:justify-start"
                variants={fadeUpVariants}
                transition={{ delay: 0.6 }}
              >
                <div className="w-72 h-auto relative group">
                  <m.div 
                    className="absolute -inset-4 from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-700"
                    whileHover={{ 
                      scale: 1.02,
                      opacity: 0.8,
                      transition: { duration: 0.8 }
                    }}
                  />
                  <m.div 
                    className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ 
                      scale: 1.08,
                      transition: { 
                        duration: 0.8,
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={imageUrl}
                      alt={movie.title || movie.name || "No title"}
                      width={500}
                      height={750}
                      className="w-full h-auto object-cover transition-transform duration-700"
                      priority
                    />
                  </m.div>
                </div>
              </m.div>

              {/* Movie Info Card */}
              <m.div 
                className="w-full lg:w-2/3"
                variants={fadeUpVariants}
                transition={{ delay: 0.8 }}
              >
                <m.div 
                  className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700/50"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.6 }
                  }}
                >
                  {/* Title Section */}
                  <m.div 
                    className="mb-6"
                    variants={titleVariants}
                  >
                    <m.h1 
                      className="text-3xl md:text-4xl font-bold mb-4 text-white"
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.4 }
                      }}
                    >
                      {movie.title || movie.name || "Untitled"}
                    </m.h1>
                  </m.div>

                  {/* Movie Details Grid */}
                  <m.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                    variants={staggerContainer}
                  >
                    {/* Rating */}
                    <m.div 
                      className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4"
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <m.div
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      </m.div>
                      <div>
                        <div className="text-sm text-gray-400">Rating</div>
                        <div className="text-xl font-bold text-white">
                          {movie.vote_average?.toFixed(1) ?? "N/A"}
                        </div>
                      </div>
                    </m.div>

                    {/* Release Date */}
                    <m.div 
                      className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4"
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <m.div
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </m.div>
                      <div>
                        <div className="text-sm text-gray-400">Release Date</div>
                        <div className="text-xl font-bold text-white">
                          {movie.release_date || movie.first_air_date || "Unknown"}
                        </div>
                      </div>
                    </m.div>

                    {/* Runtime */}
                    {movie.runtime && (
                      <m.div 
                        className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4"
                        variants={cardVariants}
                        whileHover="hover"
                      >
                        <m.div
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Clock className="w-6 h-6 text-green-400" />
                        </m.div>
                        <div>
                          <div className="text-sm text-gray-400">Runtime</div>
                          <div className="text-xl font-bold text-white">
                            {movie.runtime} min
                          </div>
                        </div>
                      </m.div>
                    )}
                  </m.div>

                  {/* Genres Section */}
                  {movie.genres && movie.genres.length > 0 && (
                    <m.div 
                      className="mb-6"
                      variants={titleVariants}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <m.div 
                          className="flex flex-wrap gap-2"
                          variants={staggerContainer}
                        >
                          {movie.genres.map((genre: Genre, index) => (
                            <m.span
                              key={genre.id}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                              variants={cardVariants}
                              whileHover={{ 
                                scale: 1.15,
                                y: -2,
                                transition: { duration: 0.4 }
                              }}
                              custom={index}
                            >
                              {genre.name}
                            </m.span>
                          ))}
                        </m.div>
                      </div>
                    </m.div>
                  )}

                  {/* Storyline Section */}
                  <m.div 
                    className="mb-6"
                    variants={titleVariants}
                  >
                    <m.h2 
                      className="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    >
                      Storyline
                    </m.h2>
                    {movie.overview ? (
                      <m.p 
                        className="text-gray-300 leading-relaxed text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1.0 }}
                      >
                        {movie.overview}
                      </m.p>
                    ) : (
                      <m.p 
                        className="text-gray-500 italic text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1.0 }}
                      >
                        No overview available.
                      </m.p>
                    )}
                  </m.div>
                </m.div>
              </m.div>
            </m.div>

            {/* Video Trailer Section */}
            {trailer && (
              <m.section 
                className="mb-12"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 1.2 }}
              >
                <m.div 
                  className="flex items-center gap-3 mb-6"
                  variants={titleVariants}
                >
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                  <m.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Clapperboard className="w-6 h-6 text-white-400" />
                  </m.div>
                  <h2 className="text-2xl font-bold text-white">Official Trailer</h2>
                </m.div>
                <m.div 
                  className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-700/50"
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.6 }
                  }}
                >
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                      title={trailer.name || "Movie Trailer"}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </m.div>
              </m.section>
            )}

            {/* All Videos Section */}
            {videos?.results && videos.results.length > 0 && (
              <m.section 
                className="mb-12"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1.2 }}
              >
                <m.div 
                  className="flex items-center gap-3 mb-6"
                  variants={titleVariants}
                >
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                  <m.div
                    whileHover={{ rotate: -5, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Video className="w-6 h-6 text-white-400" />
                  </m.div>
                  <h2 className="text-2xl font-bold text-white">Videos & Clips</h2>
                </m.div>
                <m.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                >
                  {videos.results.slice(0, 6).map((video: Video, index: number) => (
                    <m.div 
                      key={video.id} 
                      className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500"
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <div className="relative aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}?rel=0&modestbranding=1`}
                          title={video.name}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-500">
                          {video.name}
                        </h3>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className="capitalize bg-gray-700 px-2 py-1 rounded-full">
                            {video.type}
                          </span>
                          <span className="bg-gray-700 px-2 py-1 rounded-full">
                            {video.site}
                          </span>
                        </div>
                      </div>
                    </m.div>
                  ))}
                </m.div>
              </m.section>
            )}

            {/* Cast Section */}
            <m.section 
              className="mb-12"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.2 }}
            >
              <m.div 
                className="flex items-center gap-3 mb-6"
                variants={titleVariants}
              >
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <m.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Users className="w-6 h-6 text-white" />
                </m.div>
                <h2 className="text-2xl font-bold text-white">Top Cast</h2>
              </m.div>
              
              {topCast.length > 0 ? (
                <m.div 
                  className="relative"
                  variants={staggerContainer}
                >
                  <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                      {topCast.map((person: CastMember, index: number) => (
                        <CarouselItem
                          key={person.id}
                          className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                        >
                          <m.div
                            variants={cardVariants}
                            whileHover="hover"
                            custom={index}
                          >
                            <div className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
                              {/* Bigger image without circular crop and no blue border */}
                              <div className="aspect-[3/4] relative overflow-hidden">
                                <Image
                                  src={
                                    person.profile_path
                                      ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
                                      : "/no-avatar.jpg"
                                  }
                                  alt={person.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                              <div className="p-3">
                                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors duration-500 line-clamp-1">
                                  {person.name}
                                </h3>
                                <p className="text-gray-400 text-xs line-clamp-2">{person.character}</p>
                              </div>
                            </div>
                          </m.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-10 w-10 border-none z-10 shadow-lg transform hover:scale-110 transition-all duration-500" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-700 hover:to-cyan-700 text-white h-10 w-10 border-none z-10 shadow-lg transform hover:scale-110 transition-all duration-500" />
                  </Carousel>
                </m.div>
              ) : (
                <m.div 
                  className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50"
                  variants={cardVariants}
                >
                  <p className="text-gray-500 text-lg">No cast information available.</p>
                </m.div>
              )}
            </m.section>

            {/* Similar Movies Section */}
            <m.section
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 1.2 }}
            >
              <m.div 
                className="flex items-center gap-3 mb-6"
                variants={titleVariants}
              >
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <m.div
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Film className="w-6 h-6 text-white-400" />
                </m.div>
                <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
              </m.div>
              
              {similar.length > 0 ? (
                <m.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                  variants={staggerContainer}
                >
                  {similar.map((similarMovie: SimilarMovie, index: number) => (
                    <m.div
                      key={similarMovie.id}
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                    >
                      <Link
                        href={`/movie/${similarMovie.id}`}
                        className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 block"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <Image
                            src={
                              similarMovie.poster_path
                                ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                                : "/no-image.jpg"
                            }
                            alt={similarMovie.title || similarMovie.name || "No title"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-cyan-300 transition-colors duration-500">
                            {similarMovie.title || similarMovie.name}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded-full">
                              ⭐ {similarMovie.vote_average?.toFixed(1) || "N/A"}
                            </span>
                            <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded-full">
                              {similarMovie.release_date?.substring(0, 4) || "TBA"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </m.div>
                  ))}
                </m.div>
              ) : (
                <m.div 
                  className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50"
                  variants={cardVariants}
                >
                  <p className="text-gray-500 text-lg">No similar movies found.</p>
                </m.div>
              )}
            </m.section>
          </div>
        </div>
      </m.main>
    </LazyMotion>
  );
}