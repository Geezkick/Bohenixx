"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <header style={{ height: "64px", padding: "0 2rem", display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#B14CFF", textDecoration: "none", fontWeight: 600 }}>
          <ArrowLeftIcon size={20} />
          Back to Home
        </Link>
      </header>
      <main style={{ padding: "6rem 2rem 4rem", minHeight: "100vh", background: "#050505", color: "#fff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>Privacy Policy</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "3rem" }}>Last Updated: {new Date().toLocaleDateString()}</p>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#B14CFF", marginBottom: "1rem" }}>1. Information We Collect</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "1rem" }}>
              Bohenix Technologies ("we", "us", or "our") collects information you provide directly to us when you create an account, subscribe to our services, request support, or otherwise communicate with us. This may include your name, email address, password, and payment information.
            </p>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              We also automatically collect certain information about your device and how you interact with our platforms (such as NjiaSafe, BX Omni, etc.), including IP addresses, browser types, and usage telemetry, which helps us secure our systems and improve user experience.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#00E5FF", marginBottom: "1rem" }}>2. How We Use Your Information</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              We use the collected information to:
            </p>
            <ul style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
              <li>Provide, maintain, and improve our ecosystem of products and services.</li>
              <li>Process transactions and send related information, including confirmations and receipts.</li>
              <li>Send technical notices, security alerts, and administrative messages.</li>
              <li>Respond to your comments, questions, and requests.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our platforms.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#22c55e", marginBottom: "1rem" }}>3. Data Security & Storage</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              We implement industry-standard security measures, including encryption in transit and at rest, two-factor authentication (2FA), and strict access controls, to protect your personal data from unauthorized access, use, or disclosure. However, no internet-based system is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#FF3366", marginBottom: "1rem" }}>4. Third-Party Sharing</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              We do not sell your personal data. We may share information with trusted third-party service providers (such as hosting or payment processors) who need access to such information to carry out work on our behalf. These providers are bound by strict confidentiality obligations.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#E0E0E0", marginBottom: "1rem" }}>5. Contact Us</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer at: <strong>privacy@bohenix.africa</strong>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
