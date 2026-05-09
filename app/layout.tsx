import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhruv Solanki | Full Stack Developer",
  description: "Personal portfolio of Dhruv Solanki, a Full Stack Developer specializing in AI-integrated apps, MERN/Next.js, and Flutter. Based in Surat, India.",
  keywords: ["Dhruv Solanki", "Full Stack Developer", "Surat", "Next.js Portfolio", "Flutter Developer", "AI Apps"],
  authors: [{ name: "Dhruv Solanki" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Dhruv Solanki | Full Stack Developer",
    description: "Crafting digital experiences that actually work.",
    url: "https://sodhruv.me",
    siteName: "Dhruv Solanki Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
