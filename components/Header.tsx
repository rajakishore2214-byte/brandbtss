"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, TrendingUp, Home, Cpu, Zap, Shirt, Briefcase } from "lucide-react";
import Logo from "@/components/Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on path change helper
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { label: "Home & Kitchen", href: "/roundup/best-home-kitchen-amazon", icon: Home },
    { label: "Smart Home", href: "/roundup/best-smart-home-appliances", icon: Zap },
    { label: "Electronics", href: "/roundup/best-electronics-gadgets-amazon", icon: Cpu },
    { label: "Clothing", href: "/roundup/best-clothing-accessories-amazon", icon: Shirt },
    { label: "Freelancer Tools", href: "/roundup/best-pm-tools", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 text-slate-800 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" light={true} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
                      isActive 
                        ? "text-primary border-primary" 
                        : "border-transparent text-slate-500 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-80" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Highlighted CTA */}
            <Link
              href="/roundup/best-electronics-gadgets-amazon"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover hover:shadow-md hover:shadow-primary/10 active:scale-95 transition-all"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Top Amazon Picks
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-md animate-in slide-in-from-top duration-300 text-slate-800">
          <nav className="flex flex-col gap-4 text-sm font-bold text-slate-600">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={handleLinkClick} 
                  className={`flex items-center gap-2 py-1.5 ${
                    pathname === link.href ? "text-primary" : "hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/roundup/best-electronics-gadgets-amazon"
              onClick={handleLinkClick}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-primary-hover"
            >
              Top Amazon Picks
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
