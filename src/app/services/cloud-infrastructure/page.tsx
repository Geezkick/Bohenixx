"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cloud, Server, RefreshCw, UploadCloud, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import styles from "../services.module.css";

const features = [
  {
    icon: <UploadCloud size={28} color="#2962FF" />,
    title: "Cloud Migration",
    desc: "Seamlessly transition your legacy, on-premise systems to modern, highly-available cloud environments (AWS, GCP, Azure)."
  },
  {
    icon: <RefreshCw size={28} color="#2962FF" />,
    title: "DevOps & CI/CD",
    desc: "Accelerate software delivery with automated testing, continuous integration, and continuous deployment pipelines."
  },
  {
    icon: <Server size={28} color="#2962FF" />,
    title: "Serverless Architecture",
    desc: "Eliminate server management overhead and reduce costs by adopting event-driven serverless computing."
  },
  {
    icon: <Cpu size={28} color="#2962FF" />,
    title: "Orchestration & Kubernetes",
    desc: "Manage complex containerized applications with enterprise-grade Kubernetes clustering and scaling."
  }
];

const advantages = [
  "Zero-downtime deployment capabilities",
  "Auto-scaling infrastructure to handle massive traffic spikes",
  "Infrastructure as Code (IaC) for reproducible environments",
  "Significant cost optimization across all cloud resources"
];

export default function CloudInfrastructurePage() {
  return (
    <main className={styles.main}>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      
      <section className={styles.hero}>
        <div className={styles.heroGlow} style={{ background: '#2962FF' }}></div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Cloud size={64} color="#2962FF" />
          </div>
          <h1 className={styles.title}>Cloud Infrastructure</h1>
          <p className={styles.subtitle}>
            Scale your operations seamlessly. We architect, deploy, and manage highly resilient cloud environments built for the modern internet.
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
              <div className={styles.iconWrapper} style={{ background: 'rgba(41, 98, 255, 0.1)' }}>
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
              <CheckCircle2 size={24} style={{ color: '#2962FF', flexShrink: 0 }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{adv}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Scale?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Future-proof your application architecture with our DevOps experts.
        </p>
        <Link href="/services/request" className={styles.ctaButton}>
          Request Architecture Review <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}
