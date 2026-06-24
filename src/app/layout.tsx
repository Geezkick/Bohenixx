import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import MobileShell from "@/components/MobileShell";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOHENIX ONE",
  description: "The official digital ecosystem of Bohenix Technologies.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bohenix ONE',
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
