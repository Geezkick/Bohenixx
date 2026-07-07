"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Users, Clock, Zap, UserCheck, UserPlus, BrainCircuit, CheckCircle2 } from "lucide-react";

const INITIAL_STAFF = [
  { id: 1, name: "Dr. Sarah Chen", role: "Attending", shift: "08:00 - 16:00", optimal: true },
  { id: 2, name: "Dr. Marcus Johnson", role: "Resident", shift: "12:00 - 20:00", optimal: false, alert: "Surge expected at 10:00" },
  { id: 3, name: "Nurse Emily Davis", role: "Triage Nurse", shift: "07:00 - 15:00", optimal: true },
  { id: 4, name: "Nurse Robert Lee", role: "ER Nurse", shift: "09:00 - 17:00", optimal: false, alert: "Understaffed post-17:00" },
];

export default function StaffingPage() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);

  const optimizeRota = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
      setStaff([
        { id: 1, name: "Dr. Sarah Chen", role: "Attending", shift: "08:00 - 16:00", optimal: true },
        { id: 2, name: "Dr. Marcus Johnson", role: "Resident", shift: "09:00 - 17:00", optimal: true, alert: "Shift shifted by AI to cover 10:00 surge." },
        { id: 3, name: "Nurse Emily Davis", role: "Triage Nurse", shift: "07:00 - 15:00", optimal: true },
        { id: 4, name: "Nurse Robert Lee", role: "ER Nurse", shift: "12:00 - 20:00", optimal: true, alert: "Shift shifted by AI to cover evening gap." },
      ]);
    }, 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#00E5FF" /> BX Staffing Engine
          </h1>
          <p className={styles.pageDesc}>AI-optimized clinical rotas based on predictive patient flow.</p>
        </div>
        {!optimized && (
          <button 
            onClick={optimizeRota}
            disabled={optimizing}
            style={{ 
              background: 'linear-gradient(135deg, #00B4D8, #00E5FF)', border: 'none', color: '#000', 
              padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: optimizing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            {optimizing ? <Clock size={18} className="spin" /> : <BrainCircuit size={18} />}
            {optimizing ? "Recalculating Shifts..." : "Optimize Rota via AI"}
          </button>
        )}
      </div>

      {/* AI Alert Banner */}
      {!optimized && (
        <div style={{ 
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', 
          padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' 
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
            <Zap size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Suboptimal Coverage Detected</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Patient scheduling data predicts a 45% surge in walk-ins tomorrow between 09:00 - 11:00. Current resident and ER nurse shifts will leave the clinic understaffed during this peak.
            </p>
          </div>
        </div>
      )}

      {optimized && (
        <div style={{ 
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px', 
          padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
            <CheckCircle2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Rota Optimized Successfully</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              AI has automatically shifted 2 staff members to cover the predicted morning surge and evening gap. Automated SMS schedule updates have been sent to affected staff.
            </p>
          </div>
        </div>
      )}

      {/* Rota Grid */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>Staff Member</th>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>Assigned Shift</th>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>AI Status</th>
            </tr>
          </thead>
          <tbody style={{ transition: 'all 0.5s ease' }}>
            {staff.map(person => (
              <tr key={person.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: person.optimal ? 'transparent' : 'rgba(245,158,11,0.05)' }}>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5FF' }}>
                      <UserCheck size={20} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{person.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255,255,255,0.6)' }}>{person.role}</td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ 
                    padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace',
                    background: person.optimal ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.2)',
                    color: person.optimal ? '#fff' : '#f59e0b', border: `1px solid ${person.optimal ? 'rgba(255,255,255,0.1)' : 'rgba(245,158,11,0.4)'}`
                  }}>
                    {person.shift}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  {person.optimal ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> {person.alert || "Optimal Assignment"}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Zap size={16} /> {person.alert}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
