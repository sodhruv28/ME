import { ArrowRight, ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";

export function Work() {
  return (
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
        {projects.map((project) => {
          const primaryHref = project.external ?? project.link;

          return (
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
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors flex items-center gap-3 w-fit"
                  >
                    {project.title}
                    <ExternalLink
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-accent"
                    />
                  </a>
                </h3>
                <p className="text-sm text-muted mb-4 max-w-xl">{project.desc}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  {project.stack}
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:opacity-0 group-hover:opacity-100 transition-all text-accent font-bold flex items-center gap-2 text-sm hover:underline"
                >
                  View GitHub <ArrowRight size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
