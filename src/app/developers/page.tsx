"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon, Terminal, Shield, Code, Database, Cloud, BrainCircuit, Car, Wrench, Briefcase, Leaf, BookOpen, Scan } from "lucide-react";
import styles from "./developers.module.css";

const endpoints = [
  { method: "POST", path: "/api/auth/register", desc: "Create a new user account with name, email, and password.", tags: ["Auth", "Public"] },
  { method: "POST", path: "/api/auth/login", desc: "Authenticate with email and password. Returns session token.", tags: ["Auth", "Public"] },
  { method: "GET", path: "/api/auth/me", desc: "Retrieve the currently authenticated user profile.", tags: ["Auth", "Protected"] },
  { method: "POST", path: "/api/auth/logout", desc: "Terminate the current user session.", tags: ["Auth", "Protected"] },
  { method: "POST", path: "/api/analytics/visit", desc: "Record a site visit and return cumulative visitor count.", tags: ["Analytics", "Public"] },
  { method: "GET", path: "/api/analytics/count", desc: "Retrieve real-time visitor count without recording a visit.", tags: ["Analytics", "Public"] },
  { method: "POST", path: "/api/contact", desc: "Send a contact inquiry email to the Bohenix team.", tags: ["Email", "Protected"] },
  { method: "POST", path: "/api/support", desc: "Create a support ticket with auto-generated ticket number.", tags: ["Support", "Protected"] },
  { method: "POST", path: "/api/career", desc: "Submit a job application with portfolio and cover letter.", tags: ["Careers", "Protected"] },
  { method: "POST", path: "/api/checkout", desc: "Create a Stripe checkout session for ecosystem services.", tags: ["Payments", "Protected"] },
];

const sdks = [
  { name: "JavaScript SDK", icon: "JS", color: "#F7DF1E", bg: "rgba(247,223,30,0.12)", desc: "Browser and Node.js client for all Bohenix APIs.", status: "Beta", statusColor: "#FF9800" },
  { name: "Python SDK", icon: "PY", color: "#3776AB", bg: "rgba(55,118,171,0.12)", desc: "Server-side Python client with async support.", status: "Coming Soon", statusColor: "#666" },
  { name: "REST API", icon: "{}",  color: "#00E5FF", bg: "rgba(0,229,255,0.12)", desc: "Direct HTTP access to all endpoints. JSON in, JSON out.", status: "Available", statusColor: "#00C853" },
  { name: "Webhooks", icon: "⚡", color: "#B14CFF", bg: "rgba(177,76,255,0.12)", desc: "Real-time event notifications for account and service events.", status: "Coming Soon", statusColor: "#666" },
];

const ecosystemApps = [
  { name: "NjiaSafe", desc: "Road safety and smart mobility platform.", Icon: Car, href: "https://njiasafe.six.vercel.app", color: "#FF3366" },
  { name: "BX Omni", desc: "AI-powered Digital Operations Twin.", Icon: BrainCircuit, href: "https://bohenixx.vercel.app", color: "#00E5FF" },
  { name: "Fixxo", desc: "Smart maintenance and service marketplace.", Icon: Wrench, href: "https://fixxo.vercel.app", color: "#F59E0B" },
  { name: "Mboka", desc: "AI-powered job matching platform.", Icon: Briefcase, href: "https://mboka.vercel.app", color: "#8B5CF6" },
  { name: "Vuna", desc: "AI-curated farming video platform.", Icon: Leaf, href: "https://vunashorts.vercel.app", color: "#22C55E" },
  { name: "Kwelify", desc: "Adaptive learning technology platform.", Icon: BookOpen, href: "https://kwelify.vercel.app", color: "#3B82F6" },
  { name: "Safura", desc: "Autonomous AI food scanner.", Icon: Scan, href: "https://safura-ai.vercel.app", color: "#EC4899" },
];

export default function DeveloperPortal() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const authExample = `// Authenticate with Bohenix API
const response = await fetch('https://www.bohenix.africa/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'developer@example.com',
    password: 'your_password'
  })
});

const { user } = await response.json();
console.log('Authenticated:', user.email);`;

  const analyticsExample = `// Fetch real-time visitor analytics
const stats = await fetch('https://www.bohenix.africa/api/analytics/count');
const { visitors, countries } = await stats.json();

console.log(\`Total visitors: \${visitors}\`);
console.log(\`Countries reached: \${countries}\`);`;

  const contactExample = `// Send a contact inquiry
const res = await fetch('https://www.bohenix.africa/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'partner@company.com',
    message: 'Interested in enterprise integration.',
    subject: 'Partnership Inquiry',
    targetEmail: 'ceo@bohenix.africa'
  })
});

const result = await res.json();
console.log(result.success ? 'Sent!' : 'Failed');`;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link href="/" className={styles.backLink}>← Back to Bohenix</Link>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Developer Portal
          </div>
          <h1 className={styles.heroTitle}>Build with Bohenix</h1>
          <p className={styles.heroSub}>
            Access our APIs, SDKs, and integration guides to build on top of Africa&apos;s most ambitious digital ecosystem. Ship faster with production-ready endpoints.
          </p>
          <div className={styles.heroActions}>
            <a href="#endpoints" className={styles.primaryBtn}>
              <Terminal size={18} /> Explore APIs
            </a>
            <a href="#sdks" className={styles.secondaryBtn}>
              View SDKs <ArrowRightIcon size={16} />
            </a>
          </div>
        </div>

        {/* Quick Start */}
        <div className={styles.quickStart}>
          <h3 className={styles.quickStartTitle}>
            <Code size={20} /> Quick Start Guide
          </h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <div className={styles.stepTitle}>Create an Account</div>
                <div className={styles.stepDesc}>Sign up at bohenix.africa to get your developer credentials and access the ecosystem.</div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <div className={styles.stepTitle}>Authenticate</div>
                <div className={styles.stepDesc}>Use the /api/auth/login endpoint to obtain a session. All protected endpoints require authentication.</div>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <div className={styles.stepTitle}>Integrate</div>
                <div className={styles.stepDesc}>Call any API endpoint with your session. Build custom integrations with our ecosystem apps.</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <section id="endpoints" className={styles.section}>
          <h2 className={styles.sectionTitle}>API Reference</h2>
          <p className={styles.sectionDesc}>
            RESTful JSON endpoints powering the entire Bohenix ecosystem. All requests and responses use JSON.
          </p>
          <div className={styles.endpointGrid}>
            {endpoints.map((ep) => (
              <div key={ep.path} className={styles.endpointCard}>
                <div className={`${styles.methodBadge} ${ep.method === "GET" ? styles.methodGet : styles.methodPost}`}>
                  {ep.method}
                </div>
                <div className={styles.endpointPath}>{ep.path}</div>
                <div className={styles.endpointDesc}>{ep.desc}</div>
                <div className={styles.endpointMeta}>
                  {ep.tags.map(tag => (
                    <span key={tag} className={styles.metaTag}>
                      {tag === "Protected" ? <Shield size={12} /> : null}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Code Examples</h2>
          <p className={styles.sectionDesc}>Copy-paste ready examples to get started in minutes.</p>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>JavaScript — Authentication</span>
              <button className={styles.codeCopy} onClick={() => handleCopy(authExample, 0)}>
                {copiedIdx === 0 ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className={styles.codeBody}>{authExample}</pre>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>JavaScript — Real-Time Analytics</span>
              <button className={styles.codeCopy} onClick={() => handleCopy(analyticsExample, 1)}>
                {copiedIdx === 1 ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className={styles.codeBody}>{analyticsExample}</pre>
          </div>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>JavaScript — Contact API</span>
              <button className={styles.codeCopy} onClick={() => handleCopy(contactExample, 2)}>
                {copiedIdx === 2 ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <pre className={styles.codeBody}>{contactExample}</pre>
          </div>
        </section>

        {/* SDKs */}
        <section id="sdks" className={styles.section}>
          <h2 className={styles.sectionTitle}>SDKs & Libraries</h2>
          <p className={styles.sectionDesc}>Official clients and integration tools for the Bohenix platform.</p>
          <div className={styles.sdkGrid}>
            {sdks.map(sdk => (
              <div key={sdk.name} className={styles.sdkCard}>
                <div className={styles.sdkIcon} style={{ background: sdk.bg, color: sdk.color }}>{sdk.icon}</div>
                <div className={styles.sdkName}>{sdk.name}</div>
                <div className={styles.sdkDesc}>{sdk.desc}</div>
                <span className={styles.sdkStatus} style={{ background: `${sdk.statusColor}15`, color: sdk.statusColor }}>
                  {sdk.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem Integrations */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ecosystem Integrations</h2>
          <p className={styles.sectionDesc}>Build on top of any app in the Bohenix ecosystem.</p>
          <div className={styles.endpointGrid}>
            {ecosystemApps.map(app => (
              <div key={app.name} className={styles.endpointCard} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, minWidth: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: app.color }}>
                  <app.Icon size={28} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>{app.name}</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '0.5rem' }}>{app.desc}</div>
                  <Link href={app.href} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#00E5FF', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                    View Platform <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Rate Limits & Quotas</h2>
          <p className={styles.sectionDesc}>Fair usage limits to ensure platform stability for all developers.</p>
          <div className={styles.rateLimitGrid}>
            <div className={styles.rateLimitCard}>
              <div className={styles.rateLimitValue}>100</div>
              <div className={styles.rateLimitLabel}>Requests / minute</div>
            </div>
            <div className={styles.rateLimitCard}>
              <div className={styles.rateLimitValue}>10K</div>
              <div className={styles.rateLimitLabel}>Daily API calls</div>
            </div>
            <div className={styles.rateLimitCard}>
              <div className={styles.rateLimitValue}>5 MB</div>
              <div className={styles.rateLimitLabel}>Max payload size</div>
            </div>
            <div className={styles.rateLimitCard}>
              <div className={styles.rateLimitValue}>99.9%</div>
              <div className={styles.rateLimitLabel}>Uptime SLA</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className={styles.footerCta}>
          <h2 className={styles.footerCtaTitle}>Ready to Build?</h2>
          <p className={styles.footerCtaDesc}>
            Join the growing community of developers building on Africa&apos;s most ambitious tech ecosystem.
          </p>
          <div className={styles.heroActions}>
            <Link href="/" className={styles.primaryBtn}>
              Create Account <ArrowRightIcon size={16} />
            </Link>
            <a href="mailto:hello@bohenix.africa" className={styles.secondaryBtn}>
              Contact DevRel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
