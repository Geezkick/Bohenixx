"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  Zap,
  Shield,
  CreditCard,
  ArrowRight,
  Lock,
  RefreshCw,
  Sparkles,
  Building2,
  Crown,
} from "lucide-react";
import s from "./subscription.module.css";

type PlanKey = "Starter" | "Professional" | "Enterprise";

interface PlanConfig {
  name: string;
  desc: string;
  monthlyUsd: number;
  monthlyKes: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  btnStyle: string;
}

const PLANS: Record<PlanKey, PlanConfig> = {
  Starter: {
    name: "Starter",
    desc: "For small teams getting started with AI automation.",
    monthlyUsd: 19,
    monthlyKes: 2450,
    features: [
      "3 AI Employees",
      "1,000 tasks / month",
      "Basic Analytics Dashboard",
      "Email support",
      "Standard integrations",
      "Community access",
    ],
    cta: "Get Started",
    btnStyle: "planBtnOutline",
  },
  Professional: {
    name: "Professional",
    desc: "For growing businesses scaling autonomous operations.",
    monthlyUsd: 49,
    monthlyKes: 6350,
    features: [
      "15 AI Employees",
      "10,000 tasks / month",
      "Advanced Analytics & Reports",
      "Priority support (24h SLA)",
      "Multi-agent workflows",
      "M-Pesa & Stripe payments",
      "Document intelligence",
      "Custom agent training",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    btnStyle: "planBtnPrimary",
  },
  Enterprise: {
    name: "Enterprise",
    desc: "For organizations building a full AI workforce.",
    monthlyUsd: 199,
    monthlyKes: 25700,
    features: [
      "Unlimited AI Employees",
      "Unlimited tasks",
      "CEO Command Center",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "SSO & advanced security",
      "On-premise deployment option",
      "Custom API & white-label",
      "AI Meeting Room & Digital Twin",
    ],
    cta: "Contact Sales",
    btnStyle: "planBtnEnterprise",
  },
};

const FAQS = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrade or downgrade at any time. Changes are prorated and reflected on your next billing cycle.",
  },
  {
    q: "What happens after my free trial?",
    a: "Your 14-day trial includes all Professional features. After the trial, choose a plan or continue on Starter.",
  },
  {
    q: "Do you support M-Pesa payments?",
    a: "Absolutely. We support M-Pesa STK Push, credit cards via Stripe, and bank transfers for Enterprise plans.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted at rest and in transit. We're SOC 2 compliant with enterprise-grade security controls.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Fetch subscription status only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/account/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.active && data.plan) {
          setCurrentPlan(data.plan);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const getPrice = (plan: PlanConfig) => {
    const monthly = currency === "KES" ? plan.monthlyKes : plan.monthlyUsd;
    return isAnnual ? Math.round(monthly * 10) : monthly;
  };

  const handleSelectPlan = async (planKey: PlanKey) => {
    if (planKey === "Enterprise") {
      window.location.href = "mailto:sales@bohenix.com?subject=Enterprise%20Plan%20Inquiry";
      return;
    }

    // If not signed in, send them to sign-in and come back here
    if (!isAuthenticated) {
      router.push("/sign-in?callbackUrl=/pricing");
      return;
    }

    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/flow-ai/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, currency: currency.toLowerCase() }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize checkout. Please try again.");
        setLoadingPlan(null);
      }
    } catch {
      alert("An error occurred. Please try again.");
      setLoadingPlan(null);
    }
  };

  const planKeys: PlanKey[] = ["Starter", "Professional", "Enterprise"];

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', 'Inter', sans-serif" }}>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff" }}>
          <Image src="/bohenixx.png" alt="Bohenix" width={28} height={28} />
          <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Bohenix</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Currency toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3px" }}>
            {(["USD", "KES"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
                  fontSize: "0.8rem", fontWeight: 600,
                  background: currency === c ? "rgba(123,45,255,0.8)" : "transparent",
                  color: currency === c ? "#fff" : "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? null : isAuthenticated ? (
            <Link href="/dashboard" style={{
              padding: "0.45rem 1rem", background: "#7B2DFF", color: "#fff",
              borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
            }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" style={{
                padding: "0.45rem 1rem", background: "rgba(255,255,255,0.08)", color: "#fff",
                borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
              }}>
                Sign In
              </Link>
              <Link href="/sign-in?mode=signup" style={{
                padding: "0.45rem 1rem", background: "#7B2DFF", color: "#fff",
                borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <div className={s.planPage}>

        {/* Header */}
        <div className={s.planHeader}>
          <span className={s.planHeaderLabel}>
            <Sparkles size={14} />
            Subscription Plans
          </span>
          <h1 className={s.planTitle}>
            Deploy Your{" "}
            <span className={s.planTitleGradient}>AI Workforce</span>
          </h1>
          <p className={s.planSubtitle}>
            Choose the plan that fits your business. Scale from a small team to a
            full autonomous company—all powered by Bohenix OS.
          </p>

          {/* Billing toggle */}
          <div className={s.billingToggle}>
            <span className={`${s.toggleLabel} ${!isAnnual ? s.toggleLabelActive : ""}`}>
              Monthly
            </span>
            <button
              className={`${s.toggleSwitch} ${isAnnual ? s.toggleSwitchActive : ""}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
            />
            <span className={`${s.toggleLabel} ${isAnnual ? s.toggleLabelActive : ""}`}>
              Annual
            </span>
            {isAnnual && <span className={s.saveBadge}>Save 17%</span>}
          </div>
        </div>

        {/* Plans Grid */}
        <div className={s.plansGrid}>
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const price = getPrice(plan);
            const isCurrentPlan = currentPlan?.toLowerCase().includes(key.toLowerCase());
            const isLoadingThis = loadingPlan === key;
            const icon =
              key === "Starter" ? <Zap size={20} color="#7B2DFF" /> :
              key === "Professional" ? <Crown size={20} color="#7B2DFF" /> :
              <Building2 size={20} color="#00E5FF" />;

            return (
              <div
                key={key}
                className={`${s.planCard} ${plan.highlighted ? s.planCardPopular : ""}`}
              >
                {plan.highlighted && <div className={s.popularBadge}>Most Popular</div>}
                {isCurrentPlan && (
                  <div className={s.currentBadge}>
                    <span className={s.currentDot} />
                    Current Plan
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                  {icon}
                  <h3 className={s.planName}>{plan.name}</h3>
                </div>
                <p className={s.planDesc}>{plan.desc}</p>

                <div className={s.priceRow}>
                  <span className={s.priceCurrency}>{currency === "KES" ? "KES" : "$"}</span>
                  <span className={s.priceAmount}>
                    {key === "Enterprise" ? "Custom" : price.toLocaleString()}
                  </span>
                  {key !== "Enterprise" && (
                    <span className={s.pricePeriod}>/{isAnnual ? "year" : "mo"}</span>
                  )}
                </div>
                {key !== "Enterprise" && (
                  <p className={s.priceSubtext}>
                    {isAnnual
                      ? `${currency === "KES" ? "KES " : "$"}${(currency === "KES" ? plan.monthlyKes : plan.monthlyUsd).toLocaleString()}/mo billed annually`
                      : "Billed monthly, cancel anytime"}
                  </p>
                )}
                {key === "Enterprise" && (
                  <p className={s.priceSubtext}>Tailored pricing for your organization</p>
                )}

                <div className={s.divider} />

                <ul className={s.featureList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className={s.featureItem}>
                      <span className={`${s.featureCheck} ${plan.highlighted ? s.featureCheckGreen : s.featureCheckDefault}`}>
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`${s.planBtn} ${s[plan.btnStyle]} ${isLoadingThis ? s.planBtnDisabled : ""}`}
                  onClick={() => handleSelectPlan(key)}
                  disabled={isLoadingThis}
                >
                  {isLoadingThis ? (
                    <><span className={s.spinner} /> Processing...</>
                  ) : (
                    <>{isAuthenticated ? plan.cta : key === "Enterprise" ? plan.cta : "Sign Up & " + plan.cta} <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Bar */}
        <div className={s.trustBar}>
          <div className={s.trustItem}><Shield size={16} color="#22c55e" />SSL Encrypted</div>
          <div className={s.trustItem}><Lock size={16} color="#22c55e" />SOC 2 Compliant</div>
          <div className={s.trustItem}><CreditCard size={16} color="#22c55e" />Secure Payments</div>
          <div className={s.trustItem}><RefreshCw size={16} color="#22c55e" />Cancel Anytime</div>
        </div>

        {/* FAQ */}
        <div className={s.faqSection}>
          <h2 className={s.faqTitle}>Frequently Asked Questions</h2>
          <div className={s.faqGrid}>
            {FAQS.map((faq, i) => (
              <div key={i} className={s.faqItem}>
                <div className={s.faqQuestion}>{faq.q}</div>
                <div className={s.faqAnswer}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
