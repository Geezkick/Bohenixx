"use client";

import React, { useEffect, useState } from "react";
import styles from "./dna.module.css";
import { Shield, BrainCircuit, Activity, Edit3, Target, CheckCircle2, AlertTriangle, Network } from "lucide-react";

export default function CompanyDNAPage() {
  const [dna, setDna] = useState<any>(null);
  const [knowledgeNodes, setKnowledgeNodes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock fetch function, in a real scenario we'd call an API.
  // For the sake of this prototype, we'll simulate the data that the Onboarding API created.
  useEffect(() => {
    // In production, fetch from /api/dna
    setTimeout(() => {
      setDna({
        mission: "To operate efficiently, scale autonomously, and maximize ROI.",
        vision: "A fully autonomous enterprise.",
        operatingRules: [
          "Always optimize for capital efficiency.",
          "Require human approval for high-risk actions.",
          "Maintain complete audit logs for financial transactions."
        ],
        riskAppetite: "MODERATE",
        budgetLimitsKes: 100000
      });

      setKnowledgeNodes([
        { id: '1', label: 'Executive Office', type: 'DEPARTMENT' },
        { id: '2', label: 'Agent: Alex (CEO)', type: 'AGENT' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <textarea className={styles.editInput} defaultValue={dna.mission} />
              ) : (
                <div className={styles.fieldValue}>{dna.mission}</div>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Strategic Vision</div>
              {isEditing ? (
                <textarea className={styles.editInput} defaultValue={dna.vision} />
              ) : (
                <div className={styles.fieldValue}>{dna.vision}</div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Shield size={24} color="#7B2DFF" />
              Operating Rules & Constraints
            </div>
            <ul className={styles.ruleList}>
              {dna.operatingRules.map((rule: string, idx: number) => (
                <li key={idx} className={styles.ruleItem}>
                  <CheckCircle2 size={18} className={styles.ruleIcon} />
                  <span className={styles.fieldValue} style={{ fontSize: '1rem' }}>{rule}</span>
                </li>
              ))}
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
              <button className={styles.btn} onClick={() => setIsEditing(!isEditing)}>
                <Edit3 size={16} /> {isEditing ? "Save" : "Adjust"}
              </button>
            </div>
            
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabel}>Current Posture</div>
              <div className={styles.riskLabel} style={{ color: getRiskColor(dna.riskAppetite) }}>
                {dna.riskAppetite}
              </div>
              <div className={styles.riskMeter}>
                <div className={styles.riskTrack}>
                  <div 
                    className={styles.riskFill} 
                    style={{ 
                      width: getRiskWidth(dna.riskAppetite), 
                      background: getRiskColor(dna.riskAppetite) 
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
              <div className={styles.fieldValue} style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                KSh {dna.budgetLimitsKes.toLocaleString()}
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Network size={24} color="#7B2DFF" />
              Live Knowledge Graph
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Visualizing the active nodes established during corporate onboarding.
            </p>
            
            <div className={styles.knowledgeGraphVisualizer}>
              <div className={styles.node} style={{ top: '20%', left: '10%' }}>
                {knowledgeNodes[0]?.label || "Root"}
              </div>
              <div className={styles.line} style={{ top: '35%', left: '45%', width: '60px', transform: 'rotate(15deg)' }}></div>
              <div className={styles.node} style={{ top: '50%', right: '10%', background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' }}>
                {knowledgeNodes[1]?.label || "Agent"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
