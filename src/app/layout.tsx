import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import MobileShell from "@/components/MobileShell";
import { NotificationProvider } from "@/context/NotificationContext";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bohenix.africa'),
  title: { default: "Bohenix ONE | Intelligent Digital Future", template: "%s | Bohenix ONE" },
  description: "Bohenix Technologies builds AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.",
  authors: [{ name: "Brian Nyarienya", url: "https://www.bohenix.africa" }],
  creator: "Brian Nyarienya",
  publisher: "Bohenix Technologies",
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Bohenix ONE' },
  openGraph: {
    title: "Bohenix ONE | Africa's Intelligent Digital Future",
    description: "Architecting a Cognitive Tech-Ecosystem to autonomously scale Africa's Digital Infrastructure.",
    url: "https://www.bohenix.africa",
    siteName: "Bohenix",
    locale: "en_US",
    type: "website",
    images: [{ url: "/bohenixx.png", width: 512, height: 512, alt: "Bohenix ONE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix ONE | Africa's Intelligent Digital Future",
    description: "AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions.",
    creator: "@bohenix_solutio",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: { google: '49bfe151a4d9e4d4' },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <SessionWrapper>
          <NotificationProvider>
            <AuthProvider>
              <MobileShell>{children}</MobileShell>
            </AuthProvider>
          </NotificationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
