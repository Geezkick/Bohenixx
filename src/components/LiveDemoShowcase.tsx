"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./LiveDemoShowcase.module.css";
import { Play, Calculator, CheckCircle, ArrowRight, Zap, Loader2, ShieldCheck, Terminal } from "lucide-react";

// Official Safaricom M-Pesa Brand Icon Component
function MpesaIcon({ size = 20 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "6px",
      background: "#00A859",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      fontSize: `${Math.round(size * 0.55)}px`,
      fontFamily: "sans-serif",
      letterSpacing: "-0.05em",
      boxShadow: "0 0 12px rgba(0, 168, 89, 0.4)",
      flexShrink: 0
    }}>
      M
    </div>
  );
}

export default function LiveDemoShowcase() {
  // Demo State
  const [phoneNumber, setPhoneNumber] = useState("254712345678");
  const [amountKes, setAmountKes] = useState("4500");
  const [isSimulatingMpesa, setIsSimulatingMpesa] = useState(false);
  const [mpesaLogs, setMpesaLogs] = useState<string[]>([]);
  const [mpesaSuccess, setMpesaSuccess] = useState(false);

  // ROI Calculator State
  const [headcount, setHeadcount] = useState("6");
  const [monthlyCostKes, setMonthlyCostKes] = useState("240000");

  const currentMonthly = parseFloat(monthlyCostKes) || 240000;
  const projectedMonthlyAi = Math.round(currentMonthly * 0.18); // 82% savings
  const monthlySavings = currentMonthly - projectedMonthlyAi;
  const annualSavings = monthlySavings * 12;

  const handleSimulateMpesa = async () => {
    if (!phoneNumber || !amountKes || isSimulatingMpesa) return;

    setIsSimulatingMpesa(true);
    setMpesaSuccess(false);
    setMpesaLogs([
      `[00:00:01] Initiating Daraja STK Push trigger to +${phoneNumber}...`,
      `[00:00:02] STK Request Sent. MerchantReqID: WS_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    ]);

    await new Promise(r => setTimeout(r, 900));
    setMpesaLogs(prev => [...prev, `[00:00:03] Customer entered M-Pesa PIN on handset...`]);

    await new Promise(r => setTimeout(r, 1100));
    const receipt = "OHT" + Math.random().toString(36).substring(2, 8).toUpperCase() + "KES";
    setMpesaLogs(prev => [
      ...prev,
      `[00:00:04] Callback Received! M-Pesa Receipt: #${receipt}`,
      `[00:00:05] Finance Agent matched #${receipt} with Invoice #INV-89201 for KES ${parseFloat(amountKes).toLocaleString()}`,
      `[00:00:06] Neural Core Knowledge Node Edge created: [Invoice] ↔ [M-Pesa Callback]`
    ]);

    setMpesaSuccess(true);
    setIsSimulatingMpesa(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <Zap size={13} />
          <span>Show, Don't Just Tell — Live Pitch Demo</span>
        </div>
        <h2 className={styles.title}>Experience the Bohenix Engine in Real-Time</h2>
        <p className={styles.subtitle}>
          Simulate an automated M-Pesa payment reconciliation or calculate your company's operational cost savings with AI.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Card 1: Live M-Pesa Reconciliation Simulator */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <MpesaIcon size={24} />
            <span>M-Pesa Autonomous Payment Demo</span>
            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", background: "rgba(0, 168, 89, 0.15)", border: "1px solid rgba(0, 168, 89, 0.3)", color: "#00A859", padding: "0.2rem 0.5rem", borderRadius: "4px", marginLeft: "auto" }}>
              Daraja API 2.0
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)", margin: 0, lineHeight: 1.5 }}>
            Test how Bohenix Finance Agents process Daraja STK push callbacks and auto-reconcile invoices in under 0.5s.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>Test Phone Number (Safaricom)</label>
            <input 
              type="text" 
              className={styles.input} 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSimulatingMpesa}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Invoice Amount (KES)</label>
            <input 
              type="number" 
              className={styles.input} 
              value={amountKes} 
              onChange={(e) => setAmountKes(e.target.value)}
              disabled={isSimulatingMpesa}
            />
          </div>

          <button 
            className={styles.mpesaBtn}
            onClick={handleSimulateMpesa}
            disabled={isSimulatingMpesa}
          >
            {isSimulatingMpesa ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing STK Push...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Trigger M-Pesa STK Push Demo</span>
              </>
            )}
          </button>

          {mpesaLogs.length > 0 && (
            <div className={styles.terminalOutput}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.7rem", fontFamily: "monospace", color: "rgba(255, 255, 255, 0.3)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "6px", marginBottom: "4px" }}>
                <Terminal size={12} />
                <span>Daraja Callback Logs</span>
              </div>
              {mpesaLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes("Receipt") ? "#00A859" : log.includes("Callback") ? "#FAFAFA" : "rgba(255, 255, 255, 0.6)" }}>
                  {log}
                </div>
              ))}
              {mpesaSuccess && (
                <div style={{ marginTop: "0.5rem", color: "#00A859", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
                  <CheckCircle size={15} /> Transaction Reconciled & Logged to Audit Trail!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Interactive Operational ROI Calculator */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Calculator color="#FAFAFA" size={20} />
            <span>AI Workforce ROI & Cost Calculator</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)", margin: 0, lineHeight: 1.5 }}>
            Estimate your monthly and annual savings when replacing manual ops with autonomous AI agents.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>Current Operations Team Size (Staff Count)</label>
            <input 
              type="number" 
              className={styles.input} 
              value={headcount} 
              onChange={(e) => setHeadcount(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Current Monthly Payroll / Ops Expense (KES)</label>
            <input 
              type="number" 
              className={styles.input} 
              value={monthlyCostKes} 
              onChange={(e) => setMonthlyCostKes(e.target.value)}
            />
          </div>

          <div className={styles.resultsGrid}>
            <div className={styles.resultBox}>
              <span className={styles.resultValue}>KES {monthlySavings.toLocaleString()}</span>
              <span className={styles.resultLabel}>Monthly Cost Savings</span>
            </div>
            <div className={styles.resultBox}>
              <span className={styles.resultValue} style={{ color: "#FAFAFA" }}>KES {annualSavings.toLocaleString()}</span>
              <span className={styles.resultLabel}>Annual Savings (ROI)</span>
            </div>
          </div>

          <div style={{ padding: "0.75rem 1rem", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.7)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={16} color="#00A859" />
            <span>Projected 82% Overhead Reduction with 24/7 Uptime</span>
          </div>

          <Link href="/dashboard/onboarding" className={styles.actionBtn} style={{ textDecoration: "none", marginTop: "auto" }}>
            <span>Deploy Your AI Workforce Fleet</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
