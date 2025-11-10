"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-gray-800 px-8 py-4 gap-4 md:gap-0 rounded-none w-full">
      {/* Logo on the left */}
      <div className="text-2xl font-bold text-white">
        <Link href="/">🎬 Movie DB</Link>
      </div>

      {/* Centered Links */}
      <div className="flex gap-8 mx-auto">
        <Link href="/" className="hover:text-blue-400 text-white">
          Home
        </Link>
        <Link href="/about" className="hover:text-blue-400 text-white">
          About
        </Link>
        <Link href="/contact" className="hover:text-blue-400 text-white">
          Contact
        </Link>
      </div>

      {/* SearchBar on the right */}
      <div className="flex justify-end w-full md:w-auto">
        <SearchBar onSearch={onSearch} />
      </div>
    </nav>
  );
}
