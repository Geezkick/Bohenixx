import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Services — Bohenix AI Engineering",
  description:
    "Bespoke AI system design, M-Pesa integration, Neural Core enterprise deployments, and custom autonomous agent architectures. 3–30 day delivery. Built for African enterprises.",
  keywords: [
    "enterprise AI services Kenya",
    "M-Pesa API integration",
    "custom AI development Africa",
    "enterprise software Kenya",
    "AI agent deployment",
    "Neural Core integration",
    "corporate AI architecture",
  ],
  openGraph: {
    title: "Bohenix Enterprise Services — Custom AI Engineering",
    description:
      "From Rapid AI Deployment (3–5 days) to custom sovereign infrastructure. We build the AI workforce systems your business needs.",
    url: "https://www.bohenix.africa/services",
    images: [
      {
        url: "/bohenixx.png",
        width: 512,
        height: 512,
        alt: "Bohenix Enterprise Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix Enterprise Services — AI Engineering",
    description: "Custom AI agent systems, M-Pesa integrations, and enterprise Neural Core deployments.",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa/services" },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
