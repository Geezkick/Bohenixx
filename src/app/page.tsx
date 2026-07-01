"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, Shield, Database, Cloud, Code, BrainCircuit, ExternalLink } from "lucide-react";
import styles from "./landing.module.css";

// Dynamic imports to prevent hydration mismatches
const TestimonialWall = dynamic(() => import("@/components/TestimonialWall"), { ssr: false });
const LaunchTimer = dynamic(() => import("@/components/LaunchTimer"), { ssr: false });
const AskBohenix = dynamic(() => import("@/components/AskBohenix"), { ssr: false });
const CobeGlobe = dynamic(() => import("@/components/CobeGlobe"), { 
  ssr: false, 
  loading: () => <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Earth...</div> 
});

import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";

const ecosystem = [
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform powering safer commutes with real-time alerts.", icon: "/njiasafee.png", href: "https://njiasafe.six.vercel.app", color: "rgba(0, 229, 255, 0.15)", border: "rgba(0, 229, 255, 0.3)" },
  { name: "BX Omni", desc: "AI-powered Digital Operations Twin that optimizes your business processes autonomously.", icon: "/bohenixx.png", href: "https://bohenixx.vercel.app", color: "rgba(177, 76, 255, 0.15)", border: "rgba(177, 76, 255, 0.3)" },
  { name: "Fixxo", desc: "Smart maintenance and service marketplace connecting technicians with clients via AI.", icon: "/fixxo.png", href: "https://fixxo.vercel.app", color: "rgba(255, 152, 0, 0.15)", border: "rgba(255, 152, 0, 0.3)" },
  { name: "Safura", desc: "Autonomous AI food scanner that surfaces nutritional values and allergen warnings instantly.", icon: "/safura.png", href: "https://safura-ai.vercel.app", color: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)" },
];

const services = [
  { 
    title: "Enterprise Software Engineering", 
    desc: "Production-grade systems, from high-traffic web platforms to complex SaaS products built for extreme scale.",
    items: ["Full-Stack Web Applications", "Cross-Platform Mobile Apps", "API Design & Integration"],
  },
  { 
    title: "Artificial Intelligence & Machine Learning", 
    desc: "Intelligent systems that transform operations. Custom AI agents, predictive models, and autonomous frameworks.",
    items: ["Custom AI Agents & Copilots", "Workflow Automation & RPA", "Predictive Analytics"],
  },
  { 
    title: "Cybersecurity & Compliance", 
    desc: "Proactive threat detection, penetration testing, and compliance auditing built into every layer.",
    items: ["Penetration Testing & Red Teaming", "Zero-Trust Architecture", "Compliance Auditing"],
  },
  { 
    title: "Cloud Infrastructure & DevOps", 
    desc: "Resilient environments across AWS, GCP, and Azure with automated CI/CD pipelines.",
    items: ["Multi-Cloud Architecture", "Kubernetes Orchestration", "CI/CD Automation"],
  },
];

export default function CorporateLandingPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);
  
  // Wait for client mount to avoid hydration mismatch on dynamic user elements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll animations
  const { scrollY } = useScroll();
  const heroVideoScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const heroVideoOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const heroTextY = useTransform(scrollY, [0, 300], [0, 100]);
  const heroTextOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Live Analytics
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

  // Contact Form
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState("hello@bohenix.africa");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);

  const openContactModal = (target: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setContactTarget(target);
    setIsContactModalOpen(true);
  };

  const handleSendInquiry = async () => {
    if(!inquiryEmail || !inquiryMsg) {
      showNotification({ title: "Missing Fields", message: "Please provide both an email and a message.", type: "warning" });
      return;
    }
    setIsSendingInquiry(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inquiryEmail, message: inquiryMsg, subject: `Inquiry to ${contactTarget}`, targetEmail: contactTarget })
      });
      const data = await res.json();
      if (data.success) {
        showNotification({ title: "Sent", message: "Inquiry successfully delivered.", type: "success" });
        setIsContactModalOpen(false);
        setInquiryEmail(""); setInquiryMsg("");
      } else {
        showNotification({ title: "Failed", message: data.error || "Delivery failed.", type: "error" });
      }
    } catch {
      showNotification({ title: "Error", message: "Network error.", type: "error" });
    } finally {
      setIsSendingInquiry(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundFX}></div>
      <div className={styles.noiseOverlay}></div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logoGroup}>
            <Image src="/bohenixx.png" alt="Logo" width={28} height={28} style={{ borderRadius: '8px' }} />
            <span className={styles.brandName}>Bohenix ONE</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#products" className={styles.navLink}>Ecosystem</Link>
            <Link href="#solutions" className={styles.navLink}>Solutions</Link>
            <Link href="/dashboard/developer" className={styles.navLink}>Developers</Link>
            <Link href="#labs" className={styles.navLink}>BX Labs</Link>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.navLink} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Contact</button>
          </div>
          <div>
            {mounted && user ? (
              <Link href="/dashboard" className={styles.navBtn}>Dashboard</Link>
            ) : (
              <Link href="/sign-in" className={styles.navBtn}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,5,5,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: '#111114', padding: '3rem', borderRadius: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}
            >
              <button onClick={() => setIsContactModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
              <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Send Inquiry</h3>
              <p style={{ color: '#a1a1aa', marginBottom: '2.5rem', fontSize: '15px' }}>Directly to <strong style={{ color: '#B14CFF' }}>{contactTarget}</strong></p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input type="email" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="Your Email Address" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                <textarea value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder="Type your message here..." rows={5} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fff', outline: 'none', resize: 'vertical', fontSize: '15px' }}></textarea>
                <button disabled={isSendingInquiry} onClick={handleSendInquiry} style={{ background: 'linear-gradient(90deg, #B14CFF, #7B2DFF)', color: '#fff', padding: '1.25rem', borderRadius: '16px', border: 'none', fontSize: '16px', fontWeight: 600, cursor: isSendingInquiry ? 'not-allowed' : 'pointer', opacity: isSendingInquiry ? 0.7 : 1 }}>
                  {isSendingInquiry ? "Sending..." : "Send Message"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div style={{ y: heroTextY, opacity: heroTextOpacity }} className={styles.heroContent}>
          <div className={styles.heroLabel}>AI • Software • Digital Infrastructure</div>
          <h1 className={styles.title}>
            Building Africa's <br />
            <span className={styles.textPurple}>Intelligent</span> Digital Future.
          </h1>
          <p className={styles.subtitle}>
            Bohenix develops AI, mobility, fintech, productivity, business automation, and digital infrastructure solutions for Africa and beyond.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="#products" className={styles.primaryCta}>
              Explore Ecosystem <ArrowRightIcon size={18} />
            </Link>
            <button onClick={(e) => openContactModal('hello@bohenix.africa', e)} className={styles.secondaryCta} style={{ cursor: 'pointer' }}>
              Partner With Us
            </button>
          </div>
        </motion.div>
      </section>

      {/* Hero Video (Cinematic Scroll Scaling) */}
      <div style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div style={{ scale: heroVideoScale, opacity: heroVideoOpacity, width: '100%', maxWidth: '1200px', height: '100%', borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="/bohenixx.mp4" />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #050505 100%)' }} />
        </motion.div>
      </div>

      {/* AI Widget */}
      <AskBohenix />

      {/* African Presence Globe */}
      <section id="presence" className={styles.section} style={{ paddingTop: '12rem' }}>
        <div className={styles.contentContainer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
              Active Across Africa
            </motion.h2>
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem 2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem', width: 'fit-content' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 20px #00E5FF' }} />
              <div>
                <div style={{ color: '#a1a1aa', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px' }}>Live Connection</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{visitors > 0 ? visitors.toLocaleString() : 'Active'}</div>
              </div>
            </motion.div>

            <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: 1.6 }}>
              The Bohenix ecosystem is rapidly expanding across the continent, connecting communities through intelligent technology that understands local context and delivers real-world impact at scale.
            </motion.p>
          </div>
          <div style={{ height: '600px', position: 'relative' }}>
            <CobeGlobe />
          </div>
        </div>
      </section>

      {/* Bento Box Products Showcase */}
      <section id="products" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Ecosystem Products</h2>
            <p>Our intelligent platforms solve complex real-world challenges across multiple industries.</p>
          </motion.div>

          <div className={styles.bentoGrid}>
            {ecosystem.map((product, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp} 
                className={`${styles.bentoCard} ${idx === 0 || idx === 3 ? styles.bentoItemLarge : ''}`}
              >
                <div className={styles.bentoGlow} style={{ background: `radial-gradient(circle, ${product.color} 0%, transparent 70%)` }} />
                
                <div className={styles.bentoHeader}>
                  <div className={styles.bentoIconWrap} style={{ borderColor: product.border }}>
                    <Image src={product.icon} alt={product.name} width={32} height={32} />
                  </div>
                  <span className={styles.bentoBadge}>IN DEVELOPMENT</span>
                </div>
                
                <h3 className={styles.bentoTitle}>{product.name}</h3>
                <p className={styles.bentoDesc}>{product.desc}</p>
                
                <div className={styles.bentoFooter}>
                  {mounted && user?.email === 'nyarienyabrian05@gmail.com' ? (
                    <a href={product.href} target="_blank" className={styles.bentoLink}>
                      Access Platform <ExternalLink size={16} />
                    </a>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 500, margin: 0 }}>
                      🚀 Launching soon from BX Labs
                    </p>
                  )}
                </div>

                <Image 
                  src={product.icon} 
                  alt={product.name} 
                  width={300} 
                  height={300} 
                  className={styles.bentoImage}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Launch Date Timer */}
      <section className={styles.section} style={{ paddingTop: '4rem' }}>
        <LaunchTimer />
      </section>

      {/* Client Testimonial Wall */}
      <section className={styles.section}>
        <TestimonialWall />
      </section>

      {/* Enterprise Solutions Section */}
      <section id="solutions" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className={styles.sectionHeader}>
            <h2>Enterprise Solutions</h2>
            <p>End-to-end technological excellence for organizations that require absolute reliability and extreme scale.</p>
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
                <BrainCircuit size={32} color="#B14CFF" />
                <h3>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <ul className={styles.serviceList}>
                  {service.items.map((item, i) => (
                    <li key={i}><div style={{ marginTop: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#B14CFF', flexShrink: 0 }} /> {item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section id="company" className={styles.section}>
        <div className={styles.contentContainer}>
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', padding: '4rem' }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(139,46,255,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <Image src="/brian.png" alt="Brian Nyarienya - Founder" layout="fill" objectFit="cover" />
            </div>
            <div>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Brian Nyarienya</h2>
              <h3 style={{ fontSize: '1.25rem', color: '#B14CFF', marginBottom: '2.5rem', fontWeight: 500 }}>Founder & Visionary, Bohenix Technologies</h3>
              <p style={{ fontSize: '1.75rem', lineHeight: 1.5, color: '#fff', fontStyle: 'italic', marginBottom: '3rem' }}>
                "Most people are still modeling the future. We're already deploying it. Bohenix isn't building software — we're building the infrastructure layer Africa hasn't named yet."
              </p>
              <button onClick={(e) => openContactModal('ceo@bohenix.africa', e)} className={styles.primaryCta} style={{ border: 'none', cursor: 'pointer' }}>
                Contact Founder
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logoGroup} style={{ marginBottom: "1.5rem" }}>
              <Image src="/bohenixx.png" alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
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
              <li><button onClick={(e) => openContactModal('hello@bohenix.africa', e)}>hello@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('ceo@bohenix.africa', e)}>ceo@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('career@bohenix.africa', e)}>career@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('support@bohenix.africa', e)}>support@bohenix.africa</button></li>
              <li><button onClick={(e) => openContactModal('info@bohenix.africa', e)}>info@bohenix.africa</button></li>
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
