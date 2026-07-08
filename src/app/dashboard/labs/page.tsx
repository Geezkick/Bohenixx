"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../dashboard.module.css";
import { FlaskConical, Lock, CheckCircle2, Activity, Cpu, Network, Database, ChevronRight, FileText, Download } from "lucide-react";

const labs = [
  {
    id: "bx-omni-v2",
    name: "BX Omni v2.0 Agent",
    badge: "OPEN BETA",
    badgeColor: "#B14CFF",
    icon: FlaskConical,
    desc: "Test the next generation of our autonomous business operations twin. Features advanced multi-agent orchestration and self-healing pipelines.",
    tech: ["Vector DBs", "RAG Engine", "Swarm Architecture", "Self-Healing"],
    phase: "Phase 3: Multi-Agent Collaboration Testing",
    progress: 75
  },
  {
    id: "agri-exchange",
    name: "Tokenized Agri-Exchange",
    badge: "IN DEVELOPMENT",
    badgeColor: "rgba(255,255,255,0.3)",
    icon: Lock,
    desc: "A decentralized platform for trading tokenized agricultural commodities. Slated for release in Q4 2026. Built on high-throughput proprietary ledgers.",
    tech: ["Smart Contracts", "Zero-Knowledge Proofs", "IoT Oracles"],
    phase: "Phase 1: Architecture & Cryptoeconomic Design",
    progress: 25
  },
];

const researchPapers = [
  { title: "Autonomous Swarm Intelligence in ERP Systems", date: "June 2026", size: "2.4 MB" },
  { title: "Latency Mitigation in Edge-Deployed LLMs", date: "April 2026", size: "1.8 MB" },
  { title: "Zero-Knowledge Commodity Tokenization", date: "January 2026", size: "3.1 MB" }
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
      <p className={styles.pageDesc} style={{ maxWidth: '800px' }}>Exclusive early access, beta testing, and roadmap updates directly from the Bohenix research division. The technologies below are highly experimental and represent the future of the Bohenix ONE ecosystem.</p>

      {/* Telemetry Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '12px' }}><Activity color="#00E5FF" size={24} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#B3B3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Active Nodes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>1,204</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', background: 'rgba(177, 76, 255, 0.1)', borderRadius: '12px' }}><Cpu color="#B14CFF" size={24} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#B3B3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Compute Load</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>84.2%</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '10px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}><Network color="#22c55e" size={24} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#B3B3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Global Testers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>482</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {labs.map((lab) => {
            const Icon = lab.icon;
            const isJoined = joinedIds.includes(lab.id);
            const isPending = pendingId === lab.id;

            return (
              <div key={lab.id} className={styles.card} style={{ border: lab.id === "bx-omni-v2" ? "1px solid rgba(177, 76, 255, 0.3)" : undefined, position: "relative", overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: "absolute", top: 0, right: 0, padding: "0.5rem 1rem", background: lab.badgeColor, color: lab.badgeColor === "rgba(255,255,255,0.3)" ? "#fff" : "#fff", fontSize: "0.75rem", fontWeight: 700, borderBottomLeftRadius: "16px" }}>
                  {lab.badge}
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: lab.id === "bx-omni-v2" ? "rgba(177, 76, 255, 0.1)" : "rgba(255,255,255,0.05)", display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={32} color={lab.id === "bx-omni-v2" ? "#B14CFF" : "#00E5FF"} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem", color: '#fff' }}>{lab.name}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>{lab.desc}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#B3B3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.75rem' }}>Core Technologies</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {lab.tech.map(t => (
                      <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', color: '#E0E0E0' }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{lab.phase}</span>
                    <span style={{ fontSize: '0.85rem', color: lab.id === "bx-omni-v2" ? "#B14CFF" : "#00E5FF", fontWeight: 700 }}>{lab.progress}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${lab.progress}%`, background: lab.id === "bx-omni-v2" ? "linear-gradient(90deg, #7B2DFF, #00E5FF)" : "#00E5FF", borderRadius: '999px' }} />
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  {loading ? (
                    <div style={{ height: "48px" }} />
                  ) : isJoined ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "1rem 1.5rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={20} /> Access Granted. You're on the list.</div>
                      <button className={styles.btnPrimary} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#22c55e', color: '#000' }}>View Docs</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(lab.id, lab.name)}
                      disabled={isPending}
                      className={lab.id === "bx-omni-v2" ? styles.btnPrimary : styles.btnSecondary}
                      style={{ width: "100%", justifyContent: "center", padding: '1rem', fontSize: '1rem', opacity: isPending ? 0.6 : 1 }}
                    >
                      {isPending ? "Authenticating Request..." : "Request Beta Access"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar: Research Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.card} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Database size={20} color="#7B2DFF" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#fff' }}>Research Papers</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {researchPapers.map((paper, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                  <FileText size={24} color="#B3B3B8" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: '0 0 0.25rem 0', fontWeight: 500, lineHeight: 1.4 }}>{paper.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#737373' }}>{paper.date}</span>
                      <span style={{ fontSize: '0.75rem', color: '#7B2DFF', fontWeight: 600 }}>{paper.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(177, 76, 255, 0.1) 0%, rgba(5,5,5,0.9) 100%)', border: '1px solid rgba(177, 76, 255, 0.2)' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#fff' }}>Developer API Access</h3>
             <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.5rem' }}>Get programmatic access to experimental models via the Bohenix Developer Portal.</p>
             <Link href="/dashboard/developer" className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
                Go to Portal <ChevronRight size={16} />
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}
