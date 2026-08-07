"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Navbar } from "@/components/navbar";

gsap.registerPlugin(ScrollTrigger);

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current || reducedMotion) return;
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (!cursorRef.current || reducedMotion) return;
      if ((e.target as Element | null)?.closest?.("a, button, [data-cursor-hover]")) {
        cursorRef.current.classList.add("cursor-hover");
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (!cursorRef.current || reducedMotion) return;
      const related = e.relatedTarget as Element | null;
      if (!related?.closest?.("a, button, [data-cursor-hover]")) {
        cursorRef.current.classList.remove("cursor-hover");
      }
    };

    let rafId = 0;
    let ctx: gsap.Context | null = null;
    let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const setupMotion = () => {
      ctx?.revert();
      ctx = null;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (reducedMotion) {
        document.documentElement.classList.remove("lenis", "lenis-smooth");
        gsap.set(
          [
            ".hero-brand",
            ".hero-headline",
            ".hero-subtext",
            ".hero-ctas",
            ".project-row",
            ".skill-card",
          ],
          { clearProps: "all" },
        );
        return;
      }

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      lenis.on("scroll", (e: { scroll: number }) => {
        ScrollTrigger.update();
        setIsScrolled(e.scroll > 60);

        if (progressBarRef.current) {
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? (e.scroll / maxScroll) * 100 : 0;
          progressBarRef.current.style.width = `${progress}%`;
        }
      });

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from(".hero-brand", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.2,
        })
          .from(
            ".hero-headline",
            {
              y: 60,
              opacity: 0,
              duration: 0.8,
              ease: "power4.out",
            },
            "-=0.3",
          )
          .from(
            ".hero-subtext",
            {
              opacity: 0,
              y: 20,
              duration: 0.6,
            },
            "-=0.4",
          )
          .from(
            ".hero-ctas",
            {
              opacity: 0,
              y: 20,
              duration: 0.6,
            },
            "-=0.4",
          );

        gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
          gsap.from(row, {
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        });

        const cards = gsap.utils.toArray<HTMLElement>(".skill-card");
        if (cards.length > 0) {
          gsap.set(cards, { y: 40, opacity: 0 });
          gsap.to(cards, {
            scrollTrigger: {
              trigger: "#skills",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            overwrite: "auto",
          });
        }

        refreshTimeoutId = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);
      }, container);
    };

    setupMotion();

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      setupMotion();
    };

    motionQuery.addEventListener("change", onMotionChange);
    window.addEventListener("mousemove", moveCursor);
    container.addEventListener("pointerover", handlePointerOver);
    container.addEventListener("pointerout", handlePointerOut);

    const onNativeScroll = () => {
      if (!reducedMotion) return;
      setIsScrolled(window.scrollY > 60);
      if (progressBarRef.current) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", onNativeScroll);
      container.removeEventListener("pointerover", handlePointerOver);
      container.removeEventListener("pointerout", handlePointerOut);
      if (rafId) cancelAnimationFrame(rafId);
      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      ctx?.revert();
    };
  }, []);

  const handleMenuOpenChange = (open: boolean) => {
    if (open) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  };

  return (
    <div ref={containerRef} id="top" className="relative min-h-screen">
      <div
        ref={cursorRef}
        className="custom-cursor hidden lg:block motion-reduce:hidden"
        aria-hidden="true"
      />

      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-[2px] bg-accent z-[100]"
        style={{ width: "0%" }}
        aria-hidden="true"
      />

      <Navbar
        isScrolled={isScrolled}
        onMenuOpenChange={handleMenuOpenChange}
      />

      {children}
    </div>
  );
}
