"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, MonitorSmartphone, Server, Puzzle, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import styles from "../services.module.css";

const features = [
  {
    icon: <MonitorSmartphone size={28} color="#00E5FF" />,
    title: "Custom Web & Mobile Apps",
    desc: "High-performance native and cross-platform applications tailored to your specific operational needs."
  },
  {
    icon: <Server size={28} color="#00E5FF" />,
    title: "Legacy Modernization",
    desc: "Upgrade outdated infrastructure to modern cloud-native architectures without disrupting business continuity."
  },
  {
    icon: <Puzzle size={28} color="#00E5FF" />,
    title: "API & Systems Integration",
    desc: "Seamlessly connect disparate software systems to create a unified, automated digital ecosystem."
  },
  {
    icon: <Code2 size={28} color="#00E5FF" />,
    title: "SaaS Product Development",
    desc: "From conceptualization to deployment, we build scalable Software-as-a-Service platforms."
  }
];

const advantages = [
  "Microservices architecture for unlimited scalability",
  "Military-grade security protocols built-in by default",
  "Agile delivery cycles with rapid prototyping",
  "Ongoing dedicated support and infrastructure maintenance"
];

export default function EnterpriseSoftwarePage() {
  return (
    <main className={styles.main}>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      
      <section className={styles.hero}>
        <div className={styles.heroGlow} style={{ background: '#00E5FF' }}></div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Code2 size={64} color="#00E5FF" />
          </div>
          <h1 className={styles.title}>Enterprise Software Engineering</h1>
          <p className={styles.subtitle}>
            We engineer mission-critical applications that drive digital transformation. From robust backends to intuitive user interfaces, our software scales with your ambition.
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
              <div className={styles.iconWrapper}>
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
              <CheckCircle2 size={24} className={styles.checkIcon} />
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{adv}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Build?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Partner with our elite engineering team to bring your vision to life.
        </p>
        <Link href="/services/request" className={styles.ctaButton}>
          Request Service <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}
