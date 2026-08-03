"use client";

import React, { useEffect, useState } from "react";
import styles from "./dna.module.css";
import { Shield, Activity, Edit3, Target, CheckCircle2, AlertTriangle, Network, Save, Loader2 } from "lucide-react";

export default function CompanyDNAPage() {
  const [dna, setDna] = useState<any>(null);
  const [knowledgeNodes, setKnowledgeNodes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    mission: "",
    vision: "",
    riskAppetite: "MODERATE",
    budgetLimitsKes: 100000
  });

  const fetchDna = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dna");
      const data = await res.json();
      if (data.success) {
        setDna(data.dna);
        setKnowledgeNodes(data.knowledgeNodes || []);
        setEditForm({
          mission: data.dna.mission || "",
          vision: data.dna.vision || "",
          riskAppetite: data.dna.riskAppetite || "MODERATE",
          budgetLimitsKes: data.dna.budgetLimitsKes || 100000
        });
      }
    } catch (err) {
      console.error("Failed to load DNA:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDna();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/dna", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setDna(data.dna);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save DNA:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="animate-spin text-[#7B2DFF]"><Activity size={48} /></div>
      </div>
    );
  }

  const getRiskColor = (appetite: string) => {
    if (appetite === "CONSERVATIVE") return "#22c55e";
    if (appetite === "MODERATE") return "#ffbd2e";
    return "#ff5f56";
  };

  const getRiskWidth = (appetite: string) => {
    if (appetite === "CONSERVATIVE") return "33%";
    if (appetite === "MODERATE") return "66%";
    return "100%";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Company DNA</h1>
          <p className={styles.subtitle}>The fundamental rules, vision, and constraints governing the Neural Core.</p>
        </div>
        <div className={styles.statusBadge}>
          <div className={styles.statusDot}></div>
          Neural Core Active
        </div>
      </div>

      <div className={styles.grid}>
        {/* Core Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Target size={24} color="#7B2DFF" />
              Organizational Identity
            </div>
            
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Core Mission</div>
              {isEditing ? (
                <textarea 
                  className={styles.editInput} 
                  value={editForm.mission}
                  onChange={(e) => setEditForm({ ...editForm, mission: e.target.value })}
                  rows={3}
                />
              ) : (
                <div className={styles.fieldValue}>{dna?.mission || "Not defined"}</div>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Strategic Vision</div>
              {isEditing ? (
                <textarea 
                  className={styles.editInput} 
                  value={editForm.vision}
                  onChange={(e) => setEditForm({ ...editForm, vision: e.target.value })}
                  rows={3}
                />
              ) : (
                <div className={styles.fieldValue}>{dna?.vision || "Not defined"}</div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Shield size={24} color="#7B2DFF" />
              Operating Rules & Constraints
            </div>
            <ul className={styles.ruleList}>
              {Array.isArray(dna?.operatingRules) ? (
                dna.operatingRules.map((rule: string, idx: number) => (
                  <li key={idx} className={styles.ruleItem}>
                    <CheckCircle2 size={18} className={styles.ruleIcon} />
                    <span className={styles.fieldValue} style={{ fontSize: '1rem' }}>{rule}</span>
                  </li>
                ))
              ) : (
                <li className={styles.ruleItem}>
                  <CheckCircle2 size={18} className={styles.ruleIcon} />
                  <span className={styles.fieldValue} style={{ fontSize: '1rem' }}>Optimize capital efficiency and retain human oversight for critical actions.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Risk & Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className={styles.card}>
            <div className={styles.cardTitle} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <AlertTriangle size={24} color="#ffbd2e" />
                Risk Appetite
              </div>
              {isEditing ? (
                <button className={styles.btn} onClick={handleSave} disabled={saving} style={{ background: "#7B2DFF", color: "#fff", borderColor: "#7B2DFF" }}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
              ) : (
                <button className={styles.btn} onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} /> Adjust
                </button>
              )}
            </div>
            
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Current Posture</div>
              {isEditing ? (
                <select 
                  className={styles.editInput}
                  value={editForm.riskAppetite}
                  onChange={(e) => setEditForm({ ...editForm, riskAppetite: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", color: "#fff", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <option value="CONSERVATIVE" style={{ background: "#111" }}>CONSERVATIVE</option>
                  <option value="MODERATE" style={{ background: "#111" }}>MODERATE</option>
                  <option value="AGGRESSIVE" style={{ background: "#111" }}>AGGRESSIVE</option>
                </select>
              ) : (
                <div className={styles.riskLabel} style={{ color: getRiskColor(dna?.riskAppetite || "MODERATE") }}>
                  {dna?.riskAppetite || "MODERATE"}
                </div>
              )}

              <div className={styles.riskMeter} style={{ marginTop: '0.75rem' }}>
                <div className={styles.riskTrack}>
                  <div 
                    className={styles.riskFill} 
                    style={{ 
                      width: getRiskWidth(editForm.riskAppetite), 
                      background: getRiskColor(editForm.riskAppetite) 
                    }}
                  />
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '1rem', lineHeight: 1.5 }}>
                The Neural Core will auto-approve actions below this risk threshold. Actions exceeding this threshold will be routed to the Human CEO for approval.
              </p>
            </div>

            <div className={styles.fieldGroup} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginBottom: 0 }}>
              <div className={styles.fieldLabel}>Global Budget Limit (KES)</div>
              {isEditing ? (
                <input 
                  type="number" 
                  className={styles.editInput}
                  value={editForm.budgetLimitsKes}
                  onChange={(e) => setEditForm({ ...editForm, budgetLimitsKes: parseFloat(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", color: "#fff", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "1.2rem", fontWeight: 700 }}
                />
              ) : (
                <div className={styles.fieldValue} style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  KSh {(dna?.budgetLimitsKes || 100000).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Network size={24} color="#7B2DFF" />
              Live Knowledge Graph
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Visualizing active nodes established in the corporate neural core.
            </p>
            
            <div className={styles.knowledgeGraphVisualizer}>
              <div className={styles.node} style={{ top: '20%', left: '10%' }}>
                {knowledgeNodes[0]?.label || "Root Node"}
              </div>
              <div className={styles.line} style={{ top: '35%', left: '45%', width: '60px', transform: 'rotate(15deg)' }}></div>
              <div className={styles.node} style={{ top: '50%', right: '10%', background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' }}>
                {knowledgeNodes[1]?.label || "Executive Agent"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
