import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SessionWrapper from "@/components/SessionWrapper";
import CommandPalette from "@/components/CommandPalette";
import PullToRefresh from "@/components/PullToRefresh";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bohenix.africa"),
  title: { default: "Bohenix | AI Workforce Operating System & Autonomous Agents", template: "%s | Bohenix AI" },
  description: "Bohenix is the premier AI Workforce Operating System for emerging markets. Hire autonomous AI agents for sales, finance, M-Pesa reconciliations, and operations with full human-in-the-loop governance.",
  keywords: ["AI Workforce", "Autonomous AI Agents", "Next.js AI OS", "M-Pesa Automation", "African Enterprise AI", "Bohenix Flow", "Neural Core AI"],
  authors: [{ name: "Brian Nyarienya", url: "https://www.bohenix.africa" }],
  creator: "Brian Nyarienya",
  publisher: "Bohenix Technologies",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Bohenix | Your AI Workforce. Your Business on Autopilot.",
    description: "Bohenix Flow AI allows you to delegate entire business operations to intelligent AI agents that think, plan, execute, and continuously improve workflows.",
    url: "https://www.bohenix.africa",
    siteName: "Bohenix AI OS",
    locale: "en_US",
    type: "website",
    images: [{ url: "/bohenixx.png", width: 512, height: 512, alt: "Bohenix Flow AI Operating System" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix | Autonomous AI Workforce Operating System",
    description: "Delegate business operations to intelligent AI agents with built-in M-Pesa & financial infrastructure.",
    creator: "@bohenix_solutio",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa" },
  robots: { index: true, follow: true },
  verification: { google: "b8uLptdmDvhxX4RQtWQR9Phuo55ztiOEki2NyEPWujQ" },
};

export const viewport: Viewport = {
  themeColor: "#7B2DFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.includes('WebGL') ||
                  e.message.includes('THREE') ||
                  e.message.includes('webgl') ||
                  e.message.includes('GL_')
                )) {
                  console.warn('[Bohenix] WebGL error suppressed:', e.message);
                  e.preventDefault();
                  return true;
                }
              });
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && (
                  e.reason.message.includes('WebGL') ||
                  e.reason.message.includes('THREE') ||
                  e.reason.message.includes('webgl')
                )) {
                  console.warn('[Bohenix] WebGL promise error suppressed:', e.reason.message);
                  e.preventDefault();
                  return true;
                }
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Bohenix AI Workforce Operating System",
              operatingSystem: "Web-based Platform",
              applicationCategory: "BusinessApplication",
              url: "https://www.bohenix.africa",
              logo: "https://www.bohenix.africa/bohenixx.png",
              description:
                "Bohenix is the AI Workforce Operating System. Hire autonomous AI agents that execute complete business workflows — from sales and marketing to finance and operations.",
              author: {
                "@type": "Person",
                name: "Brian Nyarienya",
                jobTitle: "Founder & Visionary",
                sameAs: [
                  "https://www.instagram.com/bohenixofficial",
                  "https://github.com/Geezkick",
                ],
              },
              sameAs: [
                "https://www.instagram.com/bohenixofficial",
                "https://m.twitch.tv/bohenix/about",
              ],
            }),
          }}
        />

        <SessionWrapper>
          <LanguageProvider>
            <NotificationProvider>
              <AuthProvider>
                <PullToRefresh />
                <CommandPalette />
                {children}
              </AuthProvider>
            </NotificationProvider>
          </LanguageProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
