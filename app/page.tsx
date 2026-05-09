"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Github,
  Linkedin,
  Menu,
  X,
  Sun,
  Moon,
  Send,
  CheckCircle2,
  ExternalLink,
  Instagram,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2.5 group select-none", className)}>
    <div className="relative flex items-center justify-center w-6 h-6">
      {/* North Star Mark */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full text-accent transition-transform duration-700 ease-out group-hover:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
          fill="currentColor"
        />
        <circle
          cx="12"
          cy="11"
          r="1"
          fill="var(--background)"
          className="opacity-80"
        />
      </svg>
    </div>
    <span className="font-logo text-xl font-medium tracking-tighter text-foreground flex items-center">
      sodhruv<span className="text-accent ml-0.5">.</span>
    </span>
  </div>
);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Animate theme transition
    gsap.to("body", {
      backgroundColor: newTheme === "dark" ? "#0A0A0A" : "#F9F9F7",
      duration: 0.5,
      ease: "power2.inOut",
    });

    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", (e: { scroll: number }) => {
      ScrollTrigger.update();
      setIsScrolled(e.scroll > 60);

      // Update progress bar
      if (progressBarRef.current) {
        const progress =
          (e.scroll /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Custom Cursor
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", moveCursor);

    // Hero Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-badge", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.3,
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
        )
        .from(
          ".hero-pills",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4",
        );

      // Project Rows Animation
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

      // Skill Cards Animation
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

      // Refresh ScrollTrigger after a short delay to ensure layout is ready
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const handleCursorHover = (isHovering: boolean) => {
    if (cursorRef.current) {
      if (isHovering) {
        cursorRef.current.classList.add("cursor-hover");
      } else {
        cursorRef.current.classList.remove("cursor-hover");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      setFormStatus("error");
    } finally {
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const projects = [
    {
      id: "01",
      title: "Atelier",
      desc: "AI outfit suggestions based on weather, occasion & cost-per-wear expense tracking.",
      stack: "Flutter · Gemini API · Supabase · Node.js",
      link: "https://github.com/sodhruv28/warddrob",
      external: "https://warddrob.vercel.app",
    },
    {
      id: "02",
      title: "The Secret Diary Of US",
      desc: "A private digital sanctuary for couples to share memories, track moods, and preserve intimate moments securely with AI insights.",
      stack: "Flutter · Gemini API · MongoDB · Node.js",
      link: "https://github.com/sodhruv28/MINE",
      external: "https://thesecretdiaryofus.in/",
    },
    {
      id: "03",
      title: "AI Resume Scanner",
      desc: "Parses resumes against JDs, ranks candidates with AI match scores.",
      stack: "React · Node.js · Gemini API · MongoDB",
      link: "https://github.com/sodhruv28/AI-Resume-Analyzer",
      external: "#",
    },
    {
      id: "04",
      title: "QR Restaurant System",
      desc: "QR-based ordering, live order tracking, admin dashboard and Stripe payments.",
      stack: "Next.js · Socket.IO · Stripe · MongoDB",
      link: "https://github.com/sodhruv28/MENU-app",
      external: "https://menu-app-sandy-seven.vercel.app",
    },
    {
      id: "05",
      title: "Chat & Video App",
      desc: "One-to-one chat with read receipts, typing indicators, and WebRTC video calling.",
      stack: "MERN · Socket.IO · WebRTC · Firebase",
      link: "https://github.com/sodhruv28/chatting",
      external: "https://chattingvc.netlify.app",
    },
    {
      id: "06",
      title: "Siksha",
      desc: "Secure SaaS learning platform with course purchases and JWT authentication.",
      stack: "React · Node.js · Express · MongoDB Atlas",
      link: "https://github.com/sodhruv28/shiksha-main",
      external: "https://shikshaaa.netlify.app",
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor hidden lg:block" />

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-[2px] bg-accent z-[100] transition-all duration-100"
        style={{ width: "0%" }}
      />

      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 lg:px-32 py-6 flex items-center justify-between",
          isScrolled ? "nav-scrolled py-4" : "bg-transparent",
        )}
      >
        <a
          href="#"
          onMouseEnter={() => handleCursorHover(true)}
          onMouseLeave={() => handleCursorHover(false)}
        >
          <Logo />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {["Work", "Skills", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[14px] font-medium text-muted hover:text-foreground transition-colors"
              onMouseEnter={() => handleCursorHover(true)}
              onMouseLeave={() => handleCursorHover(false)}
            >
              {item}
            </a>
          ))}

          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground transition-colors"
            onMouseEnter={() => handleCursorHover(true)}
            onMouseLeave={() => handleCursorHover(false)}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            className="px-6 py-2 border border-border-subtle rounded-full text-xs font-bold hover:bg-foreground hover:text-background transition-all"
            onMouseEnter={() => handleCursorHover(true)}
            onMouseLeave={() => handleCursorHover(false)}
          >
            RESUME
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-[60] flex flex-col items-center justify-center transition-transform duration-500 md:hidden",
          isMenuOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          className="absolute top-6 right-6 text-foreground p-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center gap-8">
          {["Work", "Skills", "About", "Contact"].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-4xl font-bold text-foreground tracking-tight"
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="z-10 flex flex-col items-center">
          <div className="hero-badge px-4 py-1.5 bg-card border border-border-subtle rounded-full mb-8">
            <span className="text-[13px] font-medium text-muted tracking-wide">
              Open to Work · Surat, India
            </span>
          </div>

          <h1 className="hero-headline font-bold text-foreground mb-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95]">
            I build products <br className="hidden sm:block" /> that actually{" "}
            <br className="hidden sm:block" />
            work<span className="text-accent">.</span>
          </h1>

          <p className="hero-subtext max-w-[480px] text-lg text-muted mb-12 leading-relaxed">
            Full stack developer crafting AI-integrated apps, real-time systems,
            and mobile experiences. MERN · Next.js · Flutter · Gemini API.
          </p>

          <div className="hero-ctas flex items-center gap-6">
            <a
              href="#work"
              className="px-10 py-4 bg-accent text-white font-bold rounded-full hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-accent/20"
              onMouseEnter={() => handleCursorHover(true)}
              onMouseLeave={() => handleCursorHover(false)}
            >
              See My Work
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 text-foreground font-bold hover:text-accent transition-colors"
              onMouseEnter={() => handleCursorHover(true)}
              onMouseLeave={() => handleCursorHover(false)}
            >
              Get In Touch <ArrowRight size={18} />
            </a>
          </div>

          <div className="hero-pills mt-16 flex flex-wrap justify-center gap-3">
            {[
              "React",
              "Flutter",
              "Node.js",
              "Next.js",
              "Gemini AI",
              "MongoDB",
            ].map((pill) => (
              <span
                key={pill}
                className="px-4 py-1.5 bg-card border border-border-subtle rounded-full text-[12px] text-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="work"
        className="py-24 md:py-40 px-4 md:px-12 lg:px-32 max-w-[1400px] mx-auto overflow-hidden"
      >
        <div className="mb-12 md:mb-20">
          <p className="section-label mb-4">SELECTED WORK</p>
          <h2 className="section-headline text-foreground text-3xl sm:text-4xl md:text-5xl leading-tight">
            Things I&apos;ve Built
          </h2>
        </div>

        <div className="flex flex-col">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-row group flex flex-col md:flex-row items-start md:items-center py-10 border-b border-border-subtle transition-all hover:bg-card-hover md:hover:px-8 md:-mx-8 relative"
            >
              <span className="text-[11px] text-muted mb-4 md:mb-0 md:w-20 font-mono">
                {project.id}
              </span>
              <div className="flex-1 transition-transform md:group-hover:translate-x-[8px]">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight">
                  <a
                    href={project.external}
                    target="_blank"
                    className="hover:text-accent transition-colors flex items-center gap-3 w-fit"
                    onMouseEnter={() => handleCursorHover(true)}
                    onMouseLeave={() => handleCursorHover(false)}
                  >
                    {project.title}
                    <ExternalLink
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"
                    />
                  </a>
                </h3>
                <p className="text-sm text-muted mb-4 max-w-xl">
                  {project.desc}
                </p>
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {project.stack}
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <a
                  href={project.link}
                  target="_blank"
                  className="md:opacity-0 group-hover:opacity-100 transition-all text-accent font-bold flex items-center gap-2 text-sm hover:underline"
                  onMouseEnter={() => handleCursorHover(true)}
                  onMouseLeave={() => handleCursorHover(false)}
                >
                  View GitHub <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-24 md:py-40 px-4 md:px-12 lg:px-32 bg-card/30 relative z-10 overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-20">
            <p className="section-label mb-4">EXPERTISE</p>
            <h2 className="section-headline text-foreground text-3xl sm:text-4xl md:text-5xl leading-tight">
              What I Work With
            </h2>
          </div>

          <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "AI",
                label: "AI & GENAI",
                skills: [
                  "Gemini API",
                  "Prompt Engineering",
                  "LLM Document Parsing",
                  "AI-driven UI",
                ],
              },
              {
                id: "FE",
                label: "FRONTEND",
                skills: [
                  "React.js",
                  "Next.js",
                  "Flutter",
                  "Tailwind CSS",
                  "TypeScript",
                ],
              },
              {
                id: "BE",
                label: "BACKEND",
                skills: [
                  "Node.js",
                  "Express.js",
                  "Socket.IO",
                  "WebRTC",
                  "REST API Design",
                ],
              },
              {
                id: "DB",
                label: "DATA & INFRA",
                skills: [
                  "MongoDB",
                  "Supabase",
                  "MySQL",
                  "Firebase",
                  "Redis",
                  "Render",
                ],
              },
            ].map((cat) => (
              <div
                key={cat.id}
                className="skill-card p-8 bg-card border border-border-subtle rounded-[24px] hover:border-accent/30 transition-all group"
                onMouseEnter={() => handleCursorHover(true)}
                onMouseLeave={() => handleCursorHover(false)}
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-6 text-accent font-bold">
                  {cat.id}
                </div>
                <p className="text-[13px] font-medium text-accent tracking-widest mb-6">
                  {cat.label}
                </p>
                <ul className="space-y-4">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-[15px] text-muted leading-none flex items-center gap-2"
                    >
                      <div className="w-1 h-1 bg-accent/40 rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 md:py-40 px-6 md:px-12 lg:px-32 max-w-[1400px] mx-auto overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <h2 className="font-logo text-4xl sm:text-6xl md:text-[80px] font-medium text-foreground leading-[0.9] mb-6 tracking-tighter">
              sodhruv<span className="text-accent">.</span>
            </h2>
            <div className="w-[2px] h-10 bg-accent ml-2" />
          </div>

          <div className="flex flex-col gap-8 md:gap-10">
            <p className="text-base md:text-[17px] text-muted leading-[1.8] font-normal pt-2">
              I&apos;m a full stack developer based in Surat, India, currently
              pursuing my MCA at VNSGU. I build complete, production-ready
              products — from AI-integrated mobile apps to real-time web
              platforms. When I&apos;m not coding, I&apos;m gaming, watching
              anime, or sketching.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 bg-card border border-border-subtle rounded-lg flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[13px] text-foreground">
                  5 Projects Shipped
                </span>
              </div>
              <div className="px-5 py-3 bg-card border border-border-subtle rounded-lg flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[13px] text-foreground">
                  3 AI Apps Built
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <a
                href="https://github.com/sodhruv28"
                target="_blank"
                className="text-muted hover:text-foreground transition-colors p-2"
                onMouseEnter={() => handleCursorHover(true)}
                onMouseLeave={() => handleCursorHover(false)}
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/dhruv-solanki-sodhruv28"
                target="_blank"
                className="text-muted hover:text-foreground transition-colors p-2"
                onMouseEnter={() => handleCursorHover(true)}
                onMouseLeave={() => handleCursorHover(false)}
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://instagram.com/sodhruv28"
                target="_blank"
                className="text-muted hover:text-foreground transition-colors p-2"
                onMouseEnter={() => handleCursorHover(true)}
                onMouseLeave={() => handleCursorHover(false)}
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 md:py-40 px-6 bg-card/10 relative overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          <div className="flex flex-col">
            <p className="section-label mb-6">GET IN TOUCH</p>
            <h2 className="text-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tighter leading-[1.1]">
              Let&apos;s build <br /> something <br />{" "}
              <span className="text-accent">together.</span>
            </h2>
            <p className="text-lg text-muted mb-12 max-w-md">
              Open to internships, freelance projects, and interesting ideas.
              Drop a message or reach out on social media.
            </p>

            <div className="space-y-6">
              <a
                href="mailto:sodhruv28work@gmail.com"
                className="flex items-center gap-4 text-foreground hover:text-accent transition-colors group"
                onMouseEnter={() => handleCursorHover(true)}
                onMouseLeave={() => handleCursorHover(false)}
              >
                <div className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                  <Send size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-muted uppercase font-mono tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-lg font-medium">sodhruv28work@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-6 pt-4">
                <a
                  href="https://github.com/sodhruv28"
                  target="_blank"
                  className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                  onMouseEnter={() => handleCursorHover(true)}
                  onMouseLeave={() => handleCursorHover(false)}
                >
                  <Github size={20} /> Github
                </a>
                <a
                  href="https://linkedin.com/in/dhruv-solanki-sodhruv28"
                  target="_blank"
                  className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                  onMouseEnter={() => handleCursorHover(true)}
                  onMouseLeave={() => handleCursorHover(false)}
                >
                  <Linkedin size={20} /> Linkedin
                </a>
                <a
                  href="https://instagram.com/sodhruv28"
                  target="_blank"
                  className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
                  onMouseEnter={() => handleCursorHover(true)}
                  onMouseLeave={() => handleCursorHover(false)}
                >
                  <Instagram size={20} /> Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border-subtle p-8 md:p-12 rounded-[32px] relative overflow-hidden">
            {formStatus === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-8 text-accent">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Message Sent!
                </h3>
                <p className="text-muted max-w-xs mx-auto">
                  Thank you for reaching out. I&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold text-muted uppercase tracking-widest ml-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      required
                      placeholder="Your Name"
                      className="w-full bg-background/50 border border-border-subtle rounded-xl px-5 py-4 text-foreground outline-none focus:border-accent transition-all placeholder:text-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold text-muted uppercase tracking-widest ml-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Your Email"
                      className="w-full bg-background/50 border border-border-subtle rounded-xl px-5 py-4 text-foreground outline-none focus:border-accent transition-all placeholder:text-muted/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-xs font-bold text-muted uppercase tracking-widest ml-1"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    required
                    placeholder="Project Inquiry"
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-5 py-4 text-foreground outline-none focus:border-accent transition-all placeholder:text-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold text-muted uppercase tracking-widest ml-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Let's talk about your project..."
                    className="w-full bg-background/50 border border-border-subtle rounded-xl px-5 py-6 text-foreground outline-none focus:border-accent transition-all placeholder:text-muted/30 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="w-full py-5 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  onMouseEnter={() => handleCursorHover(true)}
                  onMouseLeave={() => handleCursorHover(false)}
                >
                  {formStatus === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border-subtle px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-12">
          <Logo className="scale-125" />

          <div className="flex flex-col md:flex-row items-center justify-between w-full pt-12 border-t border-border-subtle/50 gap-6">
            <p className="text-xs text-muted">
              © 2026 Dhruv Solanki · Surat, India
            </p>
            <div className="flex items-center gap-8">
              <a
                href="https://github.com/sodhruv28"
                target="_blank"
                className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Github
              </a>
              <a
                href="https://linkedin.com/in/dhruv-solanki-sodhruv28"
                target="_blank"
                className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Linkedin
              </a>
              <a
                href="https://instagram.com/sodhruv28"
                target="_blank"
                className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Instagram
              </a>
              <a
                href="mailto:sodhruv28work@gmail.com"
                className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
              >
                Email
              </a>
            </div>
          </div>
          {/* <p className="text-xs text-muted italic">
            Built with Next.js & Intention.
          </p> */}
        </div>
      </footer>
    </div>
  );
}
