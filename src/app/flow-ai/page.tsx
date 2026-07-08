"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon, Shield, Lock, Eye, Server, Key, FileCheck, Activity } from "lucide-react";
import s from "./flowai.module.css";

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

const agents = [
  { icon: "👤", name: "HR Agent", desc: "Automate hiring, onboarding, payroll, and employee management workflows." },
  { icon: "💰", name: "Sales Agent", desc: "Manage leads, follow-ups, proposals, and close deals autonomously." },
  { icon: "📊", name: "Finance Agent", desc: "Generate invoices, track expenses, reconcile accounts, and forecast revenue." },
  { icon: "🎧", name: "Support Agent", desc: "Resolve tickets, answer FAQs, escalate issues, and measure CSAT." },
  { icon: "⚙️", name: "Operations Agent", desc: "Optimize supply chains, logistics, inventory, and internal processes." },
  { icon: "📢", name: "Marketing Agent", desc: "Create campaigns, analyze performance, segment audiences, and optimize spend." },
  { icon: "⚖️", name: "Legal Assistant", desc: "Draft contracts, review compliance, track deadlines, and manage risk." },
  { icon: "📋", name: "Project Manager", desc: "Plan sprints, assign tasks, track progress, and report milestones." },
  { icon: "🗓️", name: "Executive Assistant", desc: "Schedule meetings, manage calendars, prepare briefings, and coordinate teams." },
  { icon: "📈", name: "Analytics Agent", desc: "Build dashboards, generate insights, detect anomalies, and predict trends." },
];

const workflow = [
  { icon: "💬", title: "User Request", desc: "Describe what you need in plain language." },
  { icon: "🧠", title: "AI Understands Intent", desc: "NLP engine parses context and requirements." },
  { icon: "📝", title: "Creates a Plan", desc: "Breaks tasks into executable sub-steps." },
  { icon: "⚡", title: "Executes Automatically", desc: "Agents carry out each step across systems." },
  { icon: "👁️", title: "Monitors Progress", desc: "Real-time tracking with smart alerts." },
  { icon: "🔄", title: "Learns from Outcomes", desc: "Continuously improves based on results." },
  { icon: "💡", title: "Generates Insights", desc: "Delivers actionable recommendations." },
];

const features = [
  { icon: "🤖", title: "Autonomous AI Agents", desc: "Agents that think, plan, and execute independently." },
  { icon: "🔗", title: "Multi-Agent Collaboration", desc: "Agents work together across departments." },
  { icon: "💬", title: "Natural Language Commands", desc: "Just describe what you need in plain English." },
  { icon: "⚙️", title: "Workflow Automation", desc: "Automate any repetitive business process." },
  { icon: "📊", title: "Business Intelligence", desc: "AI-driven insights from your data." },
  { icon: "🔔", title: "Smart Notifications", desc: "Context-aware alerts when it matters." },
  { icon: "📈", title: "Real-Time Dashboards", desc: "Live metrics across your operations." },
  { icon: "📄", title: "Secure Document Processing", desc: "AI-powered document analysis and generation." },
  { icon: "🔌", title: "API Integrations", desc: "Connect with any tool via REST API." },
  { icon: "👥", title: "Team Collaboration", desc: "Shared workspaces and agent assignments." },
  { icon: "📝", title: "Audit Logs", desc: "Complete transparency on every action." },
  { icon: "🔒", title: "Enterprise Security", desc: "SOC 2, encryption, and compliance built-in." },
  { icon: "🛠️", title: "Custom AI Agents", desc: "Build agents tailored to your workflows." },
  { icon: "🔮", title: "Predictive Analytics", desc: "Forecast trends before they happen." },
];

const industries = [
  { icon: "🚛", name: "Logistics", desc: "Optimize routes, track shipments, and manage fleet operations." },
  { icon: "🏥", name: "Healthcare", desc: "Automate patient scheduling, billing, and compliance." },
  { icon: "🏦", name: "Finance", desc: "Streamline accounting, risk analysis, and reporting." },
  { icon: "🎓", name: "Education", desc: "Manage enrollment, grading, and student engagement." },
  { icon: "🛒", name: "Retail", desc: "Automate inventory, POS, and customer loyalty." },
  { icon: "🏭", name: "Manufacturing", desc: "Optimize production lines and quality control." },
  { icon: "🏗️", name: "Construction", desc: "Track projects, budgets, and safety compliance." },
  { icon: "🏨", name: "Hospitality", desc: "Manage bookings, staff, and guest experiences." },
  { icon: "🏛️", name: "Government", desc: "Digitize services, permits, and citizen engagement." },
  { icon: "🌍", name: "NGOs", desc: "Track programs, donors, and impact metrics." },
  { icon: "💼", name: "Professional Services", desc: "Automate billing, scheduling, and client management." },
  { icon: "💻", name: "Technology", desc: "Accelerate development, DevOps, and support." },
];

const integrations = [
  { icon: "☁️", name: "Bohenix Cloud" }, { icon: "🛡️", name: "NjiaSafe" },
  { icon: "👷", name: "Mboka" }, { icon: "🔧", name: "Fixxo" },
  { icon: "💬", name: "Slack" }, { icon: "👥", name: "MS Teams" },
  { icon: "📧", name: "Google Workspace" }, { icon: "📎", name: "Microsoft 365" },
  { icon: "🐙", name: "GitHub" }, { icon: "📹", name: "Zoom" },
  { icon: "💳", name: "Stripe" }, { icon: "⚡", name: "Zapier" },
  { icon: "🔌", name: "REST API" }, { icon: "🪝", name: "Webhooks" },
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
          <Link href="/sign-in" className={s.navBtn}>Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="overview" className={s.hero}>
        <motion.div className={s.heroInner} initial="hidden" animate="show" variants={{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:0.15}}}}>
          <motion.div variants={fade} className={s.heroBadge}><span className={s.heroBadgeDot}/> Your AI Workforce. Your Business on Autopilot.</motion.div>
          <motion.h1 variants={fade} className={s.heroTitle}>Meet Your <span className={s.heroGradient}>AI Workforce</span></motion.h1>
          <motion.p variants={fade} className={s.heroSub}>Delegate entire business operations to intelligent AI agents that think, plan, execute, and continuously improve workflows—so your team can focus on strategy instead of repetitive tasks.</motion.p>
          <motion.div variants={fade} className={s.heroCtas}>
            <Link href="/sign-in" className={s.ctaPrimary}>Start Free <ArrowRightIcon size={18}/></Link>
            <Link href="#contact" className={s.ctaSecondary}>Book a Demo</Link>
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
                  <div className={s.agentIcon}>{a.icon}</div>
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
                <div className={s.workflowDot}>{w.icon}</div>
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
                <div className={s.featureIcon}>{f.icon}</div>
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
                <div className={s.industryIcon}>{ind.icon}</div>
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
                <div className={s.integrationIcon}>{int.icon}</div>
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
              <Link href="/sign-in" className={`${s.priceBtn} ${s.priceBtnOutline}`}>Start Free Trial</Link>
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
              <Link href="/sign-in" className={`${s.priceBtn} ${s.priceBtnPrimary}`}>Start Free Trial</Link>
            </motion.div>
            <motion.div className={s.priceCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
              <h3>Enterprise</h3>
              <div className={s.priceTag}>Custom</div>
              <div className={s.priceSub}>Custom AI agents, private deployments, dedicated support, and compliance.</div>
              <ul className={s.priceFeatures}>
                <li>Unlimited agents</li><li>Private deployment</li><li>Custom integrations</li>
                <li>Dedicated CSM</li><li>SLA guarantee</li><li>Advanced security</li><li>SSO & SAML</li>
              </ul>
              <Link href="#contact" className={`${s.priceBtn} ${s.priceBtnOutline}`}>Contact Sales</Link>
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

      {/* Testimonials */}
      <section className={s.section} style={{background:'rgba(255,255,255,0.01)'}}>
        <div className={s.contentWrap}>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
            <div className={s.sectionLabel}>Testimonials</div>
            <h2 className={s.sectionTitle}>Trusted by Leaders</h2>
          </motion.div>
          <div className={s.testimonialsGrid}>
            {testimonials.map((t,i)=>(
              <motion.div key={i} className={s.testimonialCard} initial="hidden" whileInView="show" viewport={{once:true}} variants={fade}>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <div className={s.testimonialAuthor}>
                  <div className={s.testimonialAvatar}>{t.name[0]}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
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
            <Link href="/sign-in" className={s.ctaPrimary}>Start Free <ArrowRightIcon size={18}/></Link>
            <Link href="#contact" className={s.ctaSecondary}>Schedule Demo</Link>
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
              <li><Link href="#contact">Contact Sales</Link></li>
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
    </div>
  );
}
