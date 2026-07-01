"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon, Shield, Database, Cloud, Code, BrainCircuit } from "lucide-react";
import styles from "./landing.module.css";
import HeroLogo3D from "@/components/HeroLogo3D";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

const ecosystem = [
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform powering safer commutes with real-time alerts and incident mapping.", icon: "/njiasafee.png" },
  { name: "BX Omni", desc: "AI-powered Digital Operations Twin that mirrors your business processes and optimizes them autonomously.", icon: "/bohenixx.png" },
  { name: "Fixxo", desc: "Smart maintenance and service marketplace connecting technicians with clients through AI-driven scheduling.", icon: "/fixxo.png" },
  { name: "Safura", desc: "Autonomous AI food scanner that analyzes any food item in real time — surfacing nutritional values, allergen warnings, and origin data without any manual input.", icon: "/safura.png" },
];

const services = [
  { 
    title: "Enterprise Software", 
    desc: "Production-grade software systems, from high-traffic web platforms to complex SaaS products and ERP integrations built for extreme scale.",
    items: ["Full-Stack Applications", "Legacy System Modernization", "API Design & Integration"],
  },
  { 
    title: "Artificial Intelligence", 
    desc: "Intelligent systems that transform operations. Custom AI agents, predictive models, NLP, and autonomous decision frameworks.",
    items: ["Custom AI Agents", "Workflow Automation", "Predictive Analytics"],
  },
  { 
    title: "Cloud Infrastructure", 
    desc: "Resilient cloud environments across AWS, GCP, and Azure with automated CI/CD pipelines, container orchestration, and 24/7 monitoring.",
    items: ["Multi-Cloud Architecture", "Kubernetes Orchestration", "CI/CD Automation"],
  },
];

export default function CorporateLandingPage() {
  const { user, loginWithGoogle } = useAuth();
  const { showNotification } = useNotification();
  const [visitors, setVisitors] = useState<number>(0);

  useEffect(() => {
    fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});
    const fetchCount = () => {
      fetch('/api/analytics/count')
        .then(res => res.json())
        .then(data => { if (data.success && data.visitors > 0) setVisitors(data.visitors); })
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundFX}></div>
      <div className={styles.noiseOverlay}></div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logoGroup}>
            <Image src="/bohenixx.png" alt="Bohenix Logo" width={28} height={28} />
            <span className={styles.brandName}>Bohenix</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#products" className={styles.navLink}>Products</Link>
            <Link href="#solutions" className={styles.navLink}>Solutions</Link>
            <Link href="/dashboard/developer" className={styles.navLink}>Developers</Link>
            <Link href="/dashboard/labs" className={styles.navLink}>Research</Link>
            <Link href="/company" className={styles.navLink}>Company</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
          <div>
            {user ? (
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            ) : (
              <button onClick={() => loginWithGoogle()} className={styles.navBtn}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className={styles.heroLabel}>
              AI • Software • Digital Infrastructure
            </motion.div>
            <motion.h1 variants={fadeUp} className={styles.title}>
              Building Africa's <br />
              <span className={styles.textPurple}>Intelligent</span> <br />
              Digital Future.
            </motion.h1>
            <motion.p variants={fadeUp} className={styles.subtitle}>
              Bohenix develops AI, mobility, fintech, productivity, business automation, cloud infrastructure, and intelligent software ecosystems powering Africa's digital transformation.
            </motion.p>
            <motion.div variants={fadeUp} className={styles.ctaGroup}>
              <Link href="#products" className={styles.primaryCta}>
                Explore Products <ArrowRightIcon size={18} />
              </Link>
              <Link href="/services/request" className={styles.secondaryCta}>
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
            <HeroLogo3D />
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className={styles.trustedSection}>
        <p className={styles.trustedLabel}>Trusted by forward-thinking enterprises</p>
        <div className={styles.trustedLogos}>
          <span><Shield size={24}/> FinTrust</span>
          <span><Cloud size={24}/> CloudNet</span>
          <span><Database size={24}/> DataFlow AI</span>
          <span><Code size={24}/> DevOps Sync</span>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Ecosystem Products</h2>
            <p>We build specialized platforms that solve complex industry challenges. Discover the tools powering the next generation of business.</p>
          </motion.div>

          <div className={styles.showcaseList}>
            {ecosystem.map((product, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-100px" }} 
                variants={fadeUp} 
                className={styles.showcaseCard}
              >
                <div className={styles.showcaseContent}>
                  <div className={styles.showcaseIcon}>
                    <Image src={product.icon} alt={product.name} width={36} height={36} />
                  </div>
                  <h3 className={styles.showcaseTitle}>{product.name}</h3>
                  <p className={styles.showcaseDesc}>{product.desc}</p>
                  <Link href="/dashboard" className={styles.showcaseLink}>
                    Learn more <ArrowRightIcon size={16} />
                  </Link>
                </div>
                <div className={styles.showcaseVisual}>
                  {/* Abstract visual representation per product could go here */}
                  <Image src={product.icon} alt={product.name} width={120} height={120} style={{ opacity: 0.1, filter: "blur(20px)", transform: "scale(2)" }} />
                  <Image src={product.icon} alt={product.name} width={120} height={120} style={{ position: "absolute", zIndex: 2 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="solutions" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Enterprise Solutions</h2>
            <p>End-to-end technological excellence for organizations that require absolute reliability and scale.</p>
          </motion.div>

          <div className={styles.servicesGrid}>
            {services.map((service, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true }} 
                variants={fadeUp} 
                className={styles.serviceCard}
              >
                <BrainCircuit size={32} color="#7B2DFF" />
                <h3>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <ul className={styles.serviceList}>
                  {service.items.map((item, i) => (
                    <li key={i}><div style={{ marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#7B2DFF', flexShrink: 0 }} /> {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>7+</div>
              <div className={styles.statLabel}>Ecosystem Products</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{visitors > 0 ? (visitors > 1000 ? `${(visitors/1000).toFixed(1)}k+` : visitors) : 'Active'}</div>
              <div className={styles.statLabel}>Unique Visitors</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logoGroup} style={{ marginBottom: "1rem" }}>
              <Image src="/bohenixx.png" alt="Logo" width={24} height={24} />
              <span className={styles.brandName} style={{ fontSize: "1rem" }}>Bohenix</span>
            </Link>
            <p>Architecting intelligent digital infrastructure and ecosystem platforms for the African continent.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Ecosystem</h4>
            <ul>
              <li><Link href="/products">NjiaSafe</Link></li>
              <li><Link href="/products">BX Omni</Link></li>
              <li><Link href="/products">Safura</Link></li>
              <li><Link href="/products">Fixxo</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/dashboard/labs">BX Labs</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>&copy; {new Date().getFullYear()} Bohenix Technologies. All rights reserved.</div>
          <div>Nairobi, Kenya</div>
        </div>
      </footer>
    </div>
  );
}
