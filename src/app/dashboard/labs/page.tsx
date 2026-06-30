"use client";

import React, { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { FlaskConical, Lock, CheckCircle2 } from "lucide-react";

const labs = [
  {
    id: "bx-omni-v2",
    name: "BX Omni v2.0 Agent",
    badge: "OPEN BETA",
    badgeColor: "#B14CFF",
    icon: FlaskConical,
    desc: "Test the next generation of our autonomous business operations twin. Features advanced multi-agent orchestration and self-healing pipelines.",
  },
  {
    id: "agri-exchange",
    name: "Tokenized Agri-Exchange",
    badge: "IN DEVELOPMENT",
    badgeColor: "rgba(255,255,255,0.3)",
    icon: Lock,
    desc: "A decentralized platform for trading tokenized agricultural commodities. Slated for release in Q4 2026.",
  },
];

export default function LabsPage() {
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/labs/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.labIds) setJoinedIds(data.labIds);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (labId: string, labName: string) => {
    setPendingId(labId);
    try {
      const res = await fetch("/api/labs/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId, labName }),
      });
      if (res.ok) {
        setJoinedIds((prev) => [...prev, labId]);
      }
    } finally {
      setPendingId(null);
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <h1 className={styles.pageTitle} style={{ margin: 0 }}>BX Labs Insider</h1>
        <span style={{ background: "rgba(177, 76, 255, 0.2)", color: "#B14CFF", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "1px" }}>CONFIDENTIAL</span>
      </div>
      <p className={styles.pageDesc}>Exclusive early access, beta testing, and roadmap updates directly from the Bohenix research division.</p>

      <div className={styles.grid}>
        {labs.map((lab) => {
          const Icon = lab.icon;
          const isJoined = joinedIds.includes(lab.id);
          const isPending = pendingId === lab.id;

          return (
            <div key={lab.id} className={styles.card} style={{ border: lab.id === "bx-omni-v2" ? "1px solid rgba(177, 76, 255, 0.3)" : undefined, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: "0.5rem 1rem", background: lab.badgeColor, color: lab.badgeColor === "rgba(255,255,255,0.3)" ? "#fff" : "#fff", fontSize: "0.75rem", fontWeight: 700, borderBottomLeftRadius: "16px" }}>
                {lab.badge}
              </div>
              <Icon size={32} color={lab.id === "bx-omni-v2" ? "#B14CFF" : "#00E5FF"} style={{ marginBottom: "1.5rem" }} />
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>{lab.name}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>{lab.desc}</p>

              {loading ? (
                <div style={{ height: "52px" }} />
              ) : isJoined ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "0.85rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} /> You're on the list
                </div>
              ) : (
                <button
                  onClick={() => handleJoin(lab.id, lab.name)}
                  disabled={isPending}
                  className={lab.id === "bx-omni-v2" ? styles.btnPrimary : styles.btnSecondary}
                  style={{ width: "100%", justifyContent: "center", opacity: isPending ? 0.6 : 1 }}
                >
                  {isPending ? "Joining..." : "Join Waitlist"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
