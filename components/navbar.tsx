"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const navItems = ["Work", "Skills", "About", "Contact"] as const;

type NavbarProps = {
  isScrolled: boolean;
  onMenuOpenChange?: (open: boolean) => void;
};

export function Navbar({ isScrolled, onMenuOpenChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  });

  useEffect(() => {
    onMenuOpenChange?.(isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, onMenuOpenChange]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 lg:px-32 py-6 flex items-center justify-between",
          isScrolled ? "nav-scrolled py-4" : "bg-transparent",
        )}
      >
        <a href="#top" aria-label={`${siteConfig.brand} home`}>
          <Logo />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[14px] font-medium text-muted hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <a
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-border-subtle rounded-full text-xs font-bold hover:bg-foreground hover:text-background transition-all"
          >
            RESUME
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            className="text-foreground p-2"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 bg-background z-[60] flex flex-col items-center justify-center transition-transform duration-500 md:hidden",
          isMenuOpen ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="absolute top-6 right-6 text-foreground p-2"
          onClick={closeMenu}
          aria-label="Close Menu"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-4xl font-bold text-foreground tracking-tight"
              onClick={closeMenu}
            >
              {item}
            </a>
          ))}
          <a
            href={siteConfig.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-8 py-3 border border-border-subtle rounded-full text-sm font-bold"
            onClick={closeMenu}
          >
            Resume
          </a>
        </div>
      </div>
    </>
  );
}
