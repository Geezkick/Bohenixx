"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Bot, LineChart, Cpu, Network, ArrowRight, CheckCircle2 } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import styles from "../services.module.css";

const features = [
  {
    icon: <Bot size={28} color="#B14CFF" />,
    title: "Autonomous AI Agents",
    desc: "Deploy intelligent agents capable of managing workflows, customer support, and complex operational tasks natively."
  },
  {
    icon: <LineChart size={28} color="#B14CFF" />,
    title: "Predictive Analytics",
    desc: "Harness machine learning algorithms to forecast trends, optimize supply chains, and identify business opportunities."
  },
  {
    icon: <Network size={28} color="#B14CFF" />,
    title: "LLM Integration",
    desc: "Embed cutting-edge Large Language Models into your existing platforms for advanced natural language processing."
  },
  {
    icon: <Cpu size={28} color="#B14CFF" />,
    title: "Computer Vision",
    desc: "Automate quality control, security monitoring, and spatial analysis using advanced visual recognition AI."
  }
];

const advantages = [
  "Custom model fine-tuning on your proprietary corporate data",
  "Privacy-first AI implementation ensuring data sovereignty",
  "Seamless API integrations with existing enterprise systems",
  "Continuous model monitoring and automated retraining pipelines"
];

export default function ArtificialIntelligencePage() {
  return (
    <main className={styles.main}>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      
      <section className={styles.hero}>
        <div className={styles.heroGlow} style={{ background: '#B14CFF' }}></div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <BrainCircuit size={64} color="#B14CFF" />
          </div>
          <h1 className={styles.title}>Artificial Intelligence Solutions</h1>
          <p className={styles.subtitle}>
            Transform your raw data into cognitive intelligence. We build custom AI models and autonomous systems that learn, adapt, and scale your business logic.
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
              <div className={styles.iconWrapper} style={{ background: 'rgba(177, 76, 255, 0.1)' }}>
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
              <CheckCircle2 size={24} style={{ color: '#B14CFF', flexShrink: 0 }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{adv}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Automate?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Let our AI engineers unlock the intelligence hidden within your organization.
        </p>
        <Link href="/services/request" className={styles.ctaButton}>
          Request Service <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}
