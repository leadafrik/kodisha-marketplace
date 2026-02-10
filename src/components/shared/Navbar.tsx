'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, MapPin } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

const Navbar: FC<NavbarProps> = ({ isAuthenticated = false, userName = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Browse', href: '/browse' },
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Contact', href: '#contact' },
  ];

  const authLinks = isAuthenticated ? (
    <>
      <Link
        href="/host/dashboard"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        {userName}
      </Link>
      <Link
        href="/api/auth/logout"
        className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
      >
        Logout
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-2xl text-blue-600"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">K</span>
            </div>
            <span className="hidden sm:inline">Kodisha</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth Links */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <Search size={20} />
            </button>
            {authLinks}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2 border-t border-gray-200">
              {authLinks}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
