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
      className="group block rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full">
        <img
          src={img}
          alt={title || name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
            {title || name}
          </h3>
        </div>
      </div>
    </Link>
  );
}