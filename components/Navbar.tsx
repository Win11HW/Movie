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
    <nav className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/#home" className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            🎬 Movielify
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/#home" className="text-white/80 hover:text-white transition-colors duration-200">
            Home
          </Link>
          <Link href="/#movies" className="text-white/80 hover:text-white transition-colors duration-200">
            Movies
          </Link>
          <Link href="/#trending" className="text-white/80 hover:text-white transition-colors duration-200">
            Trending
          </Link>
          <Link href="/#tv" className="text-white/80 hover:text-white transition-colors duration-200">
            TV
          </Link>
        </div>

        {/* Search + Hamburger */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white/80 hover:text-white md:hidden transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden ">
          {/* Links in one row */}
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-row justify-center space-x-6">
            <Link
              href="/#home"
              className="text-white/90 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#movies"
              className="text-white/90 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              href="/#trending"
              className="text-white/90 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Trending
            </Link>
            <Link
              href="/#tv"
              className="text-white/90 hover:text-white transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              TV
            </Link>
          </div>

          {/* Search visible in mobile dropdown */}
          <div className="max-w-7xl mx-auto w-full px-6 pb-4">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      )}
    </nav>
  );
}