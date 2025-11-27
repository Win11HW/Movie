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

  // Genre data with correct IDs
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
    ]
  };

  // Simple reliable dropdown - FIXED: Using number instead of NodeJS.Timeout
  const SimpleDropdown = ({ title, items }: { title: string; items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null); // FIXED: Use number for browser timeout

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setIsOpen(true);
    };

    const handleMouseLeave = () => {
      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 150);
    };

    return (
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="flex items-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer px-3 py-2"
        >
          {title}
          <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-2 gap-1 p-2">
              {items.map((genre) => (
                <Link
                  key={genre.name}
                  href={genre.href}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
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

  // CSS-only dropdown (alternative that doesn't need timeouts)
  const CSSDropdown = ({ title, items }: { title: string; items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          className="flex items-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer px-3 py-2"
        >
          {title}
          <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="grid grid-cols-2 gap-1 p-2">
              {items.map((genre) => (
                <Link
                  key={genre.name}
                  href={genre.href}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
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

  // Mobile Dropdown Section Component
  const MobileDropdownSection = ({ title, items }: { title: string; items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-l-2 border-white/20 pl-4">
        <button
          className="flex items-center justify-between w-full text-white/90 text-left py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium">{title}</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isOpen && (
          <div className="mt-2 space-y-2">
            {items.map((genre) => (
              <Link
                key={genre.name}
                href={genre.href}
                className="block text-white/70 hover:text-white transition-colors duration-200 py-1 text-sm"
                onClick={handleMobileLinkClick}
              >
                {genre.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold">
          <Link href="/" className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent cursor-pointer">
            🎬 Movielify
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer px-3 py-2">
            Home
          </Link>

          {/* Use CSSDropdown for better reliability - no timeout issues */}
          <CSSDropdown title="Action" items={genreCategories.action} />
          <CSSDropdown title="Drama" items={genreCategories.drama} />
          <CSSDropdown title="Fantasy" items={genreCategories.fantasy} />

          <Link href="/category/trending-now" className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer px-3 py-2">
            Trending
          </Link>
        </div>

        {/* Search + Hamburger */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white/80 hover:text-white md:hidden transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900/95 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            {/* Search Bar - Visible in mobile menu */}
            <div className="pb-2">
              <SearchBar />
            </div>

            {/* Simple Mobile Links */}
            <Link
              href="/"
              className="block text-white/90 hover:text-white transition-colors duration-200 py-2 font-medium"
              onClick={handleMobileLinkClick}
            >
              Home
            </Link>

            <Link
              href="/category/trending-now"
              className="block text-white/90 hover:text-white transition-colors duration-200 py-2 font-medium"
              onClick={handleMobileLinkClick}
            >
              Trending
            </Link>

            {/* Collapsible Genre Sections */}
            <MobileDropdownSection title="Action Genres" items={genreCategories.action} />
            <MobileDropdownSection title="Drama Genres" items={genreCategories.drama} />
            <MobileDropdownSection title="Fantasy Genres" items={genreCategories.fantasy} />
          </div>
        </div>
      )}
    </nav>
  );
}