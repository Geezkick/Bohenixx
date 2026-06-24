import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import MobileShell from "@/components/MobileShell";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bohenix ONE | Intelligent Digital Future",
    template: "%s | Bohenix ONE"
  },
  description: "Bohenix Technologies builds AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond. Founded by Brian Nyarienya.",
  keywords: ["Bohenix", "Brian Nyarienya", "Africa Tech Startup", "Digital Ecosystem", "Enterprise Software", "Artificial Intelligence", "Cybersecurity", "Cloud Infrastructure"],
  authors: [{ name: "Brian Nyarienya" }],
  creator: "Brian Nyarienya",
  publisher: "Bohenix Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bohenix ONE',
  },
  openGraph: {
    title: "Bohenix ONE | Digital Ecosystem",
    description: "Architecting a Cognitive Tech-Ecosystem to autonomously scale Africa's Digital Infrastructure.",
    url: "https://bohenixx.vercel.app",
    siteName: "Bohenix",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
        <NotificationProvider>
          <AuthProvider>
            <MobileShell>{children}</MobileShell>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
