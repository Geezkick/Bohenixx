"use client";

import React from "react";
import styles from "../dashboard.module.css";
import { FlaskConical, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function LabsPage() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <h1 className={styles.pageTitle} style={{ margin: 0 }}>BX Labs Insider</h1>
        <span style={{ background: 'rgba(177, 76, 255, 0.2)', color: '#B14CFF', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>CONFIDENTIAL</span>
      </div>
      <p className={styles.pageDesc}>Exclusive early access, beta testing, and roadmap updates directly from the Bohenix research division.</p>

      <div className={styles.grid}>
        
        <div className={styles.card} style={{ border: '1px solid rgba(177, 76, 255, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: '#B14CFF', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderBottomLeftRadius: '16px' }}>OPEN BETA</div>
          <FlaskConical size={32} color="#B14CFF" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>BX Omni v2.0 Agent</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Test the next generation of our autonomous business operations twin. Features advanced multi-agent orchestration and self-healing pipelines.
          </p>
          <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
            Access Beta Environment
          </button>
        </div>

        <div className={styles.card} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, borderBottomLeftRadius: '16px' }}>IN DEVELOPMENT</div>
          <Lock size={32} color="#00E5FF" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Tokenized Agri-Exchange</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            A decentralized platform for trading tokenized agricultural commodities. Slated for release in Q4 2026.
          </p>
          <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
            Join Waitlist
          </button>
        </div>

      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Research Papers & Updates</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#00E5FF', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Computer Vision • Published Today</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Optimizing Edge Inference for Low-Light Crop Scanning</h4>
            </div>
            <button className={styles.btnSecondary} style={{ padding: '0.5rem 1rem' }}><Eye size={16} /> Read PDF</button>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#B14CFF', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Language AI • Last Week</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Cross-lingual Semantic Search in Kiswahili and Hausa</h4>
            </div>
            <button className={styles.btnSecondary} style={{ padding: '0.5rem 1rem' }}><Eye size={16} /> Read PDF</button>
          </div>

        </div>
      </div>
    </>
  );
}
