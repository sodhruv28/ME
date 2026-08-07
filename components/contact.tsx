"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Contact() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState(
    "Something went wrong. Please try again or email me directly.",
  );
  const statusResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (statusResetTimeoutRef.current) {
        clearTimeout(statusResetTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage(
      "Something went wrong. Please try again or email me directly.",
    );

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      company: formData.get("company"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (response.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        if (payload?.error && typeof payload.error === "string") {
          setErrorMessage(payload.error);
        }
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    } finally {
      if (statusResetTimeoutRef.current) {
        clearTimeout(statusResetTimeoutRef.current);
      }
      statusResetTimeoutRef.current = setTimeout(() => {
        setFormStatus("idle");
        statusResetTimeoutRef.current = null;
      }, 5000);
    }
  };

  return (
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
            Open to full time jobs, freelance projects, and interesting ideas.
            Drop a message or reach out on social media.
          </p>

          <div className="space-y-6">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-4 text-foreground hover:text-accent transition-colors group"
            >
              <div className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                <Send size={18} />
              </div>
              <div>
                <p className="text-[11px] text-muted uppercase font-mono tracking-widest mb-1">
                  Email
                </p>
                <p className="text-lg font-medium">{siteConfig.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-6 pt-4">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
              >
                <Github size={20} /> Github
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
              >
                <Linkedin size={20} /> Linkedin
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors flex items-center gap-2 text-sm"
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
                Thank you for reaching out. I&apos;ll get back to you as soon as
                possible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div
                className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

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
                    name="name"
                    required
                    maxLength={100}
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
                    name="email"
                    type="email"
                    required
                    maxLength={254}
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
                  name="subject"
                  required
                  maxLength={150}
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
                  name="message"
                  required
                  rows={4}
                  maxLength={5000}
                  placeholder="Let's talk about your project..."
                  className="w-full bg-background/50 border border-border-subtle rounded-xl px-5 py-6 text-foreground outline-none focus:border-accent transition-all placeholder:text-muted/30 resize-none"
                />
              </div>

              {formStatus === "error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full py-5 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
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
  );
}
