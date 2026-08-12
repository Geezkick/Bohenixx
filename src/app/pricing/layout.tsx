import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Bohenix AI Workforce Plans",
  description:
    "Choose your Bohenix AI Workforce plan. From $19/mo for startups to enterprise custom pricing. M-Pesa & Stripe payments. 14-day free trial on Professional.",
  keywords: [
    "Bohenix pricing",
    "AI Workforce pricing",
    "AI agent subscription",
    "M-Pesa SaaS pricing",
    "AI business software Kenya",
    "affordable AI platform Africa",
  ],
  openGraph: {
    title: "Bohenix Pricing — Deploy Your AI Workforce from $19/mo",
    description:
      "Starter, Professional, and Enterprise plans. Full autonomous AI workforce for your business. Cancel anytime.",
    url: "https://www.bohenix.africa/pricing",
    images: [
      {
        url: "/bohenixx.png",
        width: 512,
        height: 512,
        alt: "Bohenix Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohenix Pricing — AI Workforce Plans",
    description: "Full AI workforce from $19/mo. M-Pesa & Stripe. 14-day free trial.",
    images: ["/bohenixx.png"],
  },
  alternates: { canonical: "https://www.bohenix.africa/pricing" },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
