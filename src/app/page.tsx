"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, animate } from "framer-motion";
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

function AnimatedNumber({ value }: { value: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const node = nodeRef.current;
    if (node && inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = Math.round(v).toLocaleString();
        }
      });
      return () => controls.stop();
    }
  }, [value, inView]);

  return <span ref={nodeRef}>0</span>;
}


const ecosystem = [
  { name: "BX POS", desc: "A highly advanced, multi-industry AI point-of-sale terminal. Fully customizable for retail, restaurants, medical, or any custom business type. Features dynamic AI insights, intelligent inventory forecasting, and seamless multi-payment billing.", icon: "/bohenixx.png", href: "/dashboard/pos", status: "active" },
  { name: "BX Business Suite", desc: "A comprehensive AI-driven healthcare management suite. Automate patient medical billing, schedule intelligent AI-triaged appointments, and manage clinic reputation from a unified portal.", icon: "/bohenixx.png", href: "/dashboard/subscriptions", status: "active" },
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform powering safer commutes with real-time alerts and incident mapping.", icon: "/njiasafee.png", href: "https://njiasafe.six.vercel.app", status: "development" },
  { name: "BX Omni", desc: "AI-powered Digital Operations Twin that mirrors your business processes and optimizes them autonomously.", icon: "/bohenixx.png", href: "https://bohenixx.vercel.app", status: "development" },
  { name: "Fixxo", desc: "Smart maintenance and service marketplace connecting technicians with clients through AI-driven scheduling.", icon: "/fixxo.png", href: "https://fixxo.vercel.app", status: "development" },
  { name: "Mboka", desc: "AI-powered job matching platform built for skilled laborers and employers to find each other by nearest location. Intelligent geo-matching and verified profiles.", icon: "/mboka.png", href: "https://mboka.vercel.app", status: "development" },
  { name: "Vuna", desc: "The platform where AI curates and distributes short-form farming videos to maximize reach for every farmer. Connect, engage, trade.", icon: "/vuna.png", href: "https://vunashorts.vercel.app", status: "development" },
  { name: "Kwelify", desc: "Adaptive learning technology platform delivering personalized education through AI-curated curriculum.", icon: "/bohenixx.png", href: "https://kwelify.vercel.app", status: "development" },
  { name: "Safura", desc: "Autonomous AI food scanner that analyzes any food item in real time — surfacing nutritional values, allergen warnings, and origin data without any manual input.", icon: "/safura.png", href: "https://safura-ai.vercel.app", status: "development" },
];

const services = [
  { 
    title: "Enterprise Software Engineering", 
    icon: <Code size={32} color="#7B2DFF" />,
    desc: "Production-grade software systems, from high-traffic web platforms to complex SaaS products and ERP integrations built for extreme scale.",
    items: ["Full-Stack Web Applications", "Cross-Platform Mobile Apps", "SaaS Product Development", "Enterprise Resource Planning", "API Design & Integration", "Legacy System Modernization"],
  },
  { 
    title: "Artificial Intelligence & Machine Learning", 
    icon: <BrainCircuit size={32} color="#7B2DFF" />,
    desc: "Intelligent systems that transform operations. Custom AI agents, predictive models, NLP, and autonomous decision frameworks.",
    items: ["Custom AI Agents & Copilots", "Workflow Automation & RPA", "Predictive Analytics & Forecasting", "Natural Language Processing", "Computer Vision Solutions", "AI Model Training & Fine-Tuning"],
  },
  { 
    title: "Cybersecurity & Compliance", 
    icon: <Shield size={32} color="#7B2DFF" />,
    desc: "Proactive threat detection, penetration testing, and compliance auditing. We build security into every layer.",
    items: ["Penetration Testing & Red Teaming", "Security Operations Center (SOC)", "Zero-Trust Architecture", "Compliance & Regulatory Auditing", "Incident Response & Recovery", "Vulnerability Management"],
  },
  { 
    title: "Data Engineering & Business Intelligence", 
    icon: <Database size={32} color="#7B2DFF" />,
    desc: "Scalable data pipelines and real-time analytics to turn raw information into actionable business intelligence.",
    items: ["Real-Time Analytics Dashboards", "ETL & Data Pipeline Engineering", "Data Lake & Warehouse Design", "Business Intelligence Reporting", "Data Governance & Quality", "Custom KPI Frameworks"],
  },
  { 
    title: "Cloud Infrastructure & DevOps", 
    icon: <Cloud size={32} color="#7B2DFF" />,
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
        .then(data => {
          if (data.success) {
            setVisitors(data.visitors || 0);
            setStats({
              products: ecosystem.length + 1, // +1 for Flow AI
              users: data.users || 0,
              countries: data.countries || 0
            });
          }
        })
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
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
    setContactTarget(target);
    if (user && !inquiryEmail) setInquiryEmail(user.email);
    if (user && !inquiryName) setInquiryName(user.name);
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
            <div className={styles.navDropdown}>
              <Link href="/flow-ai" className={styles.navLink}>Flow AI</Link>
              <div className={styles.navDropdownMenu}>
                <Link href="/flow-ai#overview" className={styles.dropLink}>Overview</Link>
                <Link href="/flow-ai#agents" className={styles.dropLink}>AI Agents</Link>
                <Link href="/flow-ai#features" className={styles.dropLink}>Features</Link>
                <Link href="/flow-ai#solutions" className={styles.dropLink}>Solutions</Link>
                <Link href="/flow-ai#pricing" className={styles.dropLink}>Pricing</Link>
                <Link href="/flow-ai#security" className={styles.dropLink}>Security</Link>
                <Link href="/flow-ai#developers" className={styles.dropLink}>API & Docs</Link>
              </div>
            </div>
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
            <motion.h1 variants={fadeUp} className={styles.title}>
              Building Africa's <br />
              <span className={styles.textPurple}>Intelligent</span> <br />
              Digital Future.
            </motion.h1>
            <motion.p variants={fadeUp} className={styles.subtitle}>
              From enterprise SaaS and mobility to our new flagship <strong style={{ color: '#fff' }}>Bohenix Flow AI</strong>. We build intelligent software systems to put your business on autopilot and power the global digital economy.
            </motion.p>
            <motion.div variants={fadeUp} className={styles.ctaGroup}>
              <Link href="/flow-ai" className={styles.primaryCta}>
                Discover Flow AI <ArrowRightIcon size={18} />
              </Link>
              <Link href="#products" className={styles.secondaryCta} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                Explore All Products
              </Link>
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
              <div className={styles.statNumber}><AnimatedNumber value={stats.products} />+</div>
              <div className={styles.statLabel}>Digital Ecosystem Products</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}><AnimatedNumber value={stats.users} />+</div>
              <div className={styles.statLabel}>Active Platform Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}><AnimatedNumber value={stats.countries} /></div>
              <div className={styles.statLabel}>Global Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* African Presence Globe */}
      <section id="presence" className={styles.section}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className={styles.title} style={{ fontSize: '48px', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(180deg, #FFFFFF 0%, #7B2DFF 150%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Active Globally
            </h2>
            
            {/* Total Visitor Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem', width: 'fit-content' }}>
              <div>
                <div style={{ color: '#B3B3B8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '6px' }}>Total Global Visitors</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div style={{ fontSize: '42px', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}><AnimatedNumber value={visitors} /></div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '18px', color: '#B3B3B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              The Bohenix ecosystem is growing rapidly across the African continent and globally — connecting people, businesses, and opportunities through intelligent technology that understands local context and delivers real-world impact at scale.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <CobeGlobe />
          </div>
        </div>
      </section>

      {/* Ecosystem Showcase */}
      <section id="products" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Ecosystem Products</h2>
            <p>From autonomous AI agents to industry-specific platforms, discover the tools powering the next generation of business.</p>
          </motion.div>

          <div className={styles.showcaseList}>
            {/* Flagship Product */}
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={fadeUp} 
              className={styles.showcaseCard}
              style={{ gridTemplateColumns: '1fr', textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(180deg, rgba(123,45,255,0.1) 0%, rgba(17,17,20,1) 100%)', border: '1px solid rgba(123,45,255,0.3)' }}
            >
              <div className={styles.showcaseContent} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', padding: '6px 16px', background: '#7B2DFF', borderRadius: '99px', color: '#fff', textTransform: 'uppercase', marginBottom: '1.5rem' }}>FLAGSHIP PLATFORM</span>
                <h3 className={styles.showcaseTitle} style={{ fontSize: '36px', marginBottom: '1rem', fontWeight: 800 }}>Bohenix Flow AI</h3>
                <p className={styles.showcaseDesc} style={{ fontSize: '18px', marginBottom: '2.5rem', color: '#E0E0E0' }}>
                  An AI-first SaaS platform that enables businesses to delegate complete workflows to autonomous AI agents. Hire AI employees to manage projects, generate invoices, follow up with customers, and analyze performance.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/flow-ai" className={styles.primaryCta} style={{ display: 'inline-flex' }}>
                    Explore Flow AI <ArrowRightIcon size={16} />
                  </Link>
                  <Link href="/sign-in" className={styles.secondaryCta} style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,0.15)' }}>
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Other active products */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {ecosystem.filter(p => p.status === 'active').map((product, idx) => (
                <motion.div 
                  key={idx} 
                  initial="hidden" 
                  whileInView="show" 
                  viewport={{ once: true, margin: "-100px" }} 
                  variants={fadeUp} 
                  className={styles.showcaseCard}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem', gap: '1.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <div className={styles.showcaseIcon} style={{ width: '48px', height: '48px' }}>
                      <Image src={product.icon} alt={product.name} width={28} height={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className={styles.showcaseTitle} style={{ margin: 0 }}>{product.name}</h3>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', padding: '4px 10px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '99px', color: '#00E5FF', textTransform: 'uppercase' }}>
                      ACTIVE
                    </span>
                  </div>
                  
                  <div className={styles.showcaseContent} style={{ flex: 1 }}>
                    <p className={styles.showcaseDesc}>{product.desc}</p>
                  </div>

                  <div style={{ width: '100%' }}>
                    <a href={product.href} {...(product.href.startsWith("http") ? { target: "_blank" } : {})} className={styles.showcaseLink} style={{ width: '100%', justifyContent: 'center' }}>
                      Access Platform <ArrowRightIcon size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
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
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/services/request" className={styles.primaryCta} style={{ display: 'inline-flex' }}>
                 Request Service
              </Link>
              <button onClick={(e) => openContactModal('support@bohenix.africa', e)} className={styles.secondaryCta} style={{ display: 'inline-flex', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                Contact Support
              </button>
            </div>
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
                {service.icon || <BrainCircuit size={32} color="#7B2DFF" />}
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

          <div style={{ maxWidth: '800px', margin: '0 auto 4rem', textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ fontSize: '18px', color: '#B3B3B8', lineHeight: 1.8 }}>
              BX Labs is Bohenix&apos;s frontier research engine. The foundations of Bohenix Flow AI were built here. We operate at the intersection of applied AI, autonomous agents, and deep technology to deliver breakthrough innovations that are commercially viable, ethically grounded, and built for global scale.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {[
              { title: 'Multi-Agent Orchestration', tag: 'Core Research', desc: 'Advanced frameworks allowing diverse AI agents to collaborate, negotiate, and execute complex workflows seamlessly.' },
              { title: 'Generative Workflow Synthesis', tag: 'Applied Research', desc: 'AI models that dynamically generate and optimize business processes based on real-time organizational data.' },
              { title: 'Edge Inference & IoT', tag: 'Infrastructure', desc: 'Low-latency solutions bringing AI processing directly to the device, powering operations in restricted environments.' },
              { title: 'Context-Aware NLP', tag: 'Language AI', desc: 'Deep reasoning language models capable of understanding nuanced business intent and regulatory constraints.' },
            ].map(lab => (
              <div key={lab.title} style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>{lab.title}</h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', color: '#fff', textTransform: 'uppercase' }}>{lab.tag}</span>
                </div>
                <p style={{ fontSize: '15px', color: '#B3B3B8', lineHeight: 1.6, margin: 0 }}>{lab.desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Products in Incubation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {ecosystem.filter(p => p.status === 'development').map(product => (
              <div key={product.name} style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Image src={product.icon} alt={product.name} width={24} height={24} />
                     <h4 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', margin: 0 }}>{product.name}</h4>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', padding: '4px 12px', background: 'rgba(255,152,0,0.1)', borderRadius: '99px', color: '#FF9800', textTransform: 'uppercase' }}>IN DEVELOPMENT</span>
                </div>
                <p style={{ fontSize: '15px', color: '#B3B3B8', lineHeight: 1.6, margin: 0 }}>{product.desc}</p>
                <p style={{ fontSize: '13px', color: '#7B2DFF', fontWeight: 600, margin: '1rem 0 0 0' }}>🚀 Launching soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Section (About & Founder) */}
      <section id="company" className={styles.section} style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Company & Vision</h2>
            <p>Our vision and mission to transform the digital landscape.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', marginBottom: '6rem' }}>
            <motion.div style={{ flex: 1, minWidth: '300px' }} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#B14CFF', fontWeight: 600 }}>Vision</h3>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                To become Africa's leading technology ecosystem powering businesses, governments, and communities through intelligent digital solutions.
              </p>
            </motion.div>
            <motion.div style={{ flex: 1, minWidth: '300px' }} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#00E5FF', fontWeight: 600 }}>Mission</h3>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                Building transformative software products that solve real-world problems and create sustainable economic growth.
              </p>
            </motion.div>
          </div>

          {/* Founder Profile */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px', aspectRatio: '3/4', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(123,45,255,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <Image src="/brian.png" alt="Brian Nyarienya - Founder" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 350px" />
            </div>
          </div>
          <div style={{ flex: 1.5, minWidth: '300px' }}>
            <h2 style={{ fontSize: '48px', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(180deg, #FFFFFF 0%, #7B2DFF 150%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brian Nyarienya</h2>
            <h3 style={{ fontSize: '20px', color: '#7B2DFF', marginBottom: '2rem', fontWeight: 500 }}>Founder & Visionary, Bohenix Technologies</h3>
            <p style={{ fontSize: '24px', lineHeight: 1.6, color: '#fff', fontStyle: 'italic', marginBottom: '2rem' }}>
              "Most people are still modeling the future. We're already deploying it. Bohenix isn't building software — we're building the infrastructure layer Africa hasn't named yet."
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={(e) => openContactModal('ceo@bohenix.africa', e)} className={styles.primaryCta} style={{ cursor: 'pointer' }}>
                Contact Founder
              </button>
              <button onClick={(e) => openContactModal('info@bohenix.africa', e)} className={styles.secondaryCta} style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                Media & Info
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Careers & Partners Section */}
      <section className={styles.section}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          <div style={{ flex: 1, minWidth: '300px', padding: '2rem 0' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '1rem', fontWeight: 700, background: 'linear-gradient(180deg, #FFFFFF 0%, #7B2DFF 150%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Careers</h2>
            <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '16px', lineHeight: 1.6 }}>
              Join us in building the future. We offer open positions, internship opportunities, and graduate programs across engineering, AI research, and operations.
            </p>
            <button onClick={(e) => openContactModal('career@bohenix.africa', e)} className={styles.secondaryCta} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              Apply to Bohenix
            </button>
          </div>
          <div style={{ flex: 1, minWidth: '300px', padding: '2rem 0' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '1rem', fontWeight: 700, background: 'linear-gradient(180deg, #FFFFFF 0%, #7B2DFF 150%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Investors & Partners</h2>
            <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '16px', lineHeight: 1.6 }}>
              We collaborate with governments, NGOs, enterprise clients, and strategic investors to scale impact across the African continent and globally.
            </p>
            <button onClick={(e) => openContactModal('ceo@bohenix.africa', e)} className={styles.secondaryCta} style={{ display: 'inline-flex', cursor: 'pointer' }}>
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
            <h4>Flow AI</h4>
            <ul>
              <li><Link href="/flow-ai">Overview</Link></li>
              <li><Link href="/flow-ai#agents">AI Agents</Link></li>
              <li><Link href="/flow-ai#pricing">Pricing</Link></li>
              <li><Link href="/flow-ai#developers">API & Docs</Link></li>
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
            <h4>Company & Services</h4>
            <ul>
              <li><Link href="/services/request">Service Request</Link></li>
              <li><a href="#solutions">Enterprise Solutions</a></li>
              <li><a href="#company">About Us</a></li>
              <li><button onClick={(e) => openContactModal('career@bohenix.africa', e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', padding: 0 }}>Careers</button></li>
              <li><Link href="/developers">Developer Portal</Link></li>
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
          <div>&copy; {new Date().getFullYear()} Bohenix Technologies. All rights reserved.</div>
          <div>Nairobi, Kenya</div>
        </div>
      </footer>
    </div>
  );
}
