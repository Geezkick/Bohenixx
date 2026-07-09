"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightIcon, Shield, Lock, Eye, Server, Key, FileCheck, Activity,
  Users, DollarSign, Calculator, Headphones, Cog, Megaphone, Scale, ClipboardList, Calendar, TrendingUp,
  MessageSquare, BrainCircuit, ListChecks, Zap, BarChart, Bell, LayoutDashboard, FileText, Blocks, UsersRound, ShieldCheck, Wrench, LineChart,
  Truck, HeartPulse, Landmark, GraduationCap, ShoppingCart, Factory, HardHat, Hotel, Building2, Globe, Briefcase, Laptop,
  Cloud, MessageCircle, Mail, Paperclip, GitBranch, Video, CreditCard, Bot, Settings, ChevronRight, Mic, Users2
} from "lucide-react";
import s from "./flowai.module.css";

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

const employees = [
  { icon: <ClipboardList size={24} color="#7B2DFF" />, name: "Sophia", role: "AI Project Manager", skills: ["Plans projects", "Assigns tasks", "Runs standups", "Generates reports", "Tracks deadlines"], stats: { performance: "98%", tasks: 412 }, avatar: "/avatars/sophia.png" },
  { icon: <Calculator size={24} color="#7B2DFF" />, name: "Alex", role: "AI Accountant", skills: ["Invoices", "Payroll", "Taxes", "Forecasts", "Expenses", "Revenue"], stats: { performance: "99%", tasks: 856 }, avatar: "/avatars/alex.png" },
  { icon: <Users size={24} color="#7B2DFF" />, name: "Maya", role: "AI HR Manager", skills: ["Hiring", "Leave", "Contracts", "Training", "Reviews"], stats: { performance: "97%", tasks: 231 }, avatar: "/avatars/maya.png" },
  { icon: <DollarSign size={24} color="#7B2DFF" />, name: "Ethan", role: "Sales Director", skills: ["Leads", "Follow-ups", "CRM", "Deals", "Negotiations", "Emails"], stats: { performance: "95%", tasks: 1204 }, avatar: "/avatars/ethan.png" },
];

const departments = [
  { name: "Sales Department", icon: <TrendingUp size={24} color="#00E5FF" />, employees: ["Sales Director AI", "Lead Generator AI", "Proposal Writer AI", "Follow-up AI", "Closing AI"] },
  { name: "Finance Department", icon: <Landmark size={24} color="#00E5FF" />, employees: ["Bookkeeper", "Payroll", "Auditor", "Forecasting", "Invoice Manager", "Tax Assistant"] },
  { name: "Marketing Department", icon: <Megaphone size={24} color="#00E5FF" />, employees: ["Social Media AI", "SEO AI", "Ads Manager", "Content Writer", "Designer", "Video Creator", "Analytics"] },
  { name: "Customer Success", icon: <HeartPulse size={24} color="#00E5FF" />, employees: ["Support", "Email", "WhatsApp", "Live Chat", "CRM", "Retention", "Surveys"] },
];

const capabilities = [
  { icon: <BrainCircuit size={24} color="#7B2DFF" />, title: "Bohenix Neural Core", desc: "Shared memory, knowledge graph, and reasoning engine that powers every AI employee." },
  { icon: <Blocks size={24} color="#7B2DFF" />, title: "Flow Canvas", desc: "Drag and drop employees, departments, and workflows into a visual board to build your company." },
  { icon: <ShoppingCart size={24} color="#7B2DFF" />, title: "AI Marketplace", desc: "Install entire departments (e.g., 'Restaurant Department') with a single click." },
  { icon: <Activity size={24} color="#7B2DFF" />, title: "AI Digital Twin", desc: "Simulate business decisions. Predict revenue, churn, cash flow, and stock demands." },
  { icon: <LayoutDashboard size={24} color="#7B2DFF" />, title: "CEO Command Center", desc: "Beautiful 3D dashboard showing business health, AI activity, and predictive alerts." },
  { icon: <Mic size={24} color="#7B2DFF" />, title: "Voice Operating System", desc: "Just say 'Flow, prepare payroll.' Your AI executes complex tasks without a single click." },
  { icon: <Users2 size={24} color="#7B2DFF" />, title: "AI Meeting Room", desc: "Virtual boardroom where your AI executives discuss the company and generate recommendations." },
  { icon: <Zap size={24} color="#7B2DFF" />, title: "Autonomous Mode", desc: "Switch to AUTO. Flow checks emails, CRM, invoices, and marketing every minute to run your company." },
];

const ecosystem = [
  { icon: <Briefcase size={32} color="#7B2DFF" />, name: "Mboka AI", desc: "Recruitment & Talent" }, 
  { icon: <Truck size={32} color="#7B2DFF" />, name: "NjiaSafe", desc: "Logistics & Routing" },
  { icon: <Cloud size={32} color="#7B2DFF" />, name: "Bohenix Cloud", desc: "Data & Storage" },
];

export default function FlowAIPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle"|"success">("idle");
  const [currency, setCurrency] = useState<"USD"|"KES">("USD");

  const PRICING = {
    Starter: { usd: 19, kes: 2450 },
    Professional: { usd: 49, kes: 6350 },
  };

  const openCheckout = (plan: string) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
    setPaymentStatus("idle");
    setIsProcessing(false);
  };

  const [mpesaPhone, setMpesaPhone] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/flow-ai/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, currency: currency.toLowerCase() })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize checkout. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.bgFx}/>
      {/* Nav */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <Link href="/" className={s.logoGroup}>
            <Image src="/bohenixx.png" alt="Bohenix" width={28} height={28}/>
            <span className={s.brandName}>Bohenix</span>
          </Link>
          <div className={s.navLinks}>
            <Link href="#overview" className={s.navLink}>Overview</Link>
            <Link href="#employees" className={s.navLink}>AI Employees</Link>
            <Link href="#departments" className={s.navLink}>Departments</Link>
            <Link href="#core" className={s.navLink}>Neural Core</Link>
          </div>
          <button onClick={() => openCheckout("Free Trial")} className={s.navBtn} style={{ cursor: "pointer" }}>Start Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section id="overview" className={s.hero}>
        <motion.div className={s.heroInner} initial="hidden" animate="show" variants={{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:0.15}}}}>
          <motion.div variants={fade} className={s.heroBadge}><span className={s.heroBadgeDot}/> The World's First AI Workforce OS for Africa</motion.div>
          <motion.h1 variants={fade} className={s.heroTitle}>Build an <span className={s.heroGradient}>Autonomous Company</span></motion.h1>
          <motion.p variants={fade} className={s.heroSub}>Hire AI employees. Build AI departments. Run your company autonomously. Create an entire digital workforce that manages operations, sales, finance, customer support, HR, and projects—all working together like a real company.</motion.p>
          <motion.div variants={fade} className={s.heroCtas}>
            <button onClick={() => openCheckout("Free Trial")} className={s.ctaPrimary} style={{ cursor: "pointer" }}>Hire AI Workforce <ArrowRightIcon size={18}/></button>
            <Link href="#demo" className={s.ctaSecondary}>Watch Demo</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Employees */}
      <section id="employees" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>AI Employees</div>
            <h2 className={s.sectionTitle}>Meet Your New Digital Team</h2>
            <p className={s.sectionDesc}>Don't just delegate tasks. Hire dedicated AI employees with unique roles, skills, and performance metrics.</p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {employees.map((emp, i) => (
              <motion.div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column' }} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#111114', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(123,45,255,0.3)' }}>
                    {emp.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{emp.name}</h3>
                    <p style={{ color: '#7B2DFF', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{emp.role}</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: '#B3B3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 600 }}>Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {emp.skills.map((skill, j) => (
                      <span key={j} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', color: '#fff' }}>✓ {skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#B3B3B8', margin: '0 0 4px' }}>Performance</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e', margin: 0 }}>{emp.stats.performance}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: '#B3B3B8', margin: '0 0 4px' }}>Tasks Completed</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>{emp.stats.tasks}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments & Org Chart */}
      <section id="departments" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade} style={{textAlign: 'center'}}>
            <div className={s.sectionLabel} style={{justifyContent: 'center'}}>Organization</div>
            <h2 className={s.sectionTitle}>Companies don't buy agents. They buy departments.</h2>
            <p className={s.sectionDesc} style={{margin: '0 auto'}}>Scale your operations by deploying entire AI departments that communicate and collaborate automatically.</p>
          </motion.div>

          {/* Org Chart Visualization */}
          <motion.div style={{ margin: '4rem auto', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div style={{ padding: '1rem 2rem', background: 'linear-gradient(135deg, #7B2DFF 0%, #00E5FF 100%)', borderRadius: '12px', fontWeight: 700, fontSize: '1.2rem', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(123,45,255,0.3)' }}>CEO Command Center</div>
            <div style={{ width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ padding: '1rem 2rem', background: '#111114', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 600, marginBottom: '2rem' }}>AI COO (Neural Core)</div>
            
            <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12.5%', width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ position: 'absolute', left: '37.5%', width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ position: 'absolute', left: '62.5%', width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ position: 'absolute', left: '87.5%', width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', width: '100%', marginTop: '40px' }}>
              {departments.map((dept, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ marginBottom: '1rem', color: '#00E5FF' }}>{dept.icon}</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{dept.name}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                    {dept.employees.slice(0, 3).map((e, j) => (
                      <li key={j} style={{ fontSize: '0.8rem', color: '#B3B3B8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7B2DFF' }} />
                        {e}
                      </li>
                    ))}
                    {dept.employees.length > 3 && (
                      <li style={{ fontSize: '0.8rem', color: '#7B2DFF', marginTop: '0.5rem', fontWeight: 600 }}>+ {dept.employees.length - 3} more AI roles</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section id="core" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>The OS Architecture</div>
            <h2 className={s.sectionTitle}>Built for the Enterprise</h2>
            <p className={s.sectionDesc}>Flow AI is more than just a workflow tool. It's a complete operating system designed to run your entire company.</p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
            {capabilities.map((cap, i) => (
              <motion.div key={i} style={{ background: '#0A0A0C', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem' }} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(123,45,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(123,45,255,0.2)' }}>
                  {cap.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{cap.title}</h3>
                <p style={{ color: '#B3B3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Integration */}
      <section id="ecosystem" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap} style={{textAlign:'center'}}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel} style={{justifyContent:'center'}}>Bohenix Ecosystem</div>
            <h2 className={s.sectionTitle} style={{margin:'0 auto 1.5rem'}}>The Intelligent Hub</h2>
            <p className={s.sectionDesc} style={{margin:'0 auto'}}>Flow AI connects securely across all Bohenix applications, breaking down silos and enabling true cross-platform automation.</p>
          </motion.div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '4rem' }}>
            {ecosystem.map((sys,i) => (
              <motion.div key={i} style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem', width: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div style={{ marginBottom: '1.5rem' }}>{sys.icon}</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{sys.name}</h4>
                <p style={{ color: '#B3B3B8', fontSize: '0.9rem', margin: 0 }}>{sys.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className={s.finalCta}>
        <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
          <h2 className={s.finalCtaTitle}>The Future Vision is <span className={s.heroGradient}>Now</span></h2>
          <p className={s.finalCtaDesc}>Imagine walking into your office. You don't hire 20 people. You hire 200 AI employees. They work 24/7. Never forget. Never sleep. Never miss deadlines.</p>
          <div className={s.heroCtas}>
            <button onClick={() => openCheckout("Enterprise")} className={s.ctaPrimary} style={{ cursor: "pointer" }}>Deploy Your AI Workforce <ArrowRightIcon size={18}/></button>
          </div>
        </motion.div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,5,5,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{ background: '#111114', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            >
              <button onClick={() => setIsCheckoutOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#B3B3B8', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
              
              <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Initialize Workforce</h3>
              <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '15px' }}>Booting up your Bohenix Flow AI environment.</p>
              
              {paymentStatus === "success" ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: '64px', height: '64px', background: '#52B44B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <ShieldCheck size={32} color="#fff" />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '0.5rem' }}>Success!</h4>
                  <p style={{ color: '#B3B3B8' }}>Your AI Workforce is being provisioned.</p>
                </div>
              ) : (
                <form onSubmit={handlePayment}>
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    style={{ 
                      width: '100%', 
                      background: '#7B2DFF', 
                      color: '#fff', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      border: 'none', 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      opacity: isProcessing ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isProcessing ? <Activity size={18} className={s.spin} /> : null}
                    {isProcessing ? "Deploying..." : "Start Building"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
