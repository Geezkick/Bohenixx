import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Topbar from "@/components/Topbar";
import CommandPalette from "@/components/CommandPalette";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOHENIX ONE",
  description: "The official digital ecosystem of Bohenix Technologies.",
  manifest: "/manifest.json",
  icons: {
    icon: '/bohenixx.png',
    apple: '/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Topbar />
          <CommandPalette />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
