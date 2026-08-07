import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="z-10 flex flex-col items-center">
        <div className="hero-brand mb-10">
          <Logo className="scale-[1.35] origin-center" />
        </div>

        <h1 className="hero-headline font-bold text-foreground mb-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] leading-[0.95]">
          I build products <br className="hidden sm:block" /> that actually{" "}
          <br className="hidden sm:block" />
          work<span className="text-accent">.</span>
        </h1>

        <p className="hero-subtext max-w-[480px] text-lg text-muted mb-12 leading-relaxed">
          Full stack developer crafting AI-integrated apps, real-time systems,
          and mobile experiences. Open to work in Surat, India.
        </p>

        <div className="hero-ctas flex items-center gap-6">
          <a
            href="#work"
            className="px-10 py-4 bg-accent text-white font-bold rounded-full hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-accent/20"
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 text-foreground font-bold hover:text-accent transition-colors"
          >
            Get In Touch <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
