'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation: Array<{ name: string; href: string }> = [
    // Navigation items removed as separate pages have been consolidated
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-black/10 sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/Flinlogo.png"
                alt="Flin Logo"
                width={80}
                height={80}
                className=""
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {navigation.length > 0 && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-black/70 hover:text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-black/5 hover-lift"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Login Button */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link
                href="/vendor/login"
                className="text-black/70 hover:text-black px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-black/5"
              >
                Vendor Login
              </Link>
              <Link
                href="/vendor/signup"
                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black/80 transition-all duration-300 hover-lift animate-glow"
              >
                Vendor Signup
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black/20 transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-black/10 glass-effect">
            {navigation.length > 0 && (
              <>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-black/70 hover:text-black block px-4 py-3 rounded-lg text-base font-medium hover:bg-black/5 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-black/10 pt-4">
                  <Link
                    href="/vendor/login"
                    className="text-black/70 hover:text-black block px-4 py-3 rounded-lg text-base font-medium hover:bg-black/5 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendor Login
                  </Link>
                  <Link
                    href="/vendor/signup"
                    className="bg-black text-white block px-4 py-3 rounded-lg text-base font-medium hover:bg-black/80 mx-3 mt-2 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendor Signup
                  </Link>
                </div>
              </>
            )}
            {navigation.length === 0 && (
              <>
                <Link
                  href="/vendor/login"
                  className="text-black/70 hover:text-black block px-4 py-3 rounded-lg text-base font-medium hover:bg-black/5 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vendor Login
                </Link>
                <Link
                  href="/vendor/signup"
                  className="bg-black text-white block px-4 py-3 rounded-lg text-base font-medium hover:bg-black/80 mx-3 mt-2 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vendor Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
