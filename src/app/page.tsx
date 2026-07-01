"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon, Shield, Database, Cloud, Code, BrainCircuit } from "lucide-react";
import styles from "./landing.module.css";

import dynamic from "next/dynamic";

const TestimonialWall = dynamic(() => import("@/components/TestimonialWall"), { ssr: false });
const LaunchTimer = dynamic(() => import("@/components/LaunchTimer"), { ssr: false });
const AskBohenix = dynamic(() => import("@/components/AskBohenix"), { ssr: false });
const CobeGlobe = dynamic(() => import("@/components/CobeGlobe"), { ssr: false });
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

const ecosystem = [
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform powering safer commutes with real-time alerts and incident mapping.", icon: "/njiasafee.png", href: "https://njiasafe.six.vercel.app" },
  { name: "BX Omni", desc: "AI-powered Digital Operations Twin that mirrors your business processes and optimizes them autonomously.", icon: "/bohenixx.png", href: "https://bohenixx.vercel.app" },
  { name: "Fixxo", desc: "Smart maintenance and service marketplace connecting technicians with clients through AI-driven scheduling.", icon: "/fixxo.png", href: "https://fixxo.vercel.app" },
  { name: "Mboka", desc: "AI-powered job matching platform built for skilled laborers and employers to find each other by nearest location. Intelligent geo-matching and verified profiles.", icon: "/mboka.png", href: "https://mboka.vercel.app" },
  { name: "Vuna", desc: "The platform where AI curates and distributes short-form farming videos to maximize reach for every farmer. Connect, engage, trade.", icon: "/vuna.png", href: "https://vunashorts.vercel.app" },
  { name: "Kwelify", desc: "Adaptive learning technology platform delivering personalized education through AI-curated curriculum.", icon: "/bohenixx.png", href: "https://kwelify.vercel.app" },
  { name: "Safura", desc: "Autonomous AI food scanner that analyzes any food item in real time — surfacing nutritional values, allergen warnings, and origin data without any manual input.", icon: "/safura.png", href: "https://safura-ai.vercel.app" },
];

const services = [
  { 
    title: "Enterprise Software Engineering", 
    desc: "Production-grade software systems, from high-traffic web platforms to complex SaaS products and ERP integrations built for extreme scale.",
    items: ["Full-Stack Web Applications", "Cross-Platform Mobile Apps", "SaaS Product Development", "Enterprise Resource Planning", "API Design & Integration", "Legacy System Modernization"],
  },
  { 
    title: "Artificial Intelligence & Machine Learning", 
    desc: "Intelligent systems that transform operations. Custom AI agents, predictive models, NLP, and autonomous decision frameworks.",
    items: ["Custom AI Agents & Copilots", "Workflow Automation & RPA", "Predictive Analytics & Forecasting", "Natural Language Processing", "Computer Vision Solutions", "AI Model Training & Fine-Tuning"],
  },
  { 
    title: "Cybersecurity & Compliance", 
    desc: "Proactive threat detection, penetration testing, and compliance auditing. We build security into every layer.",
    items: ["Penetration Testing & Red Teaming", "Security Operations Center (SOC)", "Zero-Trust Architecture", "Compliance & Regulatory Auditing", "Incident Response & Recovery", "Vulnerability Management"],
  },
  { 
    title: "Data Engineering & Business Intelligence", 
    desc: "Scalable data pipelines and real-time analytics to turn raw information into actionable business intelligence.",
    items: ["Real-Time Analytics Dashboards", "ETL & Data Pipeline Engineering", "Data Lake & Warehouse Design", "Business Intelligence Reporting", "Data Governance & Quality", "Custom KPI Frameworks"],
  },
  { 
    title: "Cloud Infrastructure & DevOps", 
    desc: "Resilient cloud environments across AWS, GCP, and Azure with automated CI/CD pipelines, container orchestration, and 24/7 monitoring.",
    items: ["Multi-Cloud Architecture", "Kubernetes Orchestration", "CI/CD Pipeline Automation", "Infrastructure as Code (IaC)", "24/7 Monitoring & Alerting", "Cost Optimization & FinOps"],
  },
];

export default function CorporateLandingPage() {
  const { user, loginWithGoogle } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  // Live Analytics Data
  const [visitors, setVisitors] = useState<number>(0);
  const [stats, setStats] = useState({ products: 0, users: 0, countries: 0 });

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

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        products: Math.min(prev.products + 1, 7),
        users: Math.min(prev.users + 120, 12000),
        countries: Math.min(prev.countries + 1, 15)
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Contact Form Logic
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPortfolio, setInquiryPortfolio] = useState("");
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState("hello@bohenix.africa");

  const openContactModal = (target: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      showNotification({ title: "Sign In Required", message: "Please sign in to send inquiries.", type: "warning" });
      loginWithGoogle();
      return;
    }
    setContactTarget(target);
    if (!inquiryEmail) setInquiryEmail(user.email);
    if (!inquiryName) setInquiryName(user.name);
    setIsContactModalOpen(true);
  };

  const handleSendInquiry = async () => {
    if(!inquiryEmail || !inquiryMsg) {
      showNotification({ title: "Missing Fields", message: "Please provide both an email and a message.", type: "warning" });
      return;
    }
    setIsSendingInquiry(true);
    try {
      let endpoint = '/api/contact';
      let payload: any = { email: inquiryEmail, message: inquiryMsg, subject: `Website Inquiry to ${contactTarget}`, targetEmail: contactTarget };

      if (contactTarget === 'support@bohenix.africa') {
        endpoint = '/api/support';
        payload = { email: inquiryEmail, message: inquiryMsg, subject: 'Support Request' };
      } else if (contactTarget === 'career@bohenix.africa') {
        endpoint = '/api/career';
        payload = { email: inquiryEmail, name: inquiryName || 'Applicant', position: 'General Application', portfolioUrl: inquiryPortfolio, coverLetter: inquiryMsg };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        showNotification({ title: "Message Sent", message: "Your inquiry has been successfully delivered.", type: "success" });
        setInquiryEmail(""); setInquiryMsg(""); setInquiryPortfolio("");
        setIsContactModalOpen(false);
      } else {
        showNotification({ title: "Delivery Failed", message: data.error || "Failed to send message.", type: "error" });
      }
    } catch (err) {
      showNotification({ title: "Network Error", message: "Could not send the message. Please check your connection.", type: "error" });
    } finally {
      setIsSendingInquiry(false);
    }
  };

  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
            <Link href="#labs" className={styles.navLink}>Research</Link>
            <Link href="#company" className={styles.navLink}>Company</Link>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.navLink} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Contact</button>
          </div>
          <div>
            {user ? (
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            ) : (
              <Link href="/sign-in" className={styles.navBtn} style={{ cursor: "pointer", border: "none", textDecoration: "none" }}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Dynamic Contact Modal */}
      {isContactModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,5,5,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
          <div style={{ background: '#111114', padding: '3rem', borderRadius: '24px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setIsContactModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#B3B3B8', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Send Inquiry</h3>
            <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '15px' }}>Directly to <strong style={{ color: '#7B2DFF' }}>{contactTarget}</strong></p>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="email" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="Your Email Address" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
              
              {contactTarget === 'career@bohenix.africa' && (
                <>
                  <input type="text" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  <input type="url" value={inquiryPortfolio} onChange={(e) => setInquiryPortfolio(e.target.value)} placeholder="LinkedIn or Portfolio URL" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                </>
              )}
              
              <textarea value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder={contactTarget === 'career@bohenix.africa' ? "Brief Cover Letter or Summary..." : "Type your message here..."} rows={5} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', resize: 'vertical', fontSize: '15px' }}></textarea>
              <button type="button" disabled={isSendingInquiry} onClick={handleSendInquiry} style={{ background: '#7B2DFF', color: '#fff', padding: '1rem', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 600, cursor: isSendingInquiry ? 'not-allowed' : 'pointer', opacity: isSendingInquiry ? 0.7 : 1, transition: 'all 0.2s' }}>
                {isSendingInquiry ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      )}

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
              Bohenix develops AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.
            </motion.p>
            <motion.div variants={fadeUp} className={styles.ctaGroup}>
              <Link href="#products" className={styles.primaryCta}>
                Explore Products <ArrowRightIcon size={18} />
              </Link>
              <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.secondaryCta} style={{ border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                Contact Us
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', aspectRatio: '1/1', borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', background: '#111114' }}>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                src="/bohenixx.mp4"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 100%)', pointerEvents: 'none' }} />
            </div>
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

      {/* AI Widget */}
      <AskBohenix />

      {/* Stats Grid */}
      <section className={styles.section} style={{ paddingTop: '80px', paddingBottom: '0' }}>
        <div className={styles.contentContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.products}+</div>
              <div className={styles.statLabel}>Digital Ecosystem Products</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.users.toLocaleString()}+</div>
              <div className={styles.statLabel}>Active Platform Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.countries}</div>
              <div className={styles.statLabel}>African Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* African Presence Globe */}
      <section id="presence" className={styles.section}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '48px', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Active Across Africa</h2>
            
            {/* Live Visitor Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(123,45,255,0.05)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(123,45,255,0.15)', marginBottom: '2.5rem', width: 'fit-content' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#7B2DFF', boxShadow: '0 0 15px #7B2DFF' }} />
              <div>
                <div style={{ color: '#B3B3B8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px' }}>Live Visitors</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{visitors > 0 ? visitors.toLocaleString() : 'Active'}</div>
              </div>
            </div>

            <p style={{ fontSize: '18px', color: '#B3B3B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              The Bohenix ecosystem is growing rapidly across the African continent — from coastal cities to inland communities — connecting people, businesses, and opportunities through intelligent technology that understands local context and delivers real-world impact at scale.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', background: '#111114', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem' }}>
            <CobeGlobe />
          </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 className={styles.showcaseTitle} style={{ margin: 0 }}>{product.name}</h3>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', padding: '4px 10px', background: 'rgba(255,152,0,0.1)', borderRadius: '99px', color: '#FF9800', textTransform: 'uppercase' }}>
                      IN DEVELOPMENT
                    </span>
                  </div>
                  <p className={styles.showcaseDesc}>{product.desc}</p>
                  {user?.email === 'nyarienyabrian05@gmail.com' ? (
                    <a href={product.href} target="_blank" className={styles.showcaseLink}>
                      Access Platform <ArrowRightIcon size={16} />
                    </a>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#B3B3B8', marginTop: '0.5rem', fontWeight: 500 }}>
                      🚀 Launching soon from BX Labs
                    </p>
                  )}
                </div>
                <div className={styles.showcaseVisual}>
                  <Image src={product.icon} alt={product.name} width={120} height={120} style={{ opacity: 0.1, filter: "blur(20px)", transform: "scale(2)" }} />
                  <Image src={product.icon} alt={product.name} width={120} height={120} style={{ position: "absolute", zIndex: 2 }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Launch Date Timer */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <LaunchTimer />
      </section>

      {/* Client Testimonial Wall */}
      <section className={styles.section} style={{ padding: '0 4rem' }}>
        <TestimonialWall />
      </section>

      {/* Services Section */}
      <section id="solutions" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Enterprise Solutions</h2>
            <p>End-to-end technological excellence for organizations that require absolute reliability and scale. Bohenix delivers production-grade solutions that work in the real world.</p>
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
                    <li key={i}><div style={{ marginTop: '10px', width: '4px', height: '4px', borderRadius: '50%', background: '#7B2DFF', flexShrink: 0 }} /> {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BX Labs Section */}
      <section id="labs" className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>BX Labs</h2>
            <p>Our dedicated research and innovation division — where cutting-edge ideas become production-ready technology that reshapes industries across Africa and the world.</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto 4rem', textAlign: 'center', padding: '3rem', background: '#111114', borderRadius: '32px', border: '1px solid rgba(123,45,255,0.15)' }}>
            <p style={{ fontSize: '18px', color: '#B3B3B8', lineHeight: 1.8 }}>
              BX Labs is Bohenix&apos;s frontier research engine. Every product in the Bohenix ecosystem has roots in Labs research. We operate at the intersection of applied AI, systems engineering, and deep technology to deliver breakthrough innovations that are commercially viable, ethically grounded, and built for Africa&apos;s unique challenges.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {[
              { title: 'Autonomous AI Systems', tag: 'Core Research', desc: 'Self-learning AI agents capable of operating, adapting, and self-optimizing across complex business environments.' },
              { title: 'Computer Vision & Spatial AI', tag: 'Applied Research', desc: 'Real-time visual recognition systems powering food scanning, smart city surveillance, and industrial quality control.' },
              { title: 'Edge Computing & IoT', tag: 'Infrastructure', desc: 'Low-latency solutions that bring AI inference directly to the device, powering sensors in low-connectivity environments.' },
              { title: 'African NLP', tag: 'Language AI', desc: 'Multilingual AI models capable of understanding and reasoning in Kiswahili, Hausa, Amharic, and Zulu.' },
            ].map(lab => (
              <div key={lab.title} style={{ padding: '2.5rem', background: '#111114', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>{lab.title}</h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', padding: '4px 12px', background: 'rgba(123,45,255,0.1)', borderRadius: '99px', color: '#7B2DFF', textTransform: 'uppercase' }}>{lab.tag}</span>
                </div>
                <p style={{ fontSize: '15px', color: '#B3B3B8', lineHeight: 1.6, margin: 0 }}>{lab.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section id="company" className={styles.section}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', background: '#111114', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', padding: '4rem' }}>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px', aspectRatio: '3/4', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(123,45,255,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <Image src="/brian.png" alt="Brian Nyarienya - Founder" layout="fill" objectFit="cover" />
            </div>
          </div>
          <div style={{ flex: 1.5, minWidth: '300px' }}>
            <h2 style={{ fontSize: '48px', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 700, letterSpacing: '-0.02em' }}>Brian Nyarienya</h2>
            <h3 style={{ fontSize: '20px', color: '#7B2DFF', marginBottom: '2rem', fontWeight: 500 }}>Founder & Visionary, Bohenix Technologies</h3>
            <p style={{ fontSize: '24px', lineHeight: 1.6, color: '#fff', fontStyle: 'italic', marginBottom: '2rem' }}>
              "Most people are still modeling the future. We're already deploying it. Bohenix isn't building software — we're building the infrastructure layer Africa hasn't named yet."
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={(e) => openContactModal('ceo@bohenix.africa', e)} className={styles.primaryCta} style={{ border: 'none', cursor: 'pointer' }}>
                Contact Founder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Careers & Partners Section */}
      <section className={styles.section}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ flex: 1, minWidth: '300px', background: '#111114', padding: '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '1rem', fontWeight: 700 }}>Careers</h2>
            <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '16px', lineHeight: 1.6 }}>
              Join us in building the future. We offer open positions, internship opportunities, and graduate programs across engineering, AI research, and operations.
            </p>
            <button onClick={(e) => openContactModal('career@bohenix.africa', e)} className={styles.secondaryCta} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              Apply to Bohenix
            </button>
          </div>
          <div style={{ flex: 1, minWidth: '300px', background: '#111114', padding: '4rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '1rem', fontWeight: 700 }}>Investors & Partners</h2>
            <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '16px', lineHeight: 1.6 }}>
              We collaborate with governments, NGOs, enterprise clients, and strategic investors to scale impact across the African continent and globally.
            </p>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.secondaryCta} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logoGroup} style={{ marginBottom: "1.5rem" }}>
              <Image src="/bohenixx.png" alt="Logo" width={32} height={32} />
              <span className={styles.brandName} style={{ fontSize: "1.25rem" }}>Bohenix</span>
            </Link>
            <p>Building Africa's Intelligent Digital Future through enterprise engineering, smart ecosystems, and artificial intelligence.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Ecosystem</h4>
            <ul>
              <li><Link href="#products">NjiaSafe</Link></li>
              <li><Link href="#products">BX Omni</Link></li>
              <li><Link href="#products">Safura</Link></li>
              <li><Link href="#products">Fixxo</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact Center</h4>
            <ul>
              <li><button onClick={(e) => openContactModal('hello@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>hello@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('ceo@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>ceo@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('career@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>career@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('support@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>support@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('info@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>info@bohenix.africa</button></li>
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
