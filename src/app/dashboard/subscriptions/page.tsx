"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { 
  Package, Send, CheckCircle2, XCircle, Clock, Loader2, 
  BrainCircuit, Activity, FileText, CalendarCheck, MessageSquareHeart,
  TrendingUp, ShieldCheck, AlertCircle, Zap
} from "lucide-react";

type ServiceRequestItem = {
  id: string;
  service: string;
  budget: string;
  timeline: string;
  details: string;
  status: string;
  createdAt: string;
};

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Pending Review" },
  IN_PROGRESS: { bg: "rgba(0,229,255,0.1)", color: "#00E5FF", label: "In Progress" },
  COMPLETED: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", label: "Completed" },
  REJECTED: { bg: "rgba(255,51,102,0.1)", color: "#FF3366", label: "Rejected" },
};

const SERVICES = [
  "BX Medical Billing Integration",
  "BX Patient Triaging AI Setup",
  "BX Patient Experience Deployment",
  "Custom EMR / EHR Integration",
  "Cybersecurity Audit & HIPAA Compliance",
  "Other",
];

const BUDGETS = ["< $1,000", "$1,000 - $5,000", "$5,000 - $20,000", "$20,000+"];
const TIMELINES = ["ASAP", "Within 1 month", "1-3 months", "Flexible"];

// Simulated live AI operations
const AI_OPERATIONS = [
  { id: 1, status: "active", icon: <ShieldCheck size={16} />, color: "#22c55e", message: "AI is auditing 12 pending insurance claims for ICD-10 compliance.", time: "2 min ago" },
  { id: 2, status: "active", icon: <TrendingUp size={16} />, color: "#00E5FF", message: "Predictive model recalibrating patient appointment queue for tomorrow based on historical no-show data.", time: "5 min ago" },
  { id: 3, status: "completed", icon: <CheckCircle2 size={16} />, color: "#22c55e", message: "Automated copay reconciliation completed for 47 transactions. 3 discrepancies flagged.", time: "12 min ago" },
  { id: 4, status: "active", icon: <AlertCircle size={16} />, color: "#f59e0b", message: "Flu season alert: Patient intake volume predicted to increase 30% this week. Staffing adjustments recommended.", time: "18 min ago" },
  { id: 5, status: "completed", icon: <Zap size={16} />, color: "#B14CFF", message: "Patient experience sentiment analysis complete. Overall satisfaction: 94.2% (+2.1% from last month).", time: "25 min ago" },
];

export default function SubscriptionsPage() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    service: SERVICES[0],
    budget: BUDGETS[0],
    timeline: TIMELINES[0],
    details: "",
    email: "",
  });

  const loadRequests = () => {
    setLoading(true);
    fetch("/api/services/request")
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) setRequests(data.requests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const showToast = (message: string, kind: "success" | "error") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!form.email.trim() || !form.details.trim()) {
      showToast("Please fill in your email and project details", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to submit request", "error");
        return;
      }
      showToast("Service request submitted successfully", "success");
      setShowForm(false);
      setForm({ service: SERVICES[0], budget: BUDGETS[0], timeline: TIMELINES[0], details: "", email: "" });
      loadRequests();
    } catch {
      showToast("Failed to submit request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <div
          style={{
            position: "fixed", top: 24, right: 24, zIndex: 1000,
            display: "flex", alignItems: "center", gap: "10px",
            padding: "0.9rem 1.25rem", borderRadius: "12px",
            background: toast.kind === "success" ? "rgba(34,197,94,0.15)" : "rgba(255,51,102,0.15)",
            border: `1px solid ${toast.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(255,51,102,0.3)"}`,
            color: toast.kind === "success" ? "#22c55e" : "#FF3366",
            fontWeight: 600, fontSize: "0.9rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {toast.kind === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className={styles.pageTitle}>Clinic Command Center</h1>
          <p className={styles.pageDesc}>Manage your AI-powered healthcare operations, products, and service requests.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={styles.btnPrimary}>
          <Send size={16} /> {showForm ? "Cancel" : "New Service Request"}
        </button>
      </div>

      {/* ─── Healthcare App Cards ─── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <Package size={24} color="#B14CFF" /> Active Healthcare Modules
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* BX POS Card */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(17,17,20,0.8) 0%, rgba(5,5,5,0.9) 100%)',
            border: '1px solid rgba(177,76,255,0.3)', borderRadius: '20px', padding: '1.5rem',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8B2EFF, #B14CFF)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/bohenixx.png" alt="Bohenix Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </div>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                AI POWERED
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>BX Medical POS</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              AI-integrated pharmacy & clinic POS. Drug interaction warnings, predictive inventory, and M-Pesa / Stripe billing.
            </p>
            <a href="/dashboard/pos" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #8B2EFF, #B14CFF)',
              color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Launch Terminal
            </a>
          </div>

          {/* BX Medical Billing */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(17,17,20,0.8) 0%, rgba(5,5,5,0.9) 100%)',
            border: '1px solid rgba(0,229,255,0.2)', borderRadius: '20px', padding: '1.5rem',
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #00B4D8, #00E5FF)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5FF' }}>
                <FileText size={24} />
              </div>
              <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                AI AUTOMATED
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>BX Medical Billing</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
              AI-automated medical invoices and insurance claim processing. Generate ICD-10 compliant bills instantly.
            </p>
            <a href="/dashboard/invoices" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '0.75rem', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)',
              color: '#00E5FF', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Launch Billing
            </a>
          </div>

          {/* BX Patient Triaging & Scheduling */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(17,17,20,0.8) 0%, rgba(5,5,5,0.9) 100%)',
            border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '1.5rem',
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #e67e22, #f59e0b)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <CalendarCheck size={24} />
              </div>
              <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                AI TRIAGING
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>BX Patient Scheduling</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
              AI analyzes patient symptoms to prioritize urgent appointments. Smart queue management and automated reminders.
            </p>
            <a href="/dashboard/appointments" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
              color: '#f59e0b', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Launch Scheduler
            </a>
          </div>

          {/* BX Patient Experience */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(17,17,20,0.8) 0%, rgba(5,5,5,0.9) 100%)',
            border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', padding: '1.5rem',
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #16a34a, #22c55e)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                <MessageSquareHeart size={24} />
              </div>
              <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                SENTIMENT AI
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>BX Patient Experience</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>
              Collect patient outcome surveys and clinical feedback. AI-powered sentiment analysis for care quality insights.
            </p>
            <a href="/dashboard/testimonials" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: '#22c55e', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Launch Experience Hub
            </a>
          </div>
        </div>
      </section>

      {/* ─── Live AI Operations Feed ─── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <BrainCircuit size={24} color="#B14CFF" /> Live AI Operations
        </h2>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          {AI_OPERATIONS.map((op, idx) => (
            <div key={op.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1.25rem 1.5rem',
              borderBottom: idx < AI_OPERATIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: `${op.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: op.color, marginTop: '2px'
              }}>
                {op.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, marginBottom: '4px' }}>
                  {op.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{op.time}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                    padding: '2px 6px', borderRadius: '4px',
                    background: op.status === 'active' ? 'rgba(0,229,255,0.1)' : 'rgba(34,197,94,0.1)',
                    color: op.status === 'active' ? '#00E5FF' : '#22c55e',
                  }}>
                    {op.status === 'active' ? '● Processing' : '✓ Done'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Service Request Form ─── */}
      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.5rem" }}>Request a Healthcare Integration</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Service</label>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              >
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Budget</label>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              >
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Timeline</label>
              <select
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              >
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Your Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@hospital.com"
              style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Project Details</label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={4}
              placeholder="Describe your healthcare integration requirements..."
              style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <button onClick={handleSubmit} disabled={submitting} className={styles.btnPrimary} style={{ opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      )}

      {/* ─── Request History ─── */}
      <section>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <Activity size={24} color="#B14CFF" /> Your Integration Requests
        </h2>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)", padding: "2rem" }}>
            <Loader2 size={18} /> Loading your requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            No service requests yet. Click &ldquo;New Service Request&rdquo; above to submit your first integration inquiry.
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
            {requests.map((r) => {
              const statusInfo = statusStyles[r.status] || statusStyles.PENDING;
              return (
                <div key={r.id} className={styles.listItem} style={{ padding: "1.75rem 1.5rem", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.itemTitle}>{r.service}</div>
                    <div className={styles.itemDesc} style={{ marginBottom: "0.5rem" }}>
                      Budget: {r.budget} • Timeline: {r.timeline}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                      Submitted {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "6px 14px", borderRadius: "999px",
                      fontSize: "0.78rem", fontWeight: 700,
                      background: statusInfo.bg, color: statusInfo.color, whiteSpace: "nowrap",
                    }}
                  >
                    <Clock size={12} /> {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
