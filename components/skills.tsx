import { skillCategories } from "@/lib/projects";

export function Skills() {
  return (
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
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="skill-card p-8 bg-card border border-border-subtle rounded-[24px] hover:border-accent/30 transition-all group"
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
  );
}
