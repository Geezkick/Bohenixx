"use client";

import React, { useState } from "react";
import { X, Check, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import styles from "./SubscriptionModal.module.css";

interface PlanConfig {
  name: string;
  desc: string;
  monthlyUsd: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  btnStyle: "btnPrimary" | "btnSecondary" | "btnEnterprise";
}

const PLANS: Record<string, PlanConfig> = {
  Starter: {
    name: "Starter",
    desc: "For small teams getting started with AI automation.",
    monthlyUsd: 19,
    features: [
      "3 AI Employees",
      "1,000 tasks / month",
      "Basic Analytics Dashboard",
      "Standard integrations",
    ],
    cta: "Select Starter",
    btnStyle: "btnSecondary",
  },
  Professional: {
    name: "Professional",
    desc: "For growing businesses scaling autonomous operations.",
    monthlyUsd: 49,
    features: [
      "15 AI Employees",
      "10,000 tasks / month",
      "Advanced Analytics & Reports",
      "Multi-agent workflows",
    ],
    highlighted: true,
    cta: "Start Free Trial",
    btnStyle: "btnPrimary",
  },
  Enterprise: {
    name: "Enterprise",
    desc: "For organizations building a full AI workforce.",
    monthlyUsd: 199,
    features: [
      "Unlimited AI Employees",
      "Unlimited tasks",
      "CEO Command Center",
      "Custom SLA & uptime",
    ],
    cta: "Contact Sales",
    btnStyle: "btnEnterprise",
  },
};

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = async (planKey: string) => {
    if (planKey === "Enterprise") {
      window.location.href = "mailto:sales@bohenix.com?subject=Enterprise%20Plan%20Inquiry";
      return;
    }

    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/flow-ai/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
          currency: "usd",
        }),
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

  const planKeys = ["Starter", "Professional", "Enterprise"];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalLabel}>
            <Zap size={14} /> Subscription Required
          </div>
          <h2 className={styles.modalTitle}>Deploy Your AI Workforce</h2>
          <p className={styles.modalDesc}>
            To hire and deploy autonomous agents, you need an active OS plan. Choose the capacity that fits your scale.
          </p>
        </div>

        <div className={styles.billingToggle}>
          <span className={`${styles.toggleLabel} ${!isAnnual ? styles.toggleLabelActive : ""}`}>
            Monthly
          </span>
          <button
            className={`${styles.toggleSwitch} ${isAnnual ? styles.toggleSwitchActive : ""}`}
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle annual billing"
          />
          <span className={`${styles.toggleLabel} ${isAnnual ? styles.toggleLabelActive : ""}`}>
            Annual
          </span>
          {isAnnual && <span className={styles.saveBadge}>Save 17%</span>}
        </div>

        <div className={styles.plansGrid}>
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const isLoading = loadingPlan === key;
            const price = isAnnual && key !== "Enterprise" ? Math.round(plan.monthlyUsd * 10) : plan.monthlyUsd;
            
            const icon =
              key === "Starter" ? (
                <Zap size={22} color="#7B2DFF" />
              ) : key === "Professional" ? (
                <Crown size={22} color="#7B2DFF" />
              ) : (
                <Building2 size={22} color="#00E5FF" />
              );

            return (
              <div
                key={key}
                className={`${styles.planCard} ${plan.highlighted ? styles.planCardPopular : ""}`}
              >
                {plan.highlighted && <div className={styles.popularBadge}>Most Popular</div>}

                <div className={styles.planHeader}>
                  {icon}
                  <h3 className={styles.planName}>{plan.name}</h3>
                </div>
                <p className={styles.planDesc}>{plan.desc}</p>

                <div className={styles.priceRow}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>
                    {key === "Enterprise" ? "Custom" : price}
                  </span>
                  {key !== "Enterprise" && (
                    <span className={styles.pricePeriod}>/{isAnnual ? "yr" : "mo"}</span>
                  )}
                </div>
                {key !== "Enterprise" && (
                  <p className={styles.priceSubtext}>
                    {isAnnual ? `Billed $${price} annually` : "Billed monthly, cancel anytime"}
                  </p>
                )}
                {key === "Enterprise" && (
                  <p className={styles.priceSubtext}>Tailored for your organization</p>
                )}

                <div className={styles.divider} />

                <ul className={styles.featureList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span
                        className={`${styles.featureCheck} ${plan.highlighted ? styles.featureCheckGreen : ""}`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`${styles.planBtn} ${styles[plan.btnStyle]} ${isLoading ? styles.btnDisabled : ""}`}
                  onClick={() => handleSelectPlan(key)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : (
                    <>
                      {plan.cta} <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
