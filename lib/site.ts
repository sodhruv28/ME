export const siteConfig = {
  name: "Dhruv Solanki",
  brand: "sodhruv",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sodhruv.me",
  email: "sodhruv28work@gmail.com",
  location: "Surat, India",
  description:
    "Personal portfolio of Dhruv Solanki, a Full Stack Developer specializing in AI-integrated apps, MERN/Next.js, and Flutter. Based in Surat, India.",
  links: {
    github: "https://github.com/sodhruv28",
    linkedin: "https://linkedin.com/in/dhruv-solanki-sodhruv28",
    instagram: "https://instagram.com/sodhruv28",
    resume: "/resume.pdf",
  },
} as const;
