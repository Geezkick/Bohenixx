"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon, ArrowRightIcon, CheckIcon 
} from "@/components/Icons";
import { 
  Code, Zap, Shield, Database, Cpu, Clock, CheckCircle2, Sliders, Calendar, Sparkles, Building2
} from "lucide-react";
import styles from "./services.module.css";

interface ServiceTier {
  id: string;
  name: string;
  badge: string;
  days: string;
  description: string;
  features: string[];
  recommendedFor: string;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "rapid",
    name: "Rapid AI Deployment",
    badge: "LIGHTNING",
    days: "3 – 5 Days",
    description: "Fast-track integration of pre-configured department AI agents (Operations, Sales, Finance) with standard API hooks.",
    features: [
      "Up to 3 Autonomous Agents",
      "M-Pesa Daraja Callback Setup",
      "Standard Role-Based Access",
      "Email & Webhook Connectors",
      "30-Day SLA & Support"
    ],
    recommendedFor: "Startups & Growing SMEs"
  },
  {
    id: "enterprise",
    name: "Neural Core Enterprise Suite",
    badge: "MOST POPULAR",
    days: "7 – 14 Days",
    description: "Full-scale Neural Core implementation with Knowledge Graph contextual memory, custom workflows, and multi-department governance.",
    features: [
      "Unlimited Department Agents",
      "Full Knowledge Graph Integration",
      "Custom Corporate DNA Rules",
      "ERP / CRM / Database Connectors",
      "24/7 Dedicated SLA & Monitoring"
    ],
    recommendedFor: "Mid-Market & Enterprise Operations"
  },
  {
    id: "sovereign",
    name: "Custom Sovereign Infrastructure",
    badge: "BESPOKE",
    days: "21 – 30 Days",
    description: "Bespoke on-premise or private-cloud AI workforce OS architecture built to strict compliance, regulatory, and data sovereignty requirements.",
    features: [
      "Private Model Fine-Tuning",
      "Air-Gapped / On-Prem Deployment",
      "Custom Hardware Acceleration",
      "KRA / Data Protection Compliance Audit",
      "Dedicated Enterprise Engineering Team"
    ],
    recommendedFor: "Financial Institutions & Government"
  }
];

const SCOPE_OPTIONS = [
  { id: "fin", label: "M-Pesa & Finance Automation", daysAdd: 2 },
  { id: "graph", label: "Knowledge Graph Integration", daysAdd: 4 },
  { id: "dna", label: "Corporate DNA Governance Engine", daysAdd: 3 },
  { id: "custom_agent", label: "Custom Department Agents", daysAdd: 3 },
  { id: "api", label: "ERP / CRM API Connectors", daysAdd: 5 },
  { id: "audit", label: "Security & SLA Guardrail Audit", daysAdd: 2 }
];

export default function ServicesPage() {
  const [selectedTier, setSelectedTier] = useState<string>("enterprise");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["fin", "graph", "dna"]);
  const [agentCount, setAgentCount] = useState<number>(5);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [requestForm, setRequestForm] = useState({
    companyName: "",
    email: "",
    customNotes: ""
  });

  const toggleScope = (id: string) => {
    setSelectedScopes(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate dynamic delivery days
  const baseDays = selectedTier === "rapid" ? 3 : selectedTier === "enterprise" ? 7 : 21;
  const extraScopeDays = selectedScopes.reduce((acc, scopeId) => {
    const item = SCOPE_OPTIONS.find(s => s.id === scopeId);
    return acc + (item?.daysAdd || 0);
  }, 0);
  const totalDaysMin = Math.max(3, baseDays + Math.floor(extraScopeDays * 0.7));
  const totalDaysMax = totalDaysMin + 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05050A", color: "#FAFAFA", fontFamily: "Inter, sans-serif" }}>
      {/* Top Navbar */}
      <header style={{ 
        height: "64px", 
        padding: "0 2rem", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)", 
        background: "rgba(5,5,10,0.85)", 
        backdropFilter: "blur(16px)", 
        position: "sticky", 
        top: 0, 
        zIndex: 100 
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
          <ArrowLeftIcon size={18} /> Back to Home
        </Link>
        <div style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Bohenix Services & Engineering
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 2rem 120px" }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <span style={{ 
            fontSize: "0.75rem", 
            fontFamily: "monospace", 
            fontWeight: 700, 
            letterSpacing: "0.18em", 
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.4)", 
            background: "rgba(255,255,255,0.04)", 
            border: "1px solid rgba(255,255,255,0.08)", 
            padding: "0.4rem 1rem", 
            borderRadius: "999px" 
          }}>
            ENTERPRISE SERVICES & TURNAROUND TIMELINES
          </span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", margin: "24px 0 16px", color: "#FAFAFA" }}>
            Tailored Engineering & Delivery Timelines
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Customize your AI workforce scope, select integration requirements, and view transparent turnaround days for guaranteed delivery.
          </p>
        </div>

        {/* ── Section 1: Turnaround Time & Service Tiers ── */}
        <div style={{ marginBottom: "96px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>01. Delivery Options</div>
              <h2 style={{ fontSize: "28px", fontWeight: 600, color: "#FAFAFA", margin: "4px 0 0" }}>Enterprise Service Tiers</h2>
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Every tier includes full source code deployment and SLA guarantees.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {SERVICE_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div 
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  style={{
                    background: isSelected 
                      ? "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" 
                      : "rgba(255,255,255,0.02)",
                    border: isSelected ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px",
                    padding: "36px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ 
                      fontSize: "0.65rem", 
                      fontFamily: "monospace", 
                      fontWeight: 700, 
                      letterSpacing: "0.12em", 
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px"
                    }}>
                      {tier.badge}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "#FAFAFA", fontFamily: "monospace" }}>
                      <Clock size={15} color="rgba(255,255,255,0.6)" />
                      {tier.days}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#FAFAFA", margin: "0 0 8px" }}>{tier.name}</h3>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{tier.description}</p>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginTop: "auto" }}>
                    <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.3)", marginBottom: "12px", textTransform: "uppercase" }}>Key Deliverables</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {tier.features.map((feat, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                          <CheckCircle2 size={14} color="rgba(255,255,255,0.5)" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    fontSize: "0.78rem", 
                    color: "rgba(255,255,255,0.4)", 
                    background: "rgba(255,255,255,0.03)", 
                    padding: "0.6rem 0.8rem", 
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    Recommended: <strong>{tier.recommendedFor}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 2: Interactive Service Customizer & Days Calculator ── */}
        <div style={{ 
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(10,10,20,0.8) 100%)", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "24px", 
          padding: "48px 40px",
          marginBottom: "96px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Sliders size={20} color="rgba(255,255,255,0.7)" />
            <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em" }}>02. Custom Need Specification</div>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: 600, color: "#FAFAFA", margin: "0 0 12px" }}>Interactive Scope & Turnaround Calculator</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "40px", maxWidth: "600px" }}>
            Select the specific capabilities your enterprise requires to compute estimated delivery days in real-time.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px" }}>
            {/* Left: Toggles & Sliders */}
            <div>
              {/* Agent Fleet Size Slider */}
              <div style={{ marginBottom: "32px", background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA" }}>Agent Fleet Size</label>
                  <span style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
                    {agentCount} Autonomous Agents
                  </span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={25} 
                  value={agentCount} 
                  onChange={(e) => setAgentCount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#FAFAFA", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>
                  <span>1 Agent (Single Dept)</span>
                  <span>10 Agents (Multi-Dept)</span>
                  <span>25+ Agents (Full Fleet)</span>
                </div>
              </div>

              {/* Scope Checklist Toggles */}
              <div>
                <label style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA", display: "block", marginBottom: "16px" }}>Select Integration Modules & Features</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  {SCOPE_OPTIONS.map((item) => {
                    const isChecked = selectedScopes.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleScope(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px",
                          borderRadius: "12px",
                          background: isChecked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                          border: isChecked ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                          color: isChecked ? "#fff" : "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s"
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                          +{item.daysAdd}d
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Dynamic Summary Card */}
            <div style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                ESTIMATED TIMELINE
              </div>

              <div>
                <div style={{ fontSize: "36px", fontWeight: 700, color: "#FAFAFA", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {totalDaysMin} – {totalDaysMax} Days
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                  Guaranteed delivery turnaround
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>Selected Tier</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA" }}>
                  {SERVICE_TIERS.find(t => t.id === selectedTier)?.name}
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>Custom Modules ({selectedScopes.length})</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                  {selectedScopes.map(id => SCOPE_OPTIONS.find(s => s.id === id)?.label).join(", ") || "None"}
                </div>
              </div>

              <Link 
                href="/services/request"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#FAFAFA",
                  color: "#05050A",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  marginTop: "auto",
                  transition: "opacity 0.2s"
                }}
              >
                Submit Custom Specification <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Section 3: Direct Custom Specification Form ── */}
        <div style={{ 
          background: "rgba(255,255,255,0.02)", 
          border: "1px solid rgba(255,255,255,0.08)", 
          borderRadius: "24px", 
          padding: "48px 40px" 
        }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>03. Direct Brief</div>
            <h2 style={{ fontSize: "32px", fontWeight: 600, color: "#FAFAFA", margin: "0 0 12px" }}>Submit Your Custom Service Brief</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", maxWidth: "560px", margin: "0 auto" }}>
              Have specific engineering requirements? Send your custom requirements directly to our Lead Architecture Team.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FAFAFA" }}>Custom Brief Received</h3>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
                Our enterprise architecture team will review your specifications ({totalDaysMin}-{totalDaysMax} days estimated turnaround) and reach out to {requestForm.email || "you"} within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>Company / Organization Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Enterprises Africa" 
                  value={requestForm.companyName}
                  onChange={(e) => setRequestForm({ ...requestForm, companyName: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>Work Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "8px" }}>Custom Engineering Notes & Scope</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your custom workflow needs, integrations, or specific regulatory requirements..." 
                  value={requestForm.customNotes}
                  onChange={(e) => setRequestForm({ ...requestForm, customNotes: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  background: "#FAFAFA",
                  color: "#05050A",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px"
                }}
              >
                Submit Engineering Request <ArrowRightIcon size={16} />
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}
