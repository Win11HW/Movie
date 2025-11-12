"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 px-6 py-4 w-full">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link href="/">🎬 Movie DB</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-blue-400 text-white">
            Home
          </Link>
          <Link href="/Movies" className="hover:text-blue-400 text-white">
            Movies
          </Link>
          <Link href="/Trending" className="hover:text-blue-400 text-white">
            Trending
          </Link>
          <Link href="/TV" className="hover:text-blue-400 text-white">
            TV
          </Link>
        </div>

        {/* Search + Hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="flex flex-col items-center mt-4 md:hidden animate-fadeIn">
          {/* Links in one row */}
          <div className="flex flex-row justify-center gap-6 mb-4">
            <Link
              href="/"
              className="hover:text-blue-400 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/Movies"
              className="hover:text-blue-400 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              href="/Trending"
              className="hover:text-blue-400 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Trending
            </Link>
            <Link
              href="/TV"
              className="hover:text-blue-400 text-white"
              onClick={() => setMenuOpen(false)}
            >
              TV
            </Link>
          </div>

          {/* Search visible in mobile dropdown */}
          <div className="w-full px-4">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      )}
    </nav>
  );
}
