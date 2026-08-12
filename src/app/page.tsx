"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, animate, useSpring } from "framer-motion";
import { ArrowRightIcon, Shield, Database, Cloud, Code, BrainCircuit, Bot, Sparkles, TrendingUp, Headphones, Scale, Briefcase, Zap, CheckCircle } from "lucide-react";
import styles from "./landing.module.css";
import dynamic from "next/dynamic";

import CinematicBackground from "@/components/CinematicBackground";
import PremiumCard from "@/components/PremiumCard";
import PremiumButton from "@/components/PremiumButton";
import WebGLErrorBoundary from "@/components/WebGLErrorBoundary";
import AgentPlayground from "@/components/AgentPlayground";

const TestimonialWall = dynamic(() => import("@/components/TestimonialWall"), { ssr: false });
const LaunchTimer = dynamic(() => import("@/components/LaunchTimer"), { ssr: false });
const AskBohenix = dynamic(() => import("@/components/AskBohenix"), { ssr: false });
const CobeGlobe = dynamic(() => import("@/components/CobeGlobe"), { ssr: false });

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

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

const WORKFORCE_ROSTER = [
  {
    role: "Operations Specialist",
    code: "AGENT-OPS",
    icon: Zap,
    desc: "Autonomous workflow orchestration, multi-system synchronization & process automation.",
    metrics: "99.9% Autonomous",
    tasks: "14,890 tasks/mo"
  },
  {
    role: "Sales & Growth Lead",
    code: "AGENT-SALES",
    icon: TrendingUp,
    desc: "Inbound lead scoring, automated outreach sequences, pipeline revenue forecasting.",
    metrics: "3.4x Conv. Rate",
    tasks: "8,920 deal briefs"
  },
  {
    role: "Finance & M-Pesa Agent",
    code: "AGENT-FIN",
    icon: Briefcase,
    desc: "Instant KES invoice reconciliation, Daraja STK Push processing & audit trail logging.",
    metrics: "0.04s Reconcile",
    tasks: "KES 42M processed"
  },
  {
    role: "Customer Support Specialist",
    code: "AGENT-SUPP",
    icon: Headphones,
    desc: "Instant resolution across Web, Email & WhatsApp, 0ms queue times, 24/7 uptime.",
    metrics: "99.4% CSAT",
    tasks: "31,400 tickets"
  },
  {
    role: "HR & Executive CEO",
    code: "AGENT-EXEC",
    icon: Shield,
    desc: "Company DNA rule enforcement, department agent oversight, daily strategic briefings.",
    metrics: "Policy Guardrail",
    tasks: "Continuous Governance"
  }
];

export default function CorporateLandingPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.9]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 100]);

  const [visitors, setVisitors] = useState<number>(0);
  const [stats, setStats] = useState({ products: 0, users: 0, countries: 0 });

  useEffect(() => {
    // Record visit once on load
    fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});

    const fetchCount = () => {
      fetch('/api/analytics/count')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVisitors(data.visitors || 0);
            setStats({
              products: 1,
              users: data.users || 0,
              countries: data.countries || 0
            });
          }
        })
        .catch(() => {});
    };

    // Fetch once on mount
    fetchCount();

    // Re-fetch only when the tab becomes visible again (not on a timer)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchCount();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPortfolio, setInquiryPortfolio] = useState("");
  const [inquiryBudget, setInquiryBudget] = useState("");
  const [inquiryTimeline, setInquiryTimeline] = useState("");
  const [inquiryServiceType, setInquiryServiceType] = useState("");
  
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
      } else if (contactTarget === 'services@bohenix.africa') {
        payload.targetEmail = 'hello@bohenix.africa';
        payload.subject = `New Service Request: ${inquiryServiceType || 'Custom Project'}`;
        payload.message = `Service Required: ${inquiryServiceType}\nBudget Range: ${inquiryBudget}\nExpected Timeline: ${inquiryTimeline}\n\nProject Details:\n${inquiryMsg}`;
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

  const springConfig = { type: "spring" as const, stiffness: 100, damping: 20 };

  return (
    <div className={styles.container}>
      <CinematicBackground />

      {/* Floating Compressed Navigation */}
      <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logoGroup}>
            <Image src="/bohenixx.png" alt="Bohenix" width={24} height={24} />
            <span className={styles.brandName}>Bohenix</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/flow-ai" className={styles.navLink}>Flow AI</Link>
            <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            <Link href="#company" className={styles.navLink}>Company</Link>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Contact</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            ) : (
              <Link href="/sign-in" className={styles.navBtn}>Sign In</Link>
            )}
            {/* Hamburger — mobile only */}
            <button
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className={styles.hamburger}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(8px)',
            }}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: '320px',
              zIndex: 9999, background: '#0A0A0A', borderLeft: '1px solid rgba(255,255,255,0.08)',
              padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <Link href="/" className={styles.logoGroup} onClick={() => setIsMobileMenuOpen(false)}>
                <Image src="/bohenixx.png" alt="Bohenix" width={22} height={22} />
                <span className={styles.brandName}>Bohenix</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#9CA3AF', padding: '6px 10px', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            {[
              { href: '/flow-ai', label: 'Flow AI' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/services', label: 'Services' },
              { href: '#company', label: 'Company' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '1rem 1.25rem', borderRadius: '12px', color: '#FAFAFA', textDecoration: 'none',
                  fontSize: '16px', fontWeight: 500,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={(e) => { openContactModal('hello@bohenix.africa', e); setIsMobileMenuOpen(false); }}
              style={{
                padding: '1rem 1.25rem', borderRadius: '12px', color: '#FAFAFA', textAlign: 'left',
                fontSize: '16px', fontWeight: 500, cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              Contact
            </button>

            <div style={{ marginTop: 'auto' }}>
              {user ? (
                <Link href="/dashboard" className={styles.navBtn} style={{ display: 'block', textAlign: 'center', padding: '0.85rem', borderRadius: '12px' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/sign-in" className={styles.navBtn} style={{ display: 'block', textAlign: 'center', padding: '0.85rem', borderRadius: '12px' }} onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Dynamic Contact Modal */}
      {isContactModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,5,5,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(24px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={springConfig}
            style={{ background: '#0A0A0A', padding: '3rem', borderRadius: '24px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
          >
            <button onClick={() => setIsContactModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <Image src="/bohenixx.png" alt="Logo" width={32} height={32} />
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.02em', margin: 0 }}>
                {contactTarget === 'services@bohenix.africa' ? 'Request Service' : 'Contact Bohenix'}
              </h3>
            </div>
            <p style={{ color: '#9CA3AF', marginBottom: '2.5rem', fontSize: '14px', lineHeight: 1.6 }}>
              {contactTarget === 'services@bohenix.africa' ? 'Tell us about your project requirements and we will engineer a solution.' : <>Direct inquiry to <strong style={{ color: '#7C3AED' }}>{contactTarget}</strong></>}
            </p>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="email" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="Email Address" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FAFAFA', outline: 'none', fontSize: '14px' }} />
              
              {contactTarget === 'career@bohenix.africa' && (
                <>
                  <input type="text" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FAFAFA', outline: 'none', fontSize: '14px' }} />
                  <input type="url" value={inquiryPortfolio} onChange={(e) => setInquiryPortfolio(e.target.value)} placeholder="LinkedIn or Portfolio URL" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FAFAFA', outline: 'none', fontSize: '14px' }} />
                </>
              )}

              {contactTarget === 'services@bohenix.africa' && (
                <>
                  <select value={inquiryServiceType} onChange={(e) => setInquiryServiceType(e.target.value)} style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#9CA3AF', outline: 'none', fontSize: '14px', appearance: 'none' }}>
                    <option value="">Select Service Type...</option>
                    <option value="Enterprise SaaS Development">Enterprise SaaS Development</option>
                    <option value="Custom Mobile Application">Custom Mobile Application</option>
                    <option value="AI Integration & Automation">AI Integration & Automation</option>
                    <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                  </select>
                </>
              )}
              
              <textarea value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder="Type your message here..." rows={4} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FAFAFA', outline: 'none', resize: 'vertical', fontSize: '14px' }}></textarea>
              
              <PremiumButton onClick={handleSendInquiry} variant="primary" className="mt-2 w-full justify-center">
                {isSendingInquiry ? "Processing..." : "Send Message"}
              </PremiumButton>
            </form>
          </motion.div>
        </div>
      )}

      {/* Cinematic Hero Section */}
      <motion.section 
        ref={heroRef}
        className={styles.hero}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className={styles.heroContent}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.title}>
              <span className={styles.titleLine1}>Build an Entire Company</span>
              <span className={styles.titleLine2}>That Runs Itself.</span>
            </h1>
            <p className={styles.subtitle} style={{ textAlign: 'center', margin: '0 auto 48px' }}>
              Hire AI Employees That Never Sleep. Create an entire digital workforce that manages operations, sales, finance, customer support, and HR.
            </p>
            <div className={styles.ctaGroup}>
              <PremiumButton href="/flow-ai" variant="primary">
                Deploy AI Workforce <ArrowRightIcon size={16} />
              </PremiumButton>
              <PremiumButton href="/flow-ai#demo" variant="secondary">
                View Architecture
              </PremiumButton>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Strip / Social Proof */}
      <section className={styles.section} style={{ padding: '20px 2rem 60px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className={styles.contentContainer}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Trusted by innovative enterprises across Africa
            </span>
          </div>
          <div className={styles.trustedLogos} style={{ display: 'flex', justifyContent: 'center', gap: '48px', opacity: 0.5, flexWrap: 'wrap', filter: 'grayscale(100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 600 }}>
              <Zap size={20} /> Acme Corp
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 600 }}>
              <Shield size={20} /> Nexus Financial
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 600 }}>
              <Code size={20} /> Vuna Tech
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 600 }}>
              <TrendingUp size={20} /> Mboka Logistics
            </div>
          </div>
        </div>
      </section>

      {/* AI Workforce Roster — Premium Monochrome */}
      <section id="workforce-roster" className={styles.section} style={{ padding: '80px 2rem 120px' }}>
        <div className={styles.contentContainer}>

          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Digital Workforce Fleet</div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 600, letterSpacing: '-0.04em', color: '#FAFAFA', margin: 0, lineHeight: 1.1 }}>Autonomous AI Roster</h2>
            </div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: '340px', lineHeight: 1.6, margin: 0, textAlign: 'right' }}>
              Deploy specialized AI agents tailored to every enterprise department in 1-click.
            </p>
          </div>

          {/* Roster rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WORKFORCE_ROSTER.map((agent, idx) => {
              const IconComp = agent.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr auto',
                    gap: '0 2rem',
                    alignItems: 'center',
                    padding: '28px 0',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'default',
                    transition: 'background 0.2s',
                  }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  {/* Index number */}
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', fontWeight: 700, paddingRight: '8px' }}>
                    0{idx + 1}
                  </span>

                  {/* Main content */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'clamp(200px, 28%, 300px) 1fr clamp(120px, 20%, 200px)', gap: '0 2rem', alignItems: 'center' }}>
                    {/* Role + code */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComp size={18} color="#FAFAFA" />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.01em' }}>{agent.role}</div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginTop: '2px', letterSpacing: '0.06em' }}>{agent.code}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                      {agent.desc}
                    </p>

                    {/* Metrics */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>{agent.metrics}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{agent.tasks}</div>
                    </div>
                  </div>

                  {/* Deploy CTA */}
                  <Link
                    href="/dashboard/onboarding"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none',
                      padding: '0.55rem 1.1rem',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      letterSpacing: '0.01em',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                  >
                    Deploy <ArrowRightIcon size={13} />
                  </Link>
                </motion.div>
              );
            })}
            {/* Bottom border */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
          </div>

        </div>
      </section>

      {/* Interactive AI Agent Sandbox Section */}
      <section className={styles.section} style={{ padding: '0 2rem 120px' }}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', margin: '0 auto 48px' }}>
            <h2>Live AI Sandbox Simulator</h2>
            <p>Test agent reasoning loops, tool calls, and financial governance before deploying to production.</p>
          </div>
          <AgentPlayground />
        </div>
      </section>

      {/* Showcase / Product Section */}
      <section id="products" className={styles.section} style={{ padding: '80px 2rem 120px' }}>
        <div className={styles.contentContainer}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springConfig}
            className={styles.sectionHeader}
            style={{ textAlign: 'center', margin: '0 auto 64px' }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', display: 'block' }}>Engineered Ecosystem</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, letterSpacing: '-0.03em', color: '#FAFAFA', margin: '0 0 16px' }}>Product & Services</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>From autonomous AI agent platforms to custom enterprise engineering, explore our core ecosystem capabilities.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>

            {/* Flow AI Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '44px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                position: 'relative',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)', translateY: -4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/bohenixx.png" alt="Bohenix Flow AI" width={26} height={26} />
                </div>
                <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: '999px' }}>
                  PRODUCT
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FAFAFA', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Bohenix Flow AI</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                  An AI-first SaaS platform that enables businesses to delegate complete workflows to autonomous AI agents — managing projects, invoices, customer follow-ups, and performance analytics.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                {['24/7 Autonomous', 'M-Pesa Native', 'RBAC Governance'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.78rem', fontFamily: 'monospace', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                    • {tag}
                  </span>
                ))}
              </div>

              <PremiumButton href="/dashboard/onboarding" variant="primary" className="w-full justify-center">
                Deploy AI Workforce <ArrowRightIcon size={15} />
              </PremiumButton>
            </motion.div>

            {/* Enterprise Engineering / Services Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '44px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                position: 'relative',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)', translateY: -4 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code size={22} color="#FAFAFA" />
                </div>
                <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: '999px' }}>
                  SERVICES
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#FAFAFA', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Enterprise Engineering</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                  Bespoke AI system design, Neural Core integrations, and custom agent architectures for enterprise teams. We build the infrastructure that powers your autonomous operations at scale.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                {['Custom Agents', 'API Integrations', 'SLA Support'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.78rem', fontFamily: 'monospace', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}>
                    • {tag}
                  </span>
                ))}
              </div>

              <PremiumButton href="/services" variant="secondary" className="w-full justify-center">
                View Services <ArrowRightIcon size={15} />
              </PremiumButton>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Global Scale Section */}
      <section id="presence" className={styles.section} style={{ padding: '120px 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className={styles.contentContainer} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '64px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '48px', marginBottom: '24px', fontWeight: 600, letterSpacing: '-0.03em' }}>
              Operating Globally.
            </h2>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: '#9CA3AF', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '8px' }}>Global Telemetry</div>
              <div style={{ fontSize: '56px', fontWeight: 600, color: '#FAFAFA', lineHeight: 1, letterSpacing: '-0.04em' }}>
                <AnimatedNumber value={visitors} />
              </div>
            </div>
            <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.6 }}>
              The Bohenix ecosystem is growing rapidly. We engineer robust, intelligent infrastructure that scales effortlessly across borders, connecting millions of endpoints with deterministic precision.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
            <Suspense fallback={<div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>Loading Globe...</div>}>
              <WebGLErrorBoundary>
                <CobeGlobe />
              </WebGLErrorBoundary>
            </Suspense>
          </div>
        </div>
      </section>

      {/* Company Section (About & Founder) */}
      <section id="company" className={styles.section} style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', margin: '0 auto 80px' }}>
            <h2>Company & Vision</h2>
            <p>Our vision and mission to transform the digital landscape.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '80px' }}>
            <PremiumCard style={{ padding: '48px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#FAFAFA', fontWeight: 600 }}>Vision</h3>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#9CA3AF' }}>
                To become Africa's leading technology ecosystem powering businesses, governments, and communities through intelligent digital solutions.
              </p>
            </PremiumCard>
            <PremiumCard style={{ padding: '48px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#FAFAFA', fontWeight: 600 }}>Mission</h3>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#9CA3AF' }}>
                Building transformative software products that solve real-world problems and create sustainable economic growth.
              </p>
            </PremiumCard>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
              <PremiumCard style={{ padding: '0', width: '100%', maxWidth: '350px', aspectRatio: '3/4' }}>
                <Image src="/brian.png" alt="Brian Nyarienya - Founder" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 350px" />
              </PremiumCard>
            </div>
            <div style={{ flex: 1.5, minWidth: '300px' }}>
              <h2 style={{ fontSize: '48px', marginBottom: '8px', fontWeight: 600, letterSpacing: '-0.03em', color: '#FAFAFA' }}>Brian Nyarienya</h2>
              <h3 style={{ fontSize: '20px', color: '#7C3AED', marginBottom: '32px', fontWeight: 500 }}>Founder & Visionary, Bohenix Technologies</h3>
              <p style={{ fontSize: '24px', lineHeight: 1.6, color: '#FAFAFA', fontStyle: 'italic', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                "Most people are still modeling the future. We're already deploying it. Bohenix isn't building software — we're building the infrastructure layer Africa hasn't named yet."
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <PremiumButton onClick={(e: React.MouseEvent) => openContactModal('ceo@bohenix.africa', e)} variant="primary">
                  Contact Founder
                </PremiumButton>
                <PremiumButton onClick={(e: React.MouseEvent) => openContactModal('info@bohenix.africa', e)} variant="secondary">
                  Media & Info
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <AskBohenix />
      </Suspense>

      <section className={styles.section} style={{ padding: '80px 2rem' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Loading testimonials...</div>}>
          <TestimonialWall />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <LaunchTimer />
      </Suspense>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logoGroup} style={{ marginBottom: "24px" }}>
              <Image src="/bohenixx.png" alt="Logo" width={24} height={24} style={{ filter: 'grayscale(100%) brightness(200%)' }} />
              <span className={styles.brandName}>Bohenix</span>
            </Link>
            <p>Building the infrastructure layer for autonomous companies and intelligent digital ecosystems.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Platform</h4>
            <ul>
              <li><Link href="/flow-ai">Flow AI</Link></li>
              <li><Link href="/dashboard/onboarding">Deploy AI Workforce</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#company">About</a></li>
              <li><button onClick={() => openContactModal('career@bohenix.africa')}>Careers</button></li>
              <li><button onClick={() => openContactModal('ceo@bohenix.africa')}>Investors</button></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact</h4>
            <ul>
              <li><button onClick={() => openContactModal('hello@bohenix.africa')}>Sales</button></li>
              <li><button onClick={() => openContactModal('support@bohenix.africa')}>Support</button></li>
              <li><button onClick={() => openContactModal('info@bohenix.africa')}>Press</button></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div>&copy; {new Date().getFullYear()} Bohenix Technologies. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="https://x.com/bohenix_solutio" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
              X (Twitter)
            </a>
            <a href="https://www.linkedin.com/in/brian-nyarienya-35892925b/" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
              LinkedIn
            </a>
            <a href="https://wa.me/254711000000" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
              WhatsApp
            </a>
            <a href="https://www.instagram.com/bohenix" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
