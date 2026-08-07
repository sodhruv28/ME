import { Github, Instagram, Linkedin } from "lucide-react";
import { projects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

const aiProjectCount = projects.filter((project) =>
  /gemini|ai/i.test(`${project.title} ${project.desc} ${project.stack}`),
).length;

export function About() {
  return (
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
            I&apos;m a full stack developer based in {siteConfig.location},
            currently pursuing my MCA at VNSGU. I build complete,
            production-ready products — from AI-integrated mobile apps to
            real-time web platforms. When I&apos;m not coding, I&apos;m gaming,
            watching anime, or sketching.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="px-5 py-3 bg-card border border-border-subtle rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-[13px] text-foreground">
                {projects.length} Projects Shipped
              </span>
            </div>
            <div className="px-5 py-3 bg-card border border-border-subtle rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-[13px] text-foreground">
                {aiProjectCount} AI Apps Built
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors p-2"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors p-2"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors p-2"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
