"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightIcon, Shield, Lock, Eye, Server, Key, FileCheck, Activity,
  Users, DollarSign, Calculator, Headphones, Cog, Megaphone, Scale, ClipboardList, Calendar, TrendingUp,
  MessageSquare, BrainCircuit, ListChecks, Zap, BarChart, Bell, LayoutDashboard, FileText, Blocks, UsersRound, ShieldCheck, Wrench, LineChart,
  Truck, HeartPulse, Landmark, GraduationCap, ShoppingCart, Factory, HardHat, Hotel, Building2, Globe, Briefcase, Laptop,
  Cloud, MessageCircle, Mail, Paperclip, GitBranch, Video, CreditCard, Bot, Settings
} from "lucide-react";
import s from "./flowai.module.css";

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

const agents = [
  { icon: <Users size={24} color="#7B2DFF" />, name: "HR Agent", desc: "Automate hiring, onboarding, payroll, and employee management workflows." },
  { icon: <DollarSign size={24} color="#7B2DFF" />, name: "Sales Agent", desc: "Manage leads, follow-ups, proposals, and close deals autonomously." },
  { icon: <Calculator size={24} color="#7B2DFF" />, name: "Finance Agent", desc: "Generate invoices, track expenses, reconcile accounts, and forecast revenue." },
  { icon: <Headphones size={24} color="#7B2DFF" />, name: "Support Agent", desc: "Resolve tickets, answer FAQs, escalate issues, and measure CSAT." },
  { icon: <Cog size={24} color="#7B2DFF" />, name: "Operations Agent", desc: "Optimize supply chains, logistics, inventory, and internal processes." },
  { icon: <Megaphone size={24} color="#7B2DFF" />, name: "Marketing Agent", desc: "Create campaigns, analyze performance, segment audiences, and optimize spend." },
  { icon: <Scale size={24} color="#7B2DFF" />, name: "Legal Assistant", desc: "Draft contracts, review compliance, track deadlines, and manage risk." },
  { icon: <ClipboardList size={24} color="#7B2DFF" />, name: "Project Manager", desc: "Plan sprints, assign tasks, track progress, and report milestones." },
  { icon: <Calendar size={24} color="#7B2DFF" />, name: "Executive Assistant", desc: "Schedule meetings, manage calendars, prepare briefings, and coordinate teams." },
  { icon: <TrendingUp size={24} color="#7B2DFF" />, name: "Analytics Agent", desc: "Build dashboards, generate insights, detect anomalies, and predict trends." },
];

const workflow = [
  { icon: <MessageSquare size={20} color="#00E5FF" />, title: "User Request", desc: "Describe what you need in plain language." },
  { icon: <BrainCircuit size={20} color="#00E5FF" />, title: "AI Understands Intent", desc: "NLP engine parses context and requirements." },
  { icon: <ListChecks size={20} color="#00E5FF" />, title: "Creates a Plan", desc: "Breaks tasks into executable sub-steps." },
  { icon: <Zap size={20} color="#00E5FF" />, title: "Executes Automatically", desc: "Agents carry out each step across systems." },
  { icon: <Eye size={20} color="#00E5FF" />, title: "Monitors Progress", desc: "Real-time tracking with smart alerts." },
  { icon: <Activity size={20} color="#00E5FF" />, title: "Learns from Outcomes", desc: "Continuously improves based on results." },
  { icon: <LineChart size={20} color="#00E5FF" />, title: "Generates Insights", desc: "Delivers actionable recommendations." },
];

const features = [
  { icon: <Bot size={24} color="#7B2DFF" />, title: "Autonomous AI Agents", desc: "Agents that think, plan, and execute independently." },
  { icon: <UsersRound size={24} color="#7B2DFF" />, title: "Multi-Agent Collaboration", desc: "Agents work together across departments." },
  { icon: <MessageCircle size={24} color="#7B2DFF" />, title: "Natural Language Commands", desc: "Just describe what you need in plain English." },
  { icon: <Settings size={24} color="#7B2DFF" />, title: "Workflow Automation", desc: "Automate any repetitive business process." },
  { icon: <BarChart size={24} color="#7B2DFF" />, title: "Business Intelligence", desc: "AI-driven insights from your data." },
  { icon: <Bell size={24} color="#7B2DFF" />, title: "Smart Notifications", desc: "Context-aware alerts when it matters." },
  { icon: <LayoutDashboard size={24} color="#7B2DFF" />, title: "Real-Time Dashboards", desc: "Live metrics across your operations." },
  { icon: <FileText size={24} color="#7B2DFF" />, title: "Secure Document Processing", desc: "AI-powered document analysis and generation." },
  { icon: <Blocks size={24} color="#7B2DFF" />, title: "API Integrations", desc: "Connect with any tool via REST API." },
  { icon: <Users size={24} color="#7B2DFF" />, title: "Team Collaboration", desc: "Shared workspaces and agent assignments." },
  { icon: <ClipboardList size={24} color="#7B2DFF" />, title: "Audit Logs", desc: "Complete transparency on every action." },
  { icon: <ShieldCheck size={24} color="#7B2DFF" />, title: "Enterprise Security", desc: "SOC 2, encryption, and compliance built-in." },
  { icon: <Wrench size={24} color="#7B2DFF" />, title: "Custom AI Agents", desc: "Build agents tailored to your workflows." },
  { icon: <TrendingUp size={24} color="#7B2DFF" />, title: "Predictive Analytics", desc: "Forecast trends before they happen." },
];

const industries = [
  { icon: <Truck size={24} color="#00E5FF" />, name: "Logistics", desc: "Optimize routes, track shipments, and manage fleet operations." },
  { icon: <HeartPulse size={24} color="#00E5FF" />, name: "Healthcare", desc: "Automate patient scheduling, billing, and compliance." },
  { icon: <Landmark size={24} color="#00E5FF" />, name: "Finance", desc: "Streamline accounting, risk analysis, and reporting." },
  { icon: <GraduationCap size={24} color="#00E5FF" />, name: "Education", desc: "Manage enrollment, grading, and student engagement." },
  { icon: <ShoppingCart size={24} color="#00E5FF" />, name: "Retail", desc: "Automate inventory, POS, and customer loyalty." },
  { icon: <Factory size={24} color="#00E5FF" />, name: "Manufacturing", desc: "Optimize production lines and quality control." },
  { icon: <HardHat size={24} color="#00E5FF" />, name: "Construction", desc: "Track projects, budgets, and safety compliance." },
  { icon: <Hotel size={24} color="#00E5FF" />, name: "Hospitality", desc: "Manage bookings, staff, and guest experiences." },
  { icon: <Building2 size={24} color="#00E5FF" />, name: "Government", desc: "Digitize services, permits, and citizen engagement." },
  { icon: <Globe size={24} color="#00E5FF" />, name: "NGOs", desc: "Track programs, donors, and impact metrics." },
  { icon: <Briefcase size={24} color="#00E5FF" />, name: "Professional Services", desc: "Automate billing, scheduling, and client management." },
  { icon: <Laptop size={24} color="#00E5FF" />, name: "Technology", desc: "Accelerate development, DevOps, and support." },
];

const integrations = [
  { icon: <Cloud size={32} color="#7B2DFF" />, name: "Bohenix Cloud" }, 
  { icon: <Shield size={32} color="#7B2DFF" />, name: "NjiaSafe" },
  { icon: <HardHat size={32} color="#7B2DFF" />, name: "Mboka" }, 
  { icon: <Wrench size={32} color="#7B2DFF" />, name: "Fixxo" },
  { icon: <MessageCircle size={32} color="#7B2DFF" />, name: "Slack" }, 
  { icon: <Users size={32} color="#7B2DFF" />, name: "MS Teams" },
  { icon: <Mail size={32} color="#7B2DFF" />, name: "Google Workspace" }, 
  { icon: <Paperclip size={32} color="#7B2DFF" />, name: "Microsoft 365" },
  { icon: <GitBranch size={32} color="#7B2DFF" />, name: "GitHub" }, 
  { icon: <Video size={32} color="#7B2DFF" />, name: "Zoom" },
  { icon: <CreditCard size={32} color="#7B2DFF" />, name: "Stripe" }, 
  { icon: <Zap size={32} color="#7B2DFF" />, name: "Zapier" },
  { icon: <Blocks size={32} color="#7B2DFF" />, name: "REST API" }, 
  { icon: <Cloud size={32} color="#7B2DFF" />, name: "Webhooks" },
];

const dashMetrics = [
  { label: "AI Tasks Running", val: "1,247", change: "+12% today" },
  { label: "Active Agents", val: "8", change: "All operational" },
  { label: "Revenue Impact", val: "$2.4M", change: "+23% MoM" },
  { label: "Team Productivity", val: "94%", change: "+8% this week" },
  { label: "Automation Rate", val: "87%", change: "+5% this month" },
  { label: "Time Saved", val: "340h", change: "This month" },
  { label: "AI Recommendations", val: "56", change: "12 pending review" },
  { label: "Workflows Active", val: "23", change: "3 optimizing" },
];

const feedItems = [
  "HR Agent completed onboarding for 3 new employees",
  "Finance Agent generated Q2 revenue report",
  "Sales Agent closed deal #4521 — $45,000",
  "Support Agent resolved 12 tickets in last hour",
  "Marketing Agent launched email campaign to 5,200 contacts",
];

const testimonials = [
  { quote: "Flow AI cut our operational overhead by 60%. Our team now focuses on strategy while AI handles execution.", name: "Sarah Chen", role: "COO, TechVentures" },
  { quote: "The autonomous agents transformed our HR department. What took days now happens in minutes.", name: "James Okafor", role: "HR Director, AfriBank" },
  { quote: "We deployed Flow AI across 3 departments in a week. The ROI was visible within the first month.", name: "Maria Santos", role: "CEO, LogiPrime" },
];

const securityItems = [
  { icon: <Lock size={18}/>, title: "End-to-End Encryption", desc: "All data encrypted in transit and at rest with AES-256." },
  { icon: <Key size={18}/>, title: "Role-Based Permissions", desc: "Granular access control for every user and agent." },
  { icon: <FileCheck size={18}/>, title: "Audit Trails", desc: "Complete log of every action taken by users and agents." },
  { icon: <Eye size={18}/>, title: "Data Privacy Controls", desc: "GDPR and CCPA compliant data handling." },
  { icon: <Server size={18}/>, title: "Secure Infrastructure", desc: "SOC 2 certified cloud with 99.99% uptime." },
  { icon: <Shield size={18}/>, title: "Enterprise Compliance", desc: "HIPAA, PCI-DSS, and ISO 27001 ready." },
  { icon: <Activity size={18}/>, title: "Continuous Monitoring", desc: "24/7 threat detection and automated response." },
];

const devCards = [
  { title: "REST API", desc: "Full CRUD operations for agents, workflows, and data.", code: 'curl -X POST https://api.bohenix.ai/v1/agents \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -d \'{"type": "sales", "name": "My Agent"}\'' },
  { title: "SDKs", desc: "Official libraries for Python, Node.js, Go, and Java.", code: 'from bohenix import FlowAI\n\nclient = FlowAI(api_key="...")\nagent = client.agents.create(type="hr")' },
  { title: "Webhooks", desc: "Real-time event notifications for agent actions.", code: '// Webhook payload\n{\n  "event": "agent.task.completed",\n  "agent_id": "agt_abc123",\n  "result": { "status": "success" }\n}' },
];

export default function FlowAIPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle"|"success">("idle");

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
      if (paymentMethod === 'mpesa') {
        const res = await fetch('/api/mpesa/stk-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: mpesaPhone,
            amount: selectedPlan === 'Starter' ? 49 * 130 : selectedPlan === 'Professional' ? 199 * 130 : 0, // Mock KES conversion
            description: `Flow AI ${selectedPlan} Plan`
          })
        });
        const data = await res.json();
        if (data.success) {
          setPaymentStatus("success");
          setTimeout(() => setIsCheckoutOpen(false), 5000);
        } else {
          alert("Payment failed: " + data.message);
        }
      } else {
        // Stripe Visa Payment
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemName: `Flow AI ${selectedPlan} Plan`,
            priceAmount: selectedPlan === 'Starter' ? 49 : selectedPlan === 'Professional' ? 199 : 0,
            type: 'subscription',
            returnUrl: '/flow-ai'
          })
        });
        const data = await res.json();
        if (data.url && !data.url.includes('mock_checkout=true')) {
          window.location.href = data.url;
        } else {
          // Simulation fallback if no stripe key
          setPaymentStatus("success");
          setTimeout(() => setIsCheckoutOpen(false), 3000);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
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
            <Link href="#agents" className={s.navLink}>AI Agents</Link>
            <Link href="#features" className={s.navLink}>Features</Link>
            <Link href="#pricing" className={s.navLink}>Pricing</Link>
            <Link href="#security" className={s.navLink}>Security</Link>
            <Link href="#developers" className={s.navLink}>API</Link>
          </div>
          <button onClick={() => openCheckout("Free Trial")} className={s.navBtn} style={{ cursor: "pointer" }}>Start Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section id="overview" className={s.hero}>
        <motion.div className={s.heroInner} initial="hidden" animate="show" variants={{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:0.15}}}}>
          <motion.div variants={fade} className={s.heroBadge}><span className={s.heroBadgeDot}/> Your AI Workforce. Your Business on Autopilot.</motion.div>
          <motion.h1 variants={fade} className={s.heroTitle}>Meet Your <span className={s.heroGradient}>AI Workforce</span></motion.h1>
          <motion.p variants={fade} className={s.heroSub}>Delegate entire business operations to intelligent AI agents that think, plan, execute, and continuously improve workflows—so your team can focus on strategy instead of repetitive tasks.</motion.p>
          <motion.div variants={fade} className={s.heroCtas}>
            <button onClick={() => openCheckout("Free Trial")} className={s.ctaPrimary} style={{ cursor: "pointer" }}>Start Free <ArrowRightIcon size={18}/></button>
            <Link href="#pricing" className={s.ctaSecondary}>View Pricing</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Agents */}
      <section id="agents" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>AI Agents</div>
            <h2 className={s.sectionTitle}>Specialized Agents for Every Department</h2>
            <p className={s.sectionDesc}>Each agent is purpose-built for its domain, capable of planning multi-step workflows and executing them autonomously.</p>
          </motion.div>
          <div className={s.agentsGrid}>
            {agents.map((a,i)=>(
              <motion.div key={i} className={s.agentCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.agentCardHeader}>
                  <div className={s.agentIcon} style={{ background: 'rgba(123,45,255,0.1)', border: '1px solid rgba(123,45,255,0.2)' }}>{a.icon}</div>
                  <div className={s.agentName}>{a.name}</div>
                </div>
                <div className={s.agentStatus}><span className={s.agentStatusDot}/> Online</div>
                <div className={s.agentDesc}>{a.desc}</div>
                <button className={s.agentAction}>Learn More <ArrowRightIcon size={14}/></button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>How It Works</div>
            <h2 className={s.sectionTitle}>From Request to Results</h2>
            <p className={s.sectionDesc}>Watch how Flow AI transforms a simple request into a fully executed business workflow.</p>
          </motion.div>
          <div className={s.workflowWrap}>
            <div className={s.workflowLine}/>
            {workflow.map((w,i)=>(
              <motion.div key={i} className={s.workflowStep} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.workflowDot} style={{ background: '#111114', border: '1px solid rgba(0,229,255,0.3)' }}>{w.icon}</div>
                <div className={s.workflowContent}><h4>{w.title}</h4><p>{w.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Capabilities</div>
            <h2 className={s.sectionTitle}>Everything You Need to Automate</h2>
            <p className={s.sectionDesc}>A comprehensive platform built for enterprise-grade AI automation.</p>
          </motion.div>
          <div className={s.featuresGrid}>
            {features.map((f,i)=>(
              <motion.div key={i} className={s.featureCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.featureIcon} style={{ background: 'rgba(123,45,255,0.1)', border: '1px solid rgba(123,45,255,0.2)' }}>{f.icon}</div>
                <h4>{f.title}</h4><p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="solutions" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Industry Solutions</div>
            <h2 className={s.sectionTitle}>Built for Every Industry</h2>
            <p className={s.sectionDesc}>Flow AI adapts to the unique challenges of your sector.</p>
          </motion.div>
          <div className={s.industryGrid}>
            {industries.map((ind,i)=>(
              <motion.div key={i} className={s.industryCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.industryIcon} style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>{ind.icon}</div>
                <h4>{ind.name}</h4><p>{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Live Dashboard</div>
            <h2 className={s.sectionTitle}>Your Command Center</h2>
            <p className={s.sectionDesc}>Monitor every agent, workflow, and metric from a single enterprise dashboard.</p>
          </motion.div>
          <motion.div className={s.dashboardFrame} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.dashboardHeader}>
              <div className={s.dashboardDot} style={{background:'#FF5F57'}}/>
              <div className={s.dashboardDot} style={{background:'#FEBC2E'}}/>
              <div className={s.dashboardDot} style={{background:'#28C840'}}/>
              <span style={{marginLeft:'1rem',fontSize:'13px',color:'#737373'}}>Bohenix Flow AI — Dashboard</span>
            </div>
            <div className={s.dashboardGrid}>
              {dashMetrics.map((m,i)=>(
                <div key={i} className={s.dashMetric}>
                  <small>{m.label}</small>
                  <div className={s.val}>{m.val}</div>
                  <div className={s.change}>{m.change}</div>
                </div>
              ))}
            </div>
            <div className={s.dashFeed}>
              <h4>Live Activity Feed</h4>
              {feedItems.map((f,i)=>(
                <div key={i} className={s.feedItem}><span className={s.feedDot}/>{f}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap} style={{textAlign:'center'}}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel} style={{justifyContent:'center'}}>Integrations</div>
            <h2 className={s.sectionTitle} style={{margin:'0 auto 1.5rem'}}>Connects With Your Stack</h2>
            <p className={s.sectionDesc} style={{margin:'0 auto'}}>Flow AI integrates seamlessly with the tools you already use.</p>
          </motion.div>
          <div className={s.integrationsHub}>
            {integrations.map((int,i)=>(
              <motion.div key={i} className={s.integrationNode} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.integrationIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{int.icon}</div>
                <span>{int.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade} style={{textAlign:'center'}}>
            <div className={s.sectionLabel} style={{justifyContent:'center'}}>Pricing</div>
            <h2 className={s.sectionTitle} style={{margin:'0 auto 1.5rem'}}>Simple, Transparent Pricing</h2>
            <p className={s.sectionDesc} style={{margin:'0 auto'}}>Start free. Scale as you grow.</p>
          </motion.div>
          <div className={s.pricingGrid}>
            <motion.div className={s.priceCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
              <h3>Starter</h3>
              <div className={s.priceTag}>$49<span>/mo</span></div>
              <div className={s.priceSub}>For startups and small businesses getting started with AI automation.</div>
              <ul className={s.priceFeatures}>
                <li>3 AI Agents</li><li>1,000 tasks/month</li><li>Basic integrations</li>
                <li>Email support</li><li>Standard dashboards</li>
              </ul>
              <button onClick={() => openCheckout("Starter")} className={`${s.priceBtn} ${s.priceBtnOutline}`} style={{ cursor: "pointer" }}>Start Free Trial</button>
            </motion.div>
            <motion.div className={`${s.priceCard} ${s.priceCardPop}`} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
              <div className={s.priceBadge}>Most Popular</div>
              <h3>Professional</h3>
              <div className={s.priceTag}>$199<span>/mo</span></div>
              <div className={s.priceSub}>For growing companies needing advanced AI automation and analytics.</div>
              <ul className={s.priceFeatures}>
                <li>10 AI Agents</li><li>Unlimited tasks</li><li>All integrations</li>
                <li>Priority support</li><li>Custom dashboards</li><li>API access</li><li>Audit logs</li>
              </ul>
              <button onClick={() => openCheckout("Professional")} className={`${s.priceBtn} ${s.priceBtnPrimary}`} style={{ cursor: "pointer" }}>Start Free Trial</button>
            </motion.div>
            <motion.div className={s.priceCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
              <h3>Enterprise</h3>
              <div className={s.priceTag}>Custom</div>
              <div className={s.priceSub}>Custom AI agents, private deployments, dedicated support, and compliance.</div>
              <ul className={s.priceFeatures}>
                <li>Unlimited agents</li><li>Private deployment</li><li>Custom integrations</li>
                <li>Dedicated CSM</li><li>SLA guarantee</li><li>Advanced security</li><li>SSO & SAML</li>
              </ul>
              <button onClick={() => openCheckout("Enterprise")} className={`${s.priceBtn} ${s.priceBtnOutline}`} style={{ cursor: "pointer" }}>Contact Sales</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Security</div>
            <h2 className={s.sectionTitle}>Enterprise-Grade Security</h2>
            <p className={s.sectionDesc}>Your data is protected at every layer with industry-leading security standards.</p>
          </motion.div>
          <div className={s.securityGrid}>
            {securityItems.map((si,i)=>(
              <motion.div key={i} className={s.securityItem} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <div className={s.securityIcon}>{si.icon}</div>
                <div><h4>{si.title}</h4><p>{si.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Platform */}
      <section id="developers" className={s.section}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Developer Platform</div>
            <h2 className={s.sectionTitle}>Build With Flow AI</h2>
            <p className={s.sectionDesc}>Powerful APIs and SDKs to integrate AI automation into your own applications.</p>
          </motion.div>
          <div className={s.devGrid}>
            {devCards.map((d,i)=>(
              <motion.div key={i} className={s.devCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <h4>{d.title}</h4><p>{d.desc}</p>
                <pre className={s.codeBlock}>{d.code}</pre>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className={s.finalCta}>
        <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
          <h2 className={s.finalCtaTitle}>Transform Your Business with <span className={s.heroGradient}>Autonomous AI</span></h2>
          <p className={s.finalCtaDesc}>Join forward-thinking organizations using Bohenix Flow AI to automate operations, empower teams, and accelerate growth.</p>
          <div className={s.heroCtas}>
            <button onClick={() => openCheckout("Enterprise")} className={s.ctaPrimary} style={{ cursor: "pointer" }}>Start Free <ArrowRightIcon size={18}/></button>
            <Link href="#pricing" className={s.ctaSecondary}>Schedule Demo</Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerGrid}>
          <div className={s.footerBrand}>
            <Link href="/" className={s.logoGroup} style={{marginBottom:'1.5rem'}}>
              <Image src="/bohenixx.png" alt="Logo" width={32} height={32}/>
              <span className={s.brandName} style={{fontSize:'1.25rem'}}>Bohenix</span>
            </Link>
            <p>Bohenix Flow AI — Your AI Workforce. Automate operations, empower teams, accelerate growth.</p>
          </div>
          <div className={s.footerCol}>
            <h4>Flow AI</h4>
            <ul>
              <li><Link href="#overview">Overview</Link></li>
              <li><Link href="#agents">AI Agents</Link></li>
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
            </ul>
          </div>
          <div className={s.footerCol}>
            <h4>Developers</h4>
            <ul>
              <li><Link href="#developers">API</Link></li>
              <li><Link href="#developers">Documentation</Link></li>
              <li><Link href="#developers">SDKs</Link></li>
              <li><Link href="#developers">Webhooks</Link></li>
            </ul>
          </div>
          <div className={s.footerCol}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><button onClick={() => openCheckout("Enterprise")} style={{ background: 'none', border: 'none', color: '#B3B3B8', cursor: 'pointer', padding: 0, fontSize: '15px' }}>Contact Sales</button></li>
              <li><Link href="#security">Security</Link></li>
              <li><Link href="/#company">About</Link></li>
            </ul>
          </div>
          <div className={s.footerCol}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
              <li><Link href="#security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className={s.footerBottom}>
          <div>&copy; {new Date().getFullYear()} Bohenix Technologies. All rights reserved.</div>
          <div>Nairobi, Kenya</div>
        </div>
      </footer>

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
              
              <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>Complete Checkout</h3>
              <p style={{ color: '#B3B3B8', marginBottom: '2.5rem', fontSize: '15px' }}>You are subscribing to the <strong style={{ color: '#7B2DFF' }}>{selectedPlan}</strong> Plan.</p>
              
              {paymentStatus === "success" ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: '64px', height: '64px', background: '#52B44B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <ShieldCheck size={32} color="#fff" />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '0.5rem' }}>Payment Successful!</h4>
                  <p style={{ color: '#B3B3B8' }}>Your Flow AI workspace is being provisioned.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => setPaymentMethod('mpesa')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: paymentMethod === 'mpesa' ? '1px solid #52B44B' : '1px solid rgba(255,255,255,0.1)', background: paymentMethod === 'mpesa' ? 'rgba(82,180,75,0.1)' : 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ width: '20px', height: '20px', background: '#52B44B', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 800 }}>M</div>
                      M-Pesa
                    </button>
                    <button onClick={() => setPaymentMethod('visa')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: paymentMethod === 'visa' ? '1px solid #2962FF' : '1px solid rgba(255,255,255,0.1)', background: paymentMethod === 'visa' ? 'rgba(41,98,255,0.1)' : 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ width: '20px', height: '20px', background: '#2962FF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 800, fontStyle: 'italic' }}>V</div>
                      Visa
                    </button>
                  </div>

                  <form onSubmit={handlePayment}>
                    {paymentMethod === 'mpesa' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: '#B3B3B8' }}>M-Pesa Phone Number</label>
                          <input required type="tel" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} placeholder="2547XXXXXXXX" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: '#B3B3B8' }}>Card Number</label>
                          <input required type="text" placeholder="**** **** **** ****" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: '#B3B3B8' }}>Expiry</label>
                            <input required type="text" placeholder="MM/YY" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', color: '#B3B3B8' }}>CVC</label>
                            <input required type="text" placeholder="123" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      style={{ 
                        width: '100%', 
                        background: paymentMethod === 'mpesa' ? '#52B44B' : '#2962FF', 
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
                      {isProcessing ? "Processing..." : `Pay via ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Visa'}`}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
