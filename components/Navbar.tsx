"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  return (
    <nav className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800 px-6 py-4 rounded-md mb-6 gap-4 md:gap-0">
      {/* Logo + Links */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="text-2xl font-bold text-white">
          🎬 Movie DB
        </Link>

        <div className="flex gap-4 md:ml-6">
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
      </div>

      {/* SearchBar inside Navbar */}
      <div className="flex justify-center md:justify-end w-full md:w-auto bg-transparent">
        <SearchBar onSearch={onSearch} />
      </div>
    </nav>
  );
}
