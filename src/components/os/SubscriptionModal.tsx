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
  },
};

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Choose a Plan to Deploy</h2>
          <p className={styles.modalDesc}>
            You need an active subscription to deploy an AI agent. Choose a plan that fits your business needs.
          </p>
        </div>

        <div className={styles.plansGrid}>
          {planKeys.map((key) => {
            const plan = PLANS[key];
            const isLoading = loadingPlan === key;
            const icon =
              key === "Starter" ? (
                <Zap size={20} color="#7B2DFF" />
              ) : key === "Professional" ? (
                <Crown size={20} color="#7B2DFF" />
              ) : (
                <Building2 size={20} color="#00E5FF" />
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
                    {key === "Enterprise" ? "Custom" : plan.monthlyUsd}
                  </span>
                  {key !== "Enterprise" && <span className={styles.pricePeriod}>/mo</span>}
                </div>

                <div className={styles.divider} />

                <ul className={styles.featureList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span
                        className={`${styles.featureCheck} ${plan.highlighted ? styles.featureCheckGreen : ""}`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`${styles.planBtn} ${plan.highlighted ? styles.btnPrimary : styles.btnSecondary} ${isLoading ? styles.btnDisabled : ""}`}
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
