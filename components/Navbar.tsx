"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const genreCategories = {
    action: [
      { name: "Action", href: "/category/28" },
      { name: "Adventure", href: "/category/12" },
      { name: "Thriller", href: "/category/53" },
      { name: "Crime", href: "/category/80" },
      { name: "War", href: "/category/10752" },
      { name: "Western", href: "/category/37" },
    ],
    drama: [
      { name: "Drama", href: "/category/18" },
      { name: "Romance", href: "/category/10749" },
      { name: "History", href: "/category/36" },
      { name: "Family", href: "/category/10751" },
      { name: "TV Movie", href: "/category/10770" },
    ],
    fantasy: [
      { name: "Fantasy", href: "/category/14" },
      { name: "Science Fiction", href: "/category/878" },
      { name: "Horror", href: "/category/27" },
      { name: "Mystery", href: "/category/9648" },
      { name: "Comedy", href: "/category/35" },
      { name: "Animation", href: "/category/16" },
      { name: "Music", href: "/category/10402" },
      { name: "Documentary", href: "/category/99" },
    ],
  };

  const CSSDropdown = ({ title, items }: { title: string; items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="flex items-center text-white/80 hover:text-white transition px-3 py-2">
          {title}
          <ChevronDown size={16} className={`ml-1 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-900/80 border border-white/10 rounded-lg shadow-lg z-50">
            <div className="grid grid-cols-2 gap-1 p-2">
              {items.map((genre) => (
                <Link
                  key={genre.name}
                  href={genre.href}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-gray-800 rounded-md transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobileDropdownSection = ({ title, items }: { title: string; items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-t border-white/10 pt-3">
        <button
          className="flex items-center justify-between w-full py-3 text-white/80 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium text-base tracking-wide">{title}</span>
          <ChevronDown
            size={18}
            className={`text-white/80 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-4 pb-3 space-y-2">
            {items.map((genre) => (
              <Link
                key={genre.name}
                href={genre.href}
                onClick={handleMobileLinkClick}
                className="block text-white/80 hover:text-white hover:bg-gray-800 transition py-1 rounded-md"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold">
          <Link href="/" className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            🎬 Movielify
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className="text-white/80 hover:text-white transition px-3 py-2">
            Home
          </Link>

          <CSSDropdown title="Action" items={genreCategories.action} />
          <CSSDropdown title="Drama" items={genreCategories.drama} />
          <CSSDropdown title="Fantasy" items={genreCategories.fantasy} />

          <Link
            href="/category/trending-now"
            className="text-white/80 hover:text-white transition px-3 py-2"
          >
            Trending
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          <button
            className="text-white/80 hover:text-white md:hidden transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-900/80 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            <div className="pb-2">
              <SearchBar />
            </div>

            <Link
              href="/"
              className="block text-white/80 hover:text-white hover:bg-gray-800 transition py-2 rounded-md font-medium"
              onClick={handleMobileLinkClick}
            >
              Home
            </Link>

            <Link
              href="/category/trending-now"
              className="block text-white/80 hover:text-white hover:bg-gray-800 transition py-2 rounded-md font-medium"
              onClick={handleMobileLinkClick}
            >
              Trending
            </Link>

            <MobileDropdownSection title="Action Genres" items={genreCategories.action} />
            <MobileDropdownSection title="Drama Genres" items={genreCategories.drama} />
            <MobileDropdownSection title="Fantasy Genres" items={genreCategories.fantasy} />
          </div>
        </div>
      )}
    </nav>
  );
}
