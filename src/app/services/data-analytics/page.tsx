"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Database, BarChart3, DatabaseZap, PieChart, ActivitySquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import styles from "../services.module.css";

const features = [
  {
    icon: <BarChart3 size={28} color="#00E676" />,
    title: "Business Intelligence",
    desc: "Transform raw data into strategic intelligence with interactive, real-time executive dashboards."
  },
  {
    icon: <DatabaseZap size={28} color="#00E676" />,
    title: "Data Engineering",
    desc: "Build robust, scalable data pipelines (ETL/ELT) ensuring reliable data flow from source to warehouse."
  },
  {
    icon: <Database size={28} color="#00E676" />,
    title: "Data Warehousing",
    desc: "Centralize your organization's data architecture for single-source-of-truth analytics."
  },
  {
    icon: <ActivitySquare size={28} color="#00E676" />,
    title: "Real-time Telemetry",
    desc: "Monitor operational performance and user behavior instantly with high-throughput streaming analytics."
  }
];

const advantages = [
  "Sub-second query performance on massive datasets",
  "Beautiful, intuitive data visualizations tailored to stakeholders",
  "Strict adherence to data governance and privacy laws",
  "Automated reporting to eliminate manual spreadsheet work"
];

export default function DataAnalyticsPage() {
  return (
    <main className={styles.main}>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      
      <section className={styles.hero}>
        <div className={styles.heroGlow} style={{ background: '#00E676' }}></div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <PieChart size={64} color="#00E676" />
          </div>
          <h1 className={styles.title}>Data Analytics & BI</h1>
          <p className={styles.subtitle}>
            Turn information into an unfair advantage. We build the data infrastructure and visualization tools necessary to drive rapid, informed decision-making.
          </p>
        </motion.div>
      </section>

      <section className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>Core Capabilities</h2>
        <div className={styles.grid}>
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.iconWrapper} style={{ background: 'rgba(0, 230, 118, 0.1)' }}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.advantageSection}>
        <h2 className={styles.sectionTitle}>The Bohenix Advantage</h2>
        <div className={styles.advantageGrid}>
          {advantages.map((adv, idx) => (
            <motion.div 
              key={idx} 
              className={styles.advantageRow}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 size={24} style={{ color: '#00E676', flexShrink: 0 }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{adv}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Unlock Your Data</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Stop guessing and start measuring. Partner with our data science team today.
        </p>
        <Link href="/services/request" className={styles.ctaButton}>
          Request Data Consultation <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}
