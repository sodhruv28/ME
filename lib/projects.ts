export type Project = {
  id: string;
  title: string;
  desc: string;
  stack: string;
  link: string;
  external?: string;
};

export const projects: Project[] = [
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
    link: "https://github.com/sodhruv28/RESUME-scanning",
    external: "https://ai-resume-scan.netlify.app",
  },
  {
    id: "04",
    title: "QR Restaurant System",
    desc: "QR-based ordering, live order tracking, admin dashboard and Stripe payments.",
    stack: "Next.js · Socket.IO · Stripe · MongoDB",
    link: "https://github.com/sodhruv28/MENU-app",
    external: "https://myqr-menu.vercel.app/",
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

export const skillCategories = [
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
    skills: ["React.js", "Next.js", "Flutter", "Tailwind CSS", "TypeScript"],
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
    skills: ["MongoDB", "Supabase", "MySQL", "Firebase", "Redis", "Render"],
  },
] as const;
