"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard.module.css";
import { HeartPulse, Activity, AlertCircle, Watch, Smartphone, ShieldCheck } from "lucide-react";

export default function VitalsPage() {
  const [pulse, setPulse] = useState(72);
  const [anomaly, setAnomaly] = useState(false);

  // Simulate real-time vitals
  useEffect(() => {
    const interval = setInterval(() => {
      if (!anomaly) {
        setPulse(prev => {
          const newPulse = prev + (Math.random() > 0.5 ? 1 : -1);
          return newPulse > 85 ? 85 : newPulse < 65 ? 65 : newPulse;
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [anomaly]);

  const triggerAnomaly = () => {
    setAnomaly(true);
    setPulse(135);
    setTimeout(() => {
      setAnomaly(false);
      setPulse(78);
    }, 5000);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HeartPulse color="#FF3366" /> BX Vitals (IoT)
          </h1>
          <p className={styles.pageDesc}>Continuous remote patient monitoring via consumer wearables.</p>
        </div>
        <button 
          onClick={triggerAnomaly}
          disabled={anomaly}
          style={{ 
            background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', color: '#FF3366', 
            padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: anomaly ? 'not-allowed' : 'pointer'
          }}
        >
          Simulate AFib Anomaly
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
        
        {/* Main Monitoring View */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          
          {anomaly && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,51,102,0.05)', border: '2px solid #FF3366', borderRadius: '24px', zIndex: 1, animation: 'pulse 1s infinite' }} />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'url("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80")', backgroundSize: 'cover' }} />
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>John Doe</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.9rem' }}>ID: PAT-8842 • 54 yrs • Hypertension</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Watch size={14} /> Apple Watch S8
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${anomaly ? '#FF3366' : 'rgba(255,255,255,0.05)'}` }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HeartPulse size={14} /> Heart Rate
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: anomaly ? '#FF3366' : '#fff' }}>
                {pulse} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>BPM</span>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} /> Blood Pressure
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                128<span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>/82</span>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} /> ECG Rhythm
              </p>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: anomaly ? '#FF3366' : '#22c55e', marginTop: '1rem' }}>
                {anomaly ? "Irregular (AFib Detected)" : "Sinus Rhythm (Normal)"}
              </div>
            </div>
          </div>

          <div style={{ height: '150px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>[Live ECG Waveform Visualization]</span>
          </div>
        </div>

        {/* AI Action Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {anomaly ? (
            <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid #FF3366', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF3366', fontWeight: 700, marginBottom: '1rem' }}>
                <AlertCircle size={20} /> URGENT INTERVENTION
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                AI has detected sustained Atrial Fibrillation. Patient heart rate has spiked to 135 BPM while resting.
              </p>
              <button style={{ width: '100%', background: '#FF3366', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '0.5rem' }}>
                Dispatch Ambulance
              </button>
              <button style={{ width: '100%', background: 'transparent', color: '#FF3366', border: '1px solid #FF3366', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                Initiate Telemedicine Call
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontWeight: 700, marginBottom: '1rem' }}>
                <ShieldCheck size={20} /> PATIENT STABLE
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                AI is monitoring 42 active patients. No anomalies detected in the last 24 hours. Vital baselines remain consistent.
              </p>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Connected Devices</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', marginBottom: '0.5rem' }}>
              <Watch color="#00E5FF" size={20} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Apple Watch Series 8</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Syncing real-time</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
              <Smartphone color="#B14CFF" size={20} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Omron BP Monitor</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Last sync: 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
