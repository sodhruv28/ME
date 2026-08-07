import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="py-20 border-t border-border-subtle px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-12">
        <Logo className="scale-125" />

        <div className="flex flex-col md:flex-row items-center justify-between w-full pt-12 border-t border-border-subtle/50 gap-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name} ·{" "}
            {siteConfig.location}
          </p>
          <div className="flex items-center gap-8">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
            >
              Github
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
            >
              Linkedin
            </a>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
            >
              Instagram
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-xs text-muted hover:text-foreground transition-colors uppercase tracking-widest font-bold"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
