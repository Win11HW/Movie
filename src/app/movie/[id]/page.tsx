import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieVideos } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

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

    // Get top 10 cast members
    const topCast = (credits?.cast?.slice(0, 10) || []) as CastMember[];
    
    // Get similar movies (up to 6)
    const similar = (similarMovies?.results?.slice(0, 6) || []) as SimilarMovie[];

    // Get trailer video (first YouTube trailer found)
    const trailer = (videos?.results || []).find(
      (video: Video) => video.site === "YouTube" && video.type === "Trailer"
    );

    return (
      <main className="min-h-screen bg-gray-900 text-white p-6">
        {/* Movie Header */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 mb-12">
          {/* Poster */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <div className="w-72 h-auto relative">
              <Image
                src={imageUrl}
                alt={movieDetails.title || movieDetails.name || "No title"}
                width={500}
                height={750}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-4">
              {movieDetails.title || movieDetails.name || "Untitled"}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-300 px-3 py-1 rounded-full font-semibold">
                ⭐ {movieDetails.vote_average?.toFixed(1) ?? "N/A"}
              </span>
              <span className="text-gray-300">
                📅 {movieDetails.release_date || movieDetails.first_air_date || "Unknown"}
              </span>
              {movieDetails.runtime && (
                <span className="text-gray-300">
                  ⏱️ {movieDetails.runtime} min
                </span>
              )}
            </div>

            {movieDetails.genres && movieDetails.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movieDetails.genres.map((genre: Genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movieDetails.overview ? (
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {movieDetails.overview}
              </p>
            ) : (
              <p className="text-lg text-gray-500 italic mb-6">
                No overview available.
              </p>
            )}
          </div>
        </div>

        {/* Video Trailer Section */}
        {trailer && (
          <section className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              🎬 Official Trailer
            </h2>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name || "Movie Trailer"}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </section>
        )}

        {/* All Videos Section (if multiple videos available) */}
        {videos?.results && videos.results.length > 0 && (
          <section className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              🎥 Videos & Clips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.results.slice(0, 6).map((video: Video) => (
                <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {video.name}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="capitalize">{video.type}</span>
                      <span>{video.site}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast Section */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
            Top Cast
          </h2>
          {topCast.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {topCast.map((person: CastMember) => (
                <div
                  key={person.id}
                  className="bg-gray-800 rounded-lg p-4 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-3 relative rounded-full overflow-hidden">
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
                  <h3 className="font-semibold text-sm mb-1">{person.name}</h3>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No cast information available.</p>
          )}
        </section>

        {/* Similar Movies Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
            Similar Movies
          </h2>
          {similar.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {similar.map((similarMovie: SimilarMovie) => (
                <Link
                  key={similarMovie.id}
                  href={`/movie/${similarMovie.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={
                        similarMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                          : "/no-image.jpg"
                      }
                      alt={similarMovie.title || similarMovie.name || "No title"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {similarMovie.title || similarMovie.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-xs">
                        ⭐ {similarMovie.vote_average?.toFixed(1) || "N/A"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {similarMovie.release_date?.substring(0, 4) || "TBA"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No similar movies found.</p>
          )}
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">❌ Movie Not Found</h1>
          <p className="text-gray-400">
            We couldn't find details for this title. Please try another one.
          </p>
        </div>
      </main>
    );
  }
}