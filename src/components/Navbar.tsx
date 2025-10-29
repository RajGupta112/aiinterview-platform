"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // ✅ Scroll tracking for active nav item + sticky effect
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 50);

    const sections = navLinks.map((n) => n.href.replace("#", ""));
    for (const sec of sections) {
      const el = document.getElementById(sec);
      if (el) {
        const top = el.offsetTop - 150;
        const bottom = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          setActive(sec);
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#00C853] to-[#00813E] bg-clip-text text-transparent select-none"
        >
          AIVue
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`transition-colors text-[15px] font-medium ${
                active === href.replace("#", "")
                  ? "text-[#00C853]"
                  : "text-gray-800 hover:text-[#00C853]"
              }`}
            >
              {label}
            </a>
          ))}

          {/* ✅ Sign In Button (desktop) */}
          <Button
            onClick={() => router.push("/auth/sign-in")}
            className="bg-[#00C853] hover:bg-[#00813E] text-white rounded-full px-5"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="md:hidden text-gray-800 hover:text-[#00C853] transition-colors"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-md px-6 py-4 space-y-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block text-lg font-medium ${
                active === href.replace("#", "")
                  ? "text-[#00C853]"
                  : "text-gray-800 hover:text-[#00C853]"
              }`}
            >
              {label}
            </a>
          ))}

          {/* ✅ Mobile Sign In Button */}
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/auth/sign-in");
            }}
            className="w-full bg-[#00C853] hover:bg-[#00813E] text-white rounded-full"
          >
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
