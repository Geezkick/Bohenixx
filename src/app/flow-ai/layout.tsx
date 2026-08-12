import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bohenix Flow AI — Autonomous AI Workforce Platform",
  description:
    "Deploy a full AI workforce with Bohenix Flow AI. Autonomous agents for sales, finance, M-Pesa reconciliation, customer support, and operations — built for African enterprises.",
  keywords: [
    "AI Workforce Platform",
    "Autonomous AI Agents Africa",
    "M-Pesa AI Automation",
    "Business AI Operating System",
    "Flow AI Bohenix",
    "AI employees Kenya",
    "enterprise AI platform",
  ],
  openGraph: {
    title: "Bohenix Flow AI — Build a Digital Company That Runs Itself",
    description:
      "Deploy specialized AI agents for every department. Operations, sales, finance, customer support — autonomous, 24/7, M-Pesa native.",
    url: "https://www.bohenix.africa/flow-ai",
    images: [
      {
        url: "/bohenixx.png",
        width: 512,
        height: 512,
        alt: "Bohenix Flow AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix Flow AI — Autonomous AI Workforce",
    description:
      "Hire AI employees that never sleep. Full digital workforce for your company.",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa/flow-ai" },
};

export default function FlowAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
