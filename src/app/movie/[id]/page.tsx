import { getMovieDetails } from "@/lib/tmdb";

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);
  const img = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.jpg";

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <img src={img} alt={movie.title} className="w-72 rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="max-w-2xl text-center text-gray-300">{movie.overview}</p>
      <p className="mt-4 text-gray-400">
        ⭐ {movie.vote_average} | 📅 {movie.release_date}
      </p>
    </main>
  );
}
