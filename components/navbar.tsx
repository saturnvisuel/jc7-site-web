"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-900">
            JC7
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Le Club
            </Link>
            <Link href="#categories" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Catégories
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-full">
              <Link href="/inscription">
                S'inscrire
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="#about"
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Le Club
              </Link>
              <Link
                href="#categories"
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link
                href="#contact"
                className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-full w-full">
                <Link href="/inscription" onClick={() => setMobileMenuOpen(false)}>
                  S'inscrire
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
