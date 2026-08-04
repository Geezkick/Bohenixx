"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./LiveDemoShowcase.module.css";
import { Play, DollarSign, Calculator, Smartphone, CheckCircle, ArrowRight, Zap, Loader2, ShieldCheck } from "lucide-react";

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

    await new Promise(r => setTimeout(r, 1000));
    setMpesaLogs(prev => [...prev, `[00:00:03] Customer entered M-Pesa PIN on handset...`]);

    await new Promise(r => setTimeout(r, 1200));
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
          <Zap size={14} color="#00F0FF" />
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
            <Smartphone color="#22c55e" size={22} />
            <span>M-Pesa Autonomous Payment Demo</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>
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
            className={styles.actionBtn}
            onClick={handleSimulateMpesa}
            disabled={isSimulatingMpesa}
          >
            {isSimulatingMpesa ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing STK Push...</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Trigger M-Pesa STK Push Demo</span>
              </>
            )}
          </button>

          {mpesaLogs.length > 0 && (
            <div className={styles.terminalOutput}>
              {mpesaLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes("Receipt") ? "#00F0FF" : log.includes("Callback") ? "#22c55e" : "#a78bfa" }}>
                  {log}
                </div>
              ))}
              {mpesaSuccess && (
                <div style={{ marginTop: "0.5rem", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <CheckCircle size={16} /> Transaction Reconciled & Logged to Audit Trail!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: Interactive Operational ROI Calculator */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Calculator color="#7B2DFF" size={22} />
            <span>AI Workforce ROI & Cost Calculator</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#9CA3AF", margin: 0 }}>
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
              <span className={styles.resultValue} style={{ color: "#22c55e" }}>KES {annualSavings.toLocaleString()}</span>
              <span className={styles.resultLabel}>Annual Savings (ROI)</span>
            </div>
          </div>

          <div style={{ padding: "0.75rem", background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "10px", fontSize: "0.85rem", color: "#22c55e", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={18} />
            <span>Projected 82% Overhead Reduction with 24/7 Uptime</span>
          </div>

          <Link href="/dashboard/onboarding" className={styles.actionBtn} style={{ textDecoration: "none", marginTop: "auto" }}>
            <span>Deploy Your AI Workforce Fleet</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
