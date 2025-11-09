"use client";

import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string;
}

export default function MovieCard({ id, title, poster_path }: MovieCardProps) {
  const img = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/no-image.jpg";

  return (
    <Link
      href={`/movie/${id}`}
      className="block bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition"
    >
      <img src={img} alt={title} className="w-full h-96 object-cover" />
      <h3 className="p-2 text-center text-white font-semibold">{title}</h3>
    </Link>
  );
}