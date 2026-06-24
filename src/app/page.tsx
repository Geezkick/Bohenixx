"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon, Terminal, Shield, Database, Cloud, Code, BrainCircuit, Globe, Activity, FileText } from "lucide-react";
import styles from "./landing.module.css";
import founderStyles from "./founder.module.css";
import ParticlesBackground from "@/components/ParticlesBackground";
import CobeGlobe from "@/components/CobeGlobe";
import TestimonialWall from "@/components/TestimonialWall";
import LaunchTimer from "@/components/LaunchTimer";
import AskBohenix from "@/components/AskBohenix";
import InstallButton from "@/components/InstallButton";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

const ecosystem = [
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform.", icon: "/njiasafee.png", color: "#E0E0E0", href: "https://njiasafe.six.vercel.app" },
  { name: "BX Omni", desc: "AI Digital Operations Twin.", icon: "/bohenixx.png", color: "#E0E0E0", href: "https://bohenixx.vercel.app" },
  { name: "Fixxo", desc: "Smart maintenance and service platform.", icon: "/fixxo.png", color: "#E0E0E0", href: "https://fixxo.vercel.app" },
  { name: "Mboka", desc: "Community and local commerce ecosystem.", icon: "/mboka.png", color: "#E0E0E0", href: "https://mboka.vercel.app" },
  { name: "Vuna", desc: "Agriculture and agritech platform.", icon: "/vuna.png", color: "#E0E0E0", href: "https://vunashorts.vercel.app" },
  { name: "Kwelify", desc: "Education and learning technology platform.", icon: "/bohenixx.png", color: "#E0E0E0", href: "https://kwelify.vercel.app" },
  { name: "Safura", desc: "Security and safety platform.", icon: "/safura.png", color: "#E0E0E0", href: "https://safura-ai.vercel.app" },
];

const services = [
  { 
    title: "Enterprise Software", 
    icon: <Code size={32} color="#FFFFFF"/>, 
    desc: "We design and develop scalable, high-performance software tailored to your business needs, from responsive web platforms to robust backend systems.",
    items: ["Web Applications", "Mobile Apps", "SaaS Platforms", "Enterprise Systems"],
    href: "/services/enterprise-software"
  },
  { 
    title: "Artificial Intelligence", 
    icon: <BrainCircuit size={32} color="#FFFFFF"/>, 
    desc: "Unlock the power of your data with advanced AI solutions. We build intelligent systems that automate workflows and provide actionable insights.",
    items: ["AI Agents", "Business Automation", "Predictive Analytics", "AI Integration"],
    href: "/services/artificial-intelligence"
  },
  { 
    title: "Cybersecurity", 
    icon: <Shield size={32} color="#FFFFFF"/>, 
    desc: "Protect your digital assets with our comprehensive security solutions, identifying vulnerabilities and ensuring compliance with global standards.",
    items: ["Security Audits", "Penetration Testing", "Security Monitoring", "Compliance"],
    href: "/services/cybersecurity"
  },
  { 
    title: "Data Analytics", 
    icon: <Database size={32} color="#FFFFFF"/>, 
    desc: "Transform raw data into strategic intelligence. We provide interactive dashboards and comprehensive data pipelines to drive informed decision-making.",
    items: ["Business Intelligence", "Dashboards", "Reporting", "Data Engineering"],
    href: "/services/data-analytics"
  },
  { 
    title: "Cloud Infrastructure", 
    icon: <Cloud size={32} color="#FFFFFF"/>, 
    desc: "Scale your operations seamlessly with our cloud expertise. We manage deployment, orchestration, and continuous monitoring for zero-downtime environments.",
    items: ["DevOps", "Cloud Deployment", "Hosting", "Monitoring"],
    href: "/services/cloud-infrastructure"
  },
];

export default function CorporateLandingPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const [pulseAuth, setPulseAuth] = useState(false);

  const handleProtectedNavigation = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showNotification({
        title: "Access Restricted",
        message: "Please access the portal first to unlock all features and protect user data.",
        type: "warning"
      });
      setPulseAuth(true);
      setTimeout(() => setPulseAuth(false), 2000);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  
  // Premium animation variants
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const staggerItem: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  // Stats counter animation state
  const [stats, setStats] = useState({ products: 0, users: 0, countries: 0 });
  
  useEffect(() => {
    // Simple animated counter effect
    const interval = setInterval(() => {
      setStats(prev => ({
        products: Math.min(prev.products + 1, 7),
        users: Math.min(prev.users + 120, 12000),
        countries: Math.min(prev.countries + 1, 15)
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bohenix Technologies",
            "url": "https://bohenixx.vercel.app",
            "logo": "https://bohenixx.vercel.app/bohenixx.png",
            "description": "Bohenix Technologies builds AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.",
            "founder": {
              "@type": "Person",
              "name": "Brian Nyarienya"
            },
            "sameAs": [
              "https://x.com/bohenix_solutio",
              "https://www.linkedin.com/in/brian-nyarienya-35892925b/"
            ]
          })
        }}
      />
      {/* AI Widget */}
      <AskBohenix />
      
      {/* Global Background */}
      <ParticlesBackground />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logoGroup}>
          <Image src="/bohenixx.png" alt="Bohenix Logo" width={32} height={32} />
          <span className={styles.brandName}>Bohenix</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#products" className={styles.navLink} onClick={handleProtectedNavigation}>Products</a>
          <a href="#services" className={styles.navLink} onClick={handleProtectedNavigation}>Services</a>
          <a href="#labs" className={styles.navLink} onClick={handleProtectedNavigation}>BX Labs</a>
          <a href="#about" className={styles.navLink} onClick={handleProtectedNavigation}>About</a>
          <a href="#contact" className={styles.navLink} onClick={handleProtectedNavigation}>Contact</a>
          <InstallButton />
          <Link href="/dashboard" className={styles.navBtn} style={pulseAuth ? { animation: 'pulse 1s infinite', transform: 'scale(1.05)', boxShadow: '0 0 25px #00E5FF', transition: 'all 0.3s' } : {}}>Access Portal</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero} id="home">
        
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className={`${styles.title} ${styles.shimmerText}`}>
            Building Africa&apos;s <span className={styles.titleHighlight}>Intelligent</span> <br />
            <span className={styles.titleHighlight}>Digital</span> Future
          </h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            Bohenix develops AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.
          </motion.p>
          <motion.div 
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <a href="#products" className={styles.primaryCta} onClick={handleProtectedNavigation}>
              Explore Products <ArrowRightIcon size={20} />
            </a>
            <a href="#contact" className={styles.secondaryCta} onClick={handleProtectedNavigation}>
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </header>

      {user ? (
        <>
          {/* Live Statistics */}
          <section className={styles.statsSection}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{stats.products}+</span>
          <span className={styles.statLabel}>Digital Products</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.users.toLocaleString()}+</span>
          <span className={styles.statLabel}>Active Users</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{stats.countries}</span>
          <span className={styles.statLabel}>African Countries</span>
        </div>
      </section>

      {/* Client Testimonial Wall */}
      <section className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <TestimonialWall />
      </section>

      {/* African Presence Globe */}
      <section id="presence" className={styles.section} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Active Across Africa</h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Our digital infrastructure is live in multiple tech hubs across the continent. 
            From Nairobi to Lagos, Johannesburg to Cairo, we are building the foundation 
            for Africa's connected future.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(139,46,255,0.1)', border: '1px solid rgba(139,46,255,0.3)', borderRadius: '99px', color: '#B14CFF' }}>Nairobi, KE</span>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(139,46,255,0.1)', border: '1px solid rgba(139,46,255,0.3)', borderRadius: '99px', color: '#B14CFF' }}>Lagos, NG</span>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(139,46,255,0.1)', border: '1px solid rgba(139,46,255,0.3)', borderRadius: '99px', color: '#B14CFF' }}>Johannesburg, ZA</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <CobeGlobe />
        </div>
      </section>

      {/* Ecosystem / Products Section */}
      <section id="products" className={styles.section}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <h2>Bohenix Ecosystem</h2>
          <p>Explore our live platforms.</p>
        </motion.div>

        <motion.div 
          className={styles.appsGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {ecosystem.map((app, i) => (
            <motion.div 
              key={app.name} 
              className={styles.appCard}
              variants={staggerItem}
            >
              <div className={styles.appHeader}>
                <div className={styles.appIconWrap}>
                  <Image src={app.icon} alt={app.name} width={50} height={50} className={styles.appIcon} />
                </div>
                <div>
                  <h3 className={styles.appName}>{app.name}</h3>
                  <span className={styles.appStatus} style={{ background: `rgba(0,200,83,0.1)`, color: '#00C853' }}>
                    LIVE
                  </span>
                </div>
              </div>
              <p className={styles.appDesc}>{app.desc}</p>
              <Link href={app.href} target="_blank" className={styles.appLink} style={{ color: app.color }}>
                Launch Platform <ArrowRightIcon size={16} />
              </Link>
              <div className={styles.cardGlow} style={{ background: app.color }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Global Launch Date Timer */}
        <LaunchTimer />
      </section>

      {/* About & Vision Section */}
      <section id="about" className={styles.section} style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className={styles.sectionHeader}>
          <h2>About Bohenix</h2>
          <p>Our vision and mission to transform the digital landscape.</p>
        </div>
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <motion.div style={{ flex: 1, minWidth: '300px' }} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#B14CFF' }}>Vision</h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
              To become Africa's leading technology ecosystem powering businesses, governments, and communities through intelligent digital solutions.
            </p>
          </motion.div>
          <motion.div style={{ flex: 1, minWidth: '300px' }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#00E5FF' }}>Mission</h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
              Building transformative software products that solve real-world problems and create sustainable economic growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Enterprise Services</h2>
          <p>We provide world-class engineering, AI, and cybersecurity services.</p>
        </div>
        <motion.div 
          className={styles.servicesGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((svc, i) => (
            <motion.div key={svc.title} className={styles.serviceCard} variants={staggerItem}>
              {svc.icon}
              <h3>{svc.title}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{svc.desc}</p>
              <ul className={styles.serviceList} style={{ marginBottom: '2rem' }}>
                {svc.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <Link href={svc.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#00E5FF', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' }}>
                Explore Service <ArrowRightIcon size={16} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/services/request" className={styles.primaryCta} style={{ display: 'inline-flex', background: '#fff', color: '#000' }}>
            Request Services <ArrowRightIcon size={20} />
          </Link>
        </div>
      </section>

      {/* BX Labs Section */}
      <section id="labs" className={styles.section} style={{ background: 'linear-gradient(135deg, rgba(139,46,255,0.05), transparent)' }}>
        <div className={styles.sectionHeader}>
          <h2>BX Labs</h2>
          <p>Our dedicated research and innovation division.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {['Emerging Technology Research', 'AI Innovation', 'Robotics', 'Smart Cities', 'Digital Infrastructure'].map(feature => (
            <div key={feature} style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Careers & Partners Section */}
      <section id="careers" className={styles.section} style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Careers</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
            Join us in building the future. We offer open positions, internship opportunities, and graduate programs.
          </p>
          <a href="mailto:career@bohenix.africa" className={styles.secondaryCta} style={{ display: 'inline-block' }}>
            Apply: career@bohenix.africa
          </a>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Investors & Partners</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
            Collaborating with governments, NGOs, enterprise clients, and investors to scale impact.
          </p>
          <a href="mailto:ceo@bohenix.africa" className={styles.primaryCta} style={{ display: 'inline-block' }}>
            Contact: ceo@bohenix.africa
          </a>
        </div>
      </section>

      {/* Founder Profile */}
      <section className={styles.section} style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', margin: '4rem auto' }}>
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '300px', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(139, 46, 255, 0.5)', boxShadow: '0 0 50px rgba(139, 46, 255, 0.2)' }}>
            <Image src="/brian.png" alt="Brian Nyarienya - Founder" layout="fill" objectFit="cover" />
          </div>
        </div>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>Brian Nyarienya</h2>
          <h3 style={{ fontSize: '1.5rem', color: '#E0E0E0', marginBottom: '1.5rem' }}>Founder & Visionary, Bohenix Technologies</h3>
          <motion.p 
            style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {`"Our goal is not just to build software, but to architect the digital nervous system of Africa. From smart mobility to AI-driven ecosystems, we are creating the foundation for a sustainable and hyper-connected future."`.split(' ').map((word, i) => (
              <motion.span key={i} variants={staggerItem} style={{ display: 'inline-block', marginRight: '4px' }}>
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>
      </section>

      {/* Dedicated Contact Form & Map Section */}
      <section id="contact" className={styles.section} style={{ background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className={styles.sectionHeader}>
          <h2>Get in Touch</h2>
          <p>Reach out to our teams for partnerships, services, or inquiries.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          {/* Contact Form */}
          <div style={{ flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <a href="https://wa.me/254783176503" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
              <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=p9wb1ez" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Insta
              </a>
              <a href="https://x.com/bohenix_solutio" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </a>
              <a href="https://www.linkedin.com/in/brian-nyarienya-35892925b/" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
              <a href="mailto:bohenixsolutions@gmail.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
              <a href="https://reddit.com/r/bohenix" target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.248-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                Reddit
              </a>
            </div>
            <button type="button" style={{ width: '100%', marginBottom: '2rem', background: '#FFFFFF', color: '#000', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', border: 'none' }} onClick={() => document.querySelector<HTMLButtonElement>('.' + styles.fab)?.click()}>
              Start Customer Service Chat
            </button>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="email" placeholder="Email support@bohenix.africa" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
              <textarea placeholder="Direct message..." rows={4} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'vertical' }}></textarea>
              <button type="button" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>Send Email Inquiry</button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Image src="/bohenixx.png" alt="Bohenix Logo" width={48} height={48} />
            <p>Building Africa's Intelligent Digital Future through enterprise engineering, smart ecosystems, and artificial intelligence.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact Center</h4>
            <ul>
              <li><a href="mailto:bohenixsolutions@gmail.com">bohenixsolutions@gmail.com</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Developer Portal</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Social Media</h4>
            <ul>
              <li><a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=p9wb1ez" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram</a></li>
              <li><a href="https://x.com/bohenix_solutio" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X</a></li>
              <li><a href="https://www.linkedin.com/in/brian-nyarienya-35892925b/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn</a></li>
              <li><a href="https://wa.me/254783176503" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> WhatsApp</a></li>
              <li><a href="https://reddit.com/r/bohenix" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.248-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg> Reddit</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} Bohenix Technologies. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
        </>
      ) : (
        <section style={{ padding: '8rem 2rem', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, transparent, rgba(139,46,255,0.05))', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
           <Shield size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: '2rem' }} />
           <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem', textAlign: 'center', fontWeight: 800 }}>Ecosystem Locked</h2>
           <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', textAlign: 'center', fontSize: '1.2rem', maxWidth: '500px' }}>For security and data protection, please authenticate to access products, services, and live telemetry.</p>
           <button onClick={(e) => handleProtectedNavigation(e)} className={styles.primaryCta} style={{ border: 'none', cursor: 'pointer' }}>
             Unlock Ecosystem <ArrowRightIcon size={20} />
           </button>
        </section>
      )}
    </div>
  );
}
