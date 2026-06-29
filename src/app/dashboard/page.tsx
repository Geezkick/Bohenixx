"use client";

import React from "react";
import styles from "./dashboard.module.css";
import { ArrowRight, Activity, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardOverview() {
  const { user } = useAuth();
  
  return (
    <>
      <h1 className={styles.pageTitle}>Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
      <p className={styles.pageDesc}>Here's what's happening with your Bohenix ecosystem today.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Active Services</span>
            <Activity color="#00E5FF" size={24} />
          </div>
          <div className={styles.cardValue}>2</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            NjiaSafe and Safura are currently running flawlessly.
          </p>
          <Link href="/dashboard/subscriptions" className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
            Manage Services
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Security Status</span>
            <ShieldCheck color="#22c55e" size={24} />
          </div>
          <div className={styles.cardValue}>Secure</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No active threats detected. Last audit was 2 days ago.
          </p>
          <Link href="/services/cybersecurity" className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
            View Security Logs
          </Link>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>BX Labs Access</span>
            <Zap color="#B14CFF" size={24} />
          </div>
          <div className={styles.cardValue}>Beta</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You have early access to Omni AI v2.0 testing phase.
          </p>
          <Link href="/dashboard/labs" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }}>
            View Labs Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Activity</h2>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', padding: '0 1.5rem' }}>
          {[
            { title: "Successful Login", desc: "Detected from your primary device.", time: "Just now", status: "Active" },
            { title: "Safura API Key Generated", desc: "Key: prod_safura_v1_...", time: "2 days ago", status: "Success" },
            { title: "BX Omni Model Training Completed", desc: "Dataset #452 synced perfectly.", time: "5 days ago", status: "Success" }
          ].map((activity, idx) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activity.status === 'Active' ? '#00E5FF' : 'rgba(255,255,255,0.2)' }} />
                <div>
                  <div className={styles.itemTitle} style={{ fontSize: '1rem' }}>{activity.title}</div>
                  <div className={styles.itemDesc}>{activity.desc}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
