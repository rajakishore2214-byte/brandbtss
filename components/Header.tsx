"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils";
import Logo from "@/components/Logo";

// Types matching DB output for client search
interface SearchProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  affiliateUrl: string;
}

interface SearchArticle {
  slug: string;
  type: "best" | "review" | "blog";
  title: string;
  description: string;
  productIds?: string[];
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    products: SearchProduct[];
    articles: SearchArticle[];
  }>({ products: [], articles: [] });

  const pathname = usePathname();

  // Close menus on path change
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  // Live search calculation with API fetch, debounce, and AbortController
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ products: [], articles: [] });
      return;
    }

    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setSearchResults({
              products: data.products || [],
              articles: data.articles || [],
            });
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Search query failed:", err);
          }
        });
    }, 150);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Deals", href: "/deals" },
    { label: "Best Products", href: "/best-products/best-air-fryers-under-5000" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  const categoriesList = [
    { name: "Home & Kitchen", slug: "home-kitchen" },
    { name: "Gadgets & Electronics", slug: "gadgets" },
    { name: "Home Decor", slug: "home-decor" },
    { name: "Lifestyle & Fitness", slug: "lifestyle" }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-slate-900/90 text-white backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <Logo variant="horizontal" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
                <Link href="/" className={`hover:text-primary transition-colors ${pathname === "/" ? "text-white font-semibold" : ""}`}>
                  Home
                </Link>
                {/* Categories Dropdown */}
                <div className="relative group py-2">
                  <span className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                    Categories
                  </span>
                  <div className="absolute top-full left-0 hidden w-48 rounded-lg border border-slate-700 bg-slate-900 py-2 shadow-xl group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    {categoriesList.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:text-primary transition-colors ${pathname === link.href ? "text-white font-semibold" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Search site"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* CTA Sign-up Button in Navbar */}
              <Link
                href="/deals"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-text hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Latest Deals
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-6 shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-4 text-base font-semibold text-slate-200">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <div className="border-l-2 border-slate-700 pl-4 py-1 flex flex-col gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Categories</span>
                {categoriesList.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-sm hover:text-primary">
                    {cat.name}
                  </Link>
                ))}
              </div>
              {navLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              ))}
              <Link
                href="/deals"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-text hover:bg-primary-hover"
              >
                Get Hot Deals
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Interactive Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 text-white">
            <h2 className="text-lg font-bold">Search Recommendations</h2>
            <button
              onClick={() => setSearchOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Search className="absolute top-4 left-4 h-6 w-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, running shoes, retro watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-4 pl-12 pr-4 text-lg text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xl"
                  autoFocus
                />
              </div>

              {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                <p className="mt-4 text-sm text-slate-400 text-center">Type at least 2 characters to search...</p>
              )}

              {searchQuery.trim().length >= 2 && (
                <div className="mt-8 space-y-8">
                  {/* Matching Guides/Articles */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <span>Articles & Guides</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-primary">
                        {searchResults.articles.length}
                      </span>
                    </h3>
                    {searchResults.articles.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No matching guides found.</p>
                    ) : (
                      <div className="grid gap-3">
                        {searchResults.articles.map((art) => (
                          <Link
                            key={art.slug}
                            href={art.type === "best" ? `/best-products/${art.slug}` : `/reviews/${art.productIds?.[0]}-review`}
                            className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-primary/50 hover:bg-slate-900/60 transition-all"
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                                {art.type === "best" ? "Buying Guide" : "Product Review"}
                              </span>
                              <h4 className="font-semibold text-white group-hover:text-primary transition-colors">
                                {art.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{art.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Matching Products */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <span>Products & Pricing</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-primary">
                        {searchResults.products.length}
                      </span>
                    </h3>
                    {searchResults.products.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No matching products found.</p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {searchResults.products.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-16 w-16 rounded-lg object-cover bg-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-white truncate">{p.name}</h4>
                              <p className="text-xs text-slate-400">{p.brand}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-bold text-primary">{formatINR(p.price)}</span>
                                <a
                                  href={p.affiliateUrl}
                                  target="_blank"
                                  rel="sponsored nofollow"
                                  className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                  Buy Link <ArrowRight className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {searchQuery.trim().length === 0 && (
                <div className="mt-12">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-6">
                    Popular searches right now
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {["Running Shoes under 5000", "Casio Vintage", "Seiko Diver", "Travel Backpack", "Lip Mask"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
