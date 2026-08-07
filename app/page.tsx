import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { PortfolioShell } from "@/components/portfolio-shell";
import { Skills } from "@/components/skills";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <PortfolioShell>
      <Hero />
      <Work />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </PortfolioShell>
  );
}
