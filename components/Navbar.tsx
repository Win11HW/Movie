"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() { // Remove onSearch prop
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCategoryClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/" className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent cursor-pointer">
            🎬 Movielify
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
            Home
          </Link>
          <Link 
            href="/category/trending-movies" 
            className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Movies
          </Link>
          <Link 
            href="/category/trending" 
            className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Trending
          </Link>
          <Link 
            href="/category/trending-tv" 
            className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            TV Shows
          </Link>
        </div>

        {/* Search + Hamburger */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <SearchBar /> {/* Remove onSearch prop */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white/80 hover:text-white md:hidden transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <>
          {/* Links in one row */}
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row justify-center space-x-6">
            <Link
              href="/"
              className="text-white/90 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={handleCategoryClick}
            >
              Home
            </Link>
            <Link
              href="/category/trending-movies"
              className="text-white/90 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={handleCategoryClick}
            >
              Movies
            </Link>
            <Link
              href="/category/trending"
              className="text-white/90 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={handleCategoryClick}
            >
              Trending
            </Link>
            <Link
              href="/category/trending-tv"
              className="text-white/90 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={handleCategoryClick}
            >
              TV Shows
            </Link>
          </div>

          {/* Search visible in mobile dropdown */}
          <div className="max-w-7xl mx-auto w-full px-6 pb-4">
            <SearchBar /> 
          </div>
        </>
      )}
    </nav>
  );
}