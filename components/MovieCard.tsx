"use client";

import Link from "next/link";

interface MovieCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  type?: "movie" | "tv"; 
}

export default function MovieCard({ id, title, name, poster_path, type = "movie" }: MovieCardProps) {
  const img = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "/no-image.jpg";

  return (
    <Link
      href={`/${type}/${id}`}
      className="block rounded-lg overflow-hidden hover:scale-105 transition"
    >
      <img src={img} alt={title || name} className="w-full h-96 object-cover" />
      <h3 className="p-2 text-center text-white font-semibold">{title || name}</h3>
    </Link>
  );
}