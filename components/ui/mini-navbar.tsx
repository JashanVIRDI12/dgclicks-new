"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/brand-logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "AI Solutions", href: "/ai" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    /* Full-width fixed rail; flexbox does the centering, so no transform
       tricks that can be overridden and push the bar off screen. */
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5">
      <div
        className={`pointer-events-auto w-full max-w-3xl overflow-hidden border backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
          isOpen ? "rounded-[28px]" : "rounded-full"
        } ${
          scrolled || isOpen
            ? "border-white/15 bg-[#0b0e14]/70 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]"
            : "border-white/10 bg-[#0b0e14]/40"
        }`}
      >
        {/* hairline sheen — the one bit of "glass" detail, kept understated */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div className="relative flex h-14 items-center justify-between pl-4 pr-2 sm:pl-5 sm:pr-2.5">
          {/* Brand */}
          <Link href="/" aria-label="Digi Clicks — home" onClick={closeMenu} className="shrink-0">
            <BrandLogo priority className="h-9 sm:h-11 brightness-0 invert" />
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + burger */}
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b0e14] transition-opacity duration-200 hover:opacity-90 sm:inline-flex"
            >
              Get in touch
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="nav-mobile"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="nav-mobile"
          className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <nav
              className="flex flex-col gap-1 border-t border-white/10 px-3 pb-4 pt-2"
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-[15px] transition-colors ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={closeMenu}
                className="mt-2 rounded-full bg-white px-4 py-3 text-center text-sm font-medium text-[#0b0e14]"
              >
                Get in touch
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
