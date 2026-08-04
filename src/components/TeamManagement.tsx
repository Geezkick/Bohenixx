"use client";

import React, { useState, useEffect } from "react";
import styles from "./TeamManagement.module.css";
import { Users, UserPlus, Shield, CheckCircle2, Loader2 } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        if (data.members) setMembers(data.members);
      })
      .catch(console.error);
  }, []);

  const handleInvite = async () => {
    if (!email.trim() || isSending) return;

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });

      const data = await res.json();
      if (data.success && data.member) {
        setMembers(prev => [...prev, data.member]);
        setFeedback(`Invite sent to ${email}`);
        setEmail("");
      } else {
        setFeedback(data.error || "Failed to invite member");
      }
    } catch (e) {
      setFeedback("Network error sending invite");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Users color="#7B2DFF" size={24} />
          <h2 className={styles.title}>Enterprise Workspace Team & RBAC</h2>
        </div>
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
          Role-Based Access Control Enabled
        </span>
      </div>

      <div className={styles.inviteBox}>
        <input 
          type="email" 
          className={styles.input} 
          placeholder="colleague@organization.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSending}
        />
        <select 
          className={styles.input} 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          disabled={isSending}
        >
          <option value="ADMIN">Admin (Full Control)</option>
          <option value="MANAGER">Manager (Agent Exec)</option>
          <option value="AUDITOR">Auditor (Read & Logs)</option>
        </select>
        <button 
          className={styles.inviteBtn} 
          onClick={handleInvite}
          disabled={isSending || !email.trim()}
        >
          {isSending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          <span>Send Invite</span>
        </button>
      </div>

      {feedback && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#22c55e", background: "rgba(34, 197, 94, 0.1)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <div className={styles.memberList}>
        {members.map((m) => (
          <div key={m.id} className={styles.memberItem}>
            <div className={styles.memberInfo}>
              <div className={styles.avatar}>
                {m.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{m.name}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{m.email}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className={`
                ${styles.roleBadge} 
                ${m.role === "OWNER" ? styles.roleOwner : m.role === "ADMIN" ? styles.roleAdmin : styles.roleAuditor}
              `}>
                {m.role}
              </span>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
