import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import SessionWrapper from "@/components/SessionWrapper";
import CommandPalette from "@/components/CommandPalette";
import PullToRefresh from "@/components/PullToRefresh";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bohenix.africa"),
  title: { default: "Bohenix ONE | Intelligent Digital Future", template: "%s | Bohenix ONE" },
  description: "Bohenix Technologies builds AI, mobility, fintech, productivity solutions for Africa.",
  authors: [{ name: "Brian Nyarienya", url: "https://www.bohenix.africa" }],
  creator: "Brian Nyarienya",
  publisher: "Bohenix Technologies",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Bohenix ONE | Africa's Intelligent Digital Future",
    description: "Architecting a Cognitive Tech-Ecosystem for Africa.",
    url: "https://www.bohenix.africa",
    siteName: "Bohenix",
    locale: "en_US",
    type: "website",
    images: [{ url: "/bohenixx.png", width: 512, height: 512, alt: "Bohenix ONE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix ONE | Africa's Intelligent Digital Future",
    description: "AI, mobility, fintech, productivity solutions.",
    creator: "@bohenix_solutio",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa" },
  robots: { index: true, follow: true },
  verification: { google: "b8uLptdmDvhxX4RQtWQR9Phuo55ztiOEki2NyEPWujQ" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
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
              "@type": "Organization",
              name: "Bohenix",
              url: "https://www.bohenix.africa",
              logo: "https://www.bohenix.africa/bohenixx.png",
              description:
                "Bohenix Technologies builds AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.",
              founder: {
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
          <NotificationProvider>
            <AuthProvider>
              <PullToRefresh />
              <CommandPalette />
              {children}
            </AuthProvider>
          </NotificationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
