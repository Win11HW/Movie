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

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  try {
    // Await the params object first
    const { id } = await params;
    
    // Fetch all data in parallel
    const [movie, credits, similarMovies, videos] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getSimilarMovies(id),
      getMovieVideos(id)
    ]);

    if (!movie || !(movie as MovieDetails).id) {
      throw new Error("Movie not found");
    }

    const movieDetails = movie as MovieDetails;
    const imageUrl = movieDetails.poster_path
      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
      : "/no-image.jpg";

    const backdropUrl = movieDetails.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`
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
      <main className="min-h-screen bg-gray-900 text-white">
        {/* Background Section with Backdrop */}
        <div 
          className="relative h-96 md:h-[500px] bg-cover bg-center bg-no-repeat"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 -mt-20 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Poster Card */}
              <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
                <div className="w-72 h-auto relative group">
                  <div className="absolute -inset-4 from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={movieDetails.title || movieDetails.name || "No title"}
                      width={500}
                      height={750}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Movie Info Card */}
              <div className="w-full lg:w-2/3">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700/50">
                  {/* Title Section */}
                  <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                      {movieDetails.title || movieDetails.name || "Untitled"}
                    </h1>
                  </div>

                  {/* Movie Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Rating */}
                    <div className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <div>
                        <div className="text-sm text-gray-400">Rating</div>
                        <div className="text-xl font-bold text-white">
                          {movieDetails.vote_average?.toFixed(1) ?? "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Release Date */}
                    <div className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-sm text-gray-400">Release Date</div>
                        <div className="text-xl font-bold text-white">
                          {movieDetails.release_date || movieDetails.first_air_date || "Unknown"}
                        </div>
                      </div>
                    </div>

                    {/* Runtime */}
                    {movieDetails.runtime && (
                      <div className="flex items-center gap-3 bg-gray-700/50 rounded-xl p-4">
                        <Clock className="w-6 h-6 text-green-400" />
                        <div>
                          <div className="text-sm text-gray-400">Runtime</div>
                          <div className="text-xl font-bold text-white">
                            {movieDetails.runtime} min
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Genres Section */}
                  {movieDetails.genres && movieDetails.genres.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex flex-wrap gap-2">
                          {movieDetails.genres.map((genre: Genre) => (
                            <span
                              key={genre.id}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Storyline Section */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">
                      Storyline
                    </h2>
                    {movieDetails.overview ? (
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {movieDetails.overview}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic text-lg">
                        No overview available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Trailer Section */}
            {trailer && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                  <Clapperboard className="w-6 h-6 text-white-400" />
                  <h2 className="text-2xl font-bold text-white">Official Trailer</h2>
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-700/50">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                      title={trailer.name || "Movie Trailer"}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* All Videos Section */}
            {videos?.results && videos.results.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                  <Video className="w-6 h-6 text-white-400" />
                  <h2 className="text-2xl font-bold text-white">Videos & Clips</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.results.slice(0, 6).map((video: Video) => (
                    <div 
                      key={video.id} 
                      className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
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
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cast Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <Users className="w-6 h-6 text-white-400" />
                <h2 className="text-2xl font-bold text-white">Top Cast</h2>
              </div>
              
              {topCast.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {topCast.map((person: CastMember) => (
                    <div
                      key={person.id}
                      className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                    >
                      <div className="w-20 h-20 mx-auto mb-3 relative rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-400 transition-colors">
                        <Image
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : "/no-avatar.jpg"
                          }
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2">{person.character}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                  <p className="text-gray-500 text-lg">No cast information available.</p>
                </div>
              )}
            </section>

            {/* Similar Movies Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <Film className="w-6 h-6 text-white-400" />
                <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
              </div>
              
              {similar.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {similar.map((similarMovie: SimilarMovie) => (
                    <Link
                      key={similarMovie.id}
                      href={`/movie/${similarMovie.id}`}
                      className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
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
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-cyan-300 transition-colors">
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                  <p className="text-gray-500 text-lg">No similar movies found.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-6">
        <div className="text-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Movie Not Found</h1>
          <p className="text-gray-400 text-lg">
            We couldn't find details for this title. Please try another one.
          </p>
        </div>
      </main>
    );
  }
}