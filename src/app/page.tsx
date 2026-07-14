"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, animate, useSpring } from "framer-motion";
import { ArrowRightIcon, Shield, Database, Cloud, Code, BrainCircuit } from "lucide-react";
import styles from "./landing.module.css";
import dynamic from "next/dynamic";

import CinematicBackground from "@/components/CinematicBackground";
import PremiumCard from "@/components/PremiumCard";
import PremiumButton from "@/components/PremiumButton";

const TestimonialWall = dynamic(() => import("@/components/TestimonialWall"), { ssr: false });
const LaunchTimer = dynamic(() => import("@/components/LaunchTimer"), { ssr: false });
const AskBohenix = dynamic(() => import("@/components/AskBohenix"), { ssr: false });
const CobeGlobe = dynamic(() => import("@/components/CobeGlobe"), { ssr: false });

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

// Utility component for animated numbers
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

export default function CorporateLandingPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  // Scrolled state for Navbar
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Scroll animations for sections
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.9]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 100]);

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
              products: 1, 
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

  // Contact Form Logic (Preserved exactly)
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
            <Link href="#company" className={styles.navLink}>Company</Link>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Contact</button>
          </div>
          <div>
            {user ? (
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            ) : (
              <Link href="/sign-in" className={styles.navBtn}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

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
              Build an Entire Company <br />
              <span style={{ color: '#9CA3AF' }}>That Runs Itself.</span>
            </h1>
            <p className={styles.subtitle}>
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

      {/* Showcase / Product Section */}
      <section id="products" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springConfig}
            className={styles.sectionHeader}
            style={{ textAlign: 'center', margin: '0 auto 80px' }}
          >
            <h2>Engineered Ecosystem</h2>
            <p>From autonomous AI agents to industry-specific platforms, discover the tools powering the next generation of business.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
            {/* Flow AI Card */}
            <PremiumCard style={{ padding: '64px 48px', textAlign: 'center' }}>
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <Image src="/bohenixx.png" alt="Bohenix Flow AI" width={64} height={64} style={{ filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.4))' }} />
                </div>
                <h3 style={{ fontSize: '40px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.03em' }}>Bohenix Flow AI</h3>
                <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '40px', lineHeight: 1.6 }}>
                  An AI-first SaaS platform that enables businesses to delegate complete workflows to autonomous AI agents. Hire AI employees to manage projects, generate invoices, follow up with customers, and analyze performance.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <PremiumButton href="/flow-ai" variant="primary">
                    Explore Flow AI
                  </PremiumButton>
                </div>
              </div>
            </PremiumCard>

            {/* Custom Engineering Card */}
            <PremiumCard style={{ padding: '64px 48px', textAlign: 'center' }}>
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Code size={32} color="#FAFAFA" />
                  </div>
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.02em' }}>Enterprise Engineering</h3>
                <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '40px', lineHeight: 1.6 }}>
                  Beyond our flagship, we build world-class custom software. From complex enterprise ERP systems and intelligent mobile applications to secure cloud infrastructures.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <PremiumButton onClick={() => openContactModal('services@bohenix.africa')} variant="secondary">
                    Request Services
                  </PremiumButton>
                </div>
              </div>
            </PremiumCard>
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
              <CobeGlobe />
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

          {/* Founder Profile */}
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
                <PremiumButton onClick={(e: any) => openContactModal('ceo@bohenix.africa', e)} variant="primary">
                  Contact Founder
                </PremiumButton>
                <PremiumButton onClick={(e: any) => openContactModal('info@bohenix.africa', e)} variant="secondary">
                  Media & Info
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Bohenix AI */}
      <Suspense fallback={null}>
        <AskBohenix />
      </Suspense>

      {/* Testimonials */}
      <section className={styles.section} style={{ padding: '80px 2rem' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Loading testimonials...</div>}>
          <TestimonialWall />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <LaunchTimer />
      </Suspense>

      {/* Footer */}
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
              <li><Link href="/flow-ai#agents">Neural Core</Link></li>
              <li><Link href="/flow-ai#pricing">Pricing</Link></li>
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
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="https://x.com/bohenix_solutio" target="_blank" style={{ color: '#9CA3AF', textDecoration: 'none' }}>X (Twitter)</a>
            <a href="https://www.linkedin.com/in/brian-nyarienya-35892925b/" target="_blank" style={{ color: '#9CA3AF', textDecoration: 'none' }}>LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
