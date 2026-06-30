import os

path = "src/app/dashboard/subscriptions/page.tsx"

content = '''"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { Package, Send, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";

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
  "Safura AI Food Scanner Integration",
  "NjiaSafe Fleet Analytics",
  "BX Omni Custom Deployment",
  "Cybersecurity Audit & SOC Monitoring",
  "Custom Software Development",
  "Other",
];

const BUDGETS = ["< $1,000", "$1,000 - $5,000", "$5,000 - $20,000", "$20,000+"];
const TIMELINES = ["ASAP", "Within 1 month", "1-3 months", "Flexible"];

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
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0.9rem 1.25rem",
            borderRadius: "12px",
            background: toast.kind === "success" ? "rgba(34,197,94,0.15)" : "rgba(255,51,102,0.15)",
            border: `1px solid ${toast.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(255,51,102,0.3)"}`,
            color: toast.kind === "success" ? "#22c55e" : "#FF3366",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {toast.kind === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className={styles.pageTitle}>My Requests & Services</h1>
          <p className={styles.pageDesc}>Track your service requests and submit new project inquiries.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={styles.btnPrimary}>
          <Send size={16} /> {showForm ? "Cancel" : "New Request"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.5rem" }}>Request a Service</h3>

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
              placeholder="you@company.com"
              style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Project Details</label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={4}
              placeholder="Describe what you need..."
              style={{ width: "100%", background: "#000", padding: "0.85rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <button onClick={handleSubmit} disabled={submitting} className={styles.btnPrimary} style={{ opacity: submitting ? 0.6 : 1 }}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      )}

      <section>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <Package size={24} color="#B14CFF" /> Your Requests
        </h2>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)", padding: "2rem" }}>
            <Loader2 size={18} /> Loading your requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            No service requests yet. Click "New Request" above to submit your first project inquiry.
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      whiteSpace: "nowrap",
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
'''

with open(path, "w") as f:
    f.write(content)

print(f"Wrote {path}")
