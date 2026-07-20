"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";
import { Briefcase, Building2, UserCog, TrendingUp, Headphones, Scale, ArrowLeft, Loader2, Crown } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

type Step = "select_company_type" | "new_company_hire" | "existing_company_gap";
type CompanyType = "new" | "existing" | null;
type Department = "finance" | "sales" | "support" | "legal" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select_company_type");
  const [companyType, setCompanyType] = useState<CompanyType>(null);
  const [department, setDepartment] = useState<Department>(null);
  const [agentName, setAgentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectType = (type: "new" | "existing") => {
    setCompanyType(type);
    if (type === "new") {
      setStep("new_company_hire");
    } else {
      setStep("existing_company_gap");
    }
  };

  const handleHireAgent = async (type: string, presetName?: string) => {
    setIsSubmitting(true);
    try {
      const finalName = presetName || agentName || (type === "executive" ? "Alex (CEO)" : `Agent (${type})`);
      
      const res = await fetch("/api/flow-ai/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          type: type,
          description: type === "executive" 
            ? "Chief Executive Officer. Responsible for overall strategy, growth, and orchestrating the AI workforce." 
            : `Specialized agent for ${type} operations.`,
        }),
      });

      if (res.ok) {
        // Successfully created agent, redirect to dashboard
        router.push("/dashboard");
      } else {
        console.error("Failed to create agent");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ParticlesBackground />
      <div className={styles.container}>
        
        {/* Progress Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${styles.active}`} title="Step 1: Corporate Structure"></div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.stepDot} ${step !== "select_company_type" ? styles.active : ""}`} title="Step 2: Appoint Agent"></div>
        </div>

        {step === "select_company_type" && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Establish Your AI Workforce</h1>
              <p className={styles.subtitle}>
                To set up your operational hierarchy perfectly, tell us where your organization is currently positioned.
              </p>
            </div>

            <div className={styles.optionsGrid}>
              <div className={styles.optionCard} onClick={() => handleSelectType("new")}>
                <div className={`${styles.iconWrapper} ${styles.glowPrimary}`}>
                  <Briefcase size={36} color="#7B2DFF" />
                </div>
                <h3 className={styles.optionTitle}>I'm Starting a New Company</h3>
                <p className={styles.optionDesc}>
                  Building from scratch? Establish your foundation by hiring an Executive CEO Agent to lead your company's growth strategy.
                </p>
              </div>

              <div className={styles.optionCard} onClick={() => handleSelectType("existing")}>
                <div className={`${styles.iconWrapper} ${styles.glowSuccess}`}>
                  <Building2 size={36} color="#22c55e" />
                </div>
                <h3 className={styles.optionTitle}>I Have an Existing Business</h3>
                <p className={styles.optionDesc}>
                  Already operating? Expand your current operations by deploying specialized agents into specific departments that need reinforcement.
                </p>
              </div>
            </div>
          </>
        )}

        {step === "new_company_hire" && (
          <div className={styles.hireForm}>
            <div className={styles.hierarchyIndicator}>
              <Crown size={22} color="#7B2DFF" />
              <span className={styles.hierarchyText}>Corporate Hierarchy: Appoint Chief Executive</span>
            </div>
            
            <h2 className={styles.title} style={{ fontSize: "2.25rem", marginBottom: "0.75rem", textAlign: "center" }}>
              Hire Your AI CEO
            </h2>
            <p className={styles.subtitle} style={{ marginBottom: "2.5rem", textAlign: "center", fontSize: "1.1rem" }}>
              Every successful enterprise needs strong leadership. Your AI CEO will establish the corporate structure and orchestrate all future hires.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Chief Executive's Name</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g., Alex, Sarah, or 'Alpha'" 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>

            <button 
              className={styles.btnPrimary} 
              onClick={() => handleHireAgent("executive")}
              disabled={isSubmitting || !agentName.trim()}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <UserCog size={20} />}
              Authorize Executive Contract
            </button>
            
            <button 
              className={styles.btnSecondary} 
              onClick={() => { setStep("select_company_type"); setAgentName(""); }}
            >
              <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Go Back
            </button>
          </div>
        )}

        {step === "existing_company_gap" && (
          <div className={styles.hireForm}>
            <h2 className={styles.title} style={{ fontSize: "2.25rem", marginBottom: "0.75rem", textAlign: "center" }}>
              Identify the Gap
            </h2>
            <p className={styles.subtitle} style={{ marginBottom: "2.5rem", textAlign: "center", fontSize: "1.1rem" }}>
              Select the department that requires immediate autonomous reinforcement to accelerate your existing operations.
            </p>

            <div className={styles.deptGrid}>
              <div 
                className={`${styles.deptCard} ${department === "finance" ? styles.selected : ""}`}
                onClick={() => setDepartment("finance")}
              >
                <TrendingUp size={28} color={department === "finance" ? "#7B2DFF" : "rgba(255,255,255,0.4)"} />
                <span style={{ color: department === "finance" ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>Finance Dept</span>
              </div>
              <div 
                className={`${styles.deptCard} ${department === "sales" ? styles.selected : ""}`}
                onClick={() => setDepartment("sales")}
              >
                <TrendingUp size={28} color={department === "sales" ? "#7B2DFF" : "rgba(255,255,255,0.4)"} />
                <span style={{ color: department === "sales" ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>Sales Dept</span>
              </div>
              <div 
                className={`${styles.deptCard} ${department === "support" ? styles.selected : ""}`}
                onClick={() => setDepartment("support")}
              >
                <Headphones size={28} color={department === "support" ? "#7B2DFF" : "rgba(255,255,255,0.4)"} />
                <span style={{ color: department === "support" ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>Support Dept</span>
              </div>
              <div 
                className={`${styles.deptCard} ${department === "legal" ? styles.selected : ""}`}
                onClick={() => setDepartment("legal")}
              >
                <Scale size={28} color={department === "legal" ? "#7B2DFF" : "rgba(255,255,255,0.4)"} />
                <span style={{ color: department === "legal" ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>Legal Dept</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Specialist Agent Name (Optional)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Name your specialist..." 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>

            <button 
              className={styles.btnPrimary} 
              onClick={() => handleHireAgent(department || "support")}
              disabled={isSubmitting || !department}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <UserCog size={20} />}
              Deploy Specialist Agent
            </button>

            <button 
              className={styles.btnSecondary} 
              onClick={() => { setStep("select_company_type"); setDepartment(null); setAgentName(""); }}
            >
              <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Go Back
            </button>
          </div>
        )}
      </div>
    </>
  );
}
