"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function TermsOfServicePage() {
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>Terms of Service</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "3rem" }}>Last Updated: {new Date().toLocaleDateString()}</p>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#B14CFF", marginBottom: "1rem" }}>1. Acceptance of Terms</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              By accessing or using the Bohenix ONE platform, developer portal, and related services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our Services.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#00E5FF", marginBottom: "1rem" }}>2. Use of Services</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "1rem" }}>
              You agree to use the Services only for lawful purposes and in accordance with these Terms. You are prohibited from:
            </p>
            <ul style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, paddingLeft: "1.5rem" }}>
              <li>Using the Services in any way that violates applicable laws or regulations.</li>
              <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Services.</li>
              <li>Taking any action that imposes an unreasonable or disproportionately large load on our infrastructure.</li>
              <li>Using automated systems (bots, scrapers) to access the Services without our written permission.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#22c55e", marginBottom: "1rem" }}>3. Accounts and Security</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              You are responsible for safeguarding the password and API keys that you use to access the Services. You agree not to disclose your password or keys to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#FF9800", marginBottom: "1rem" }}>4. Intellectual Property</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              All intellectual property rights in the Services, including software, AI models, algorithms, and content, are owned by Bohenix Technologies. You may not copy, modify, distribute, sell, or lease any part of our Services without explicit permission.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#FF3366", marginBottom: "1rem" }}>5. Limitation of Liability</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              In no event shall Bohenix Technologies, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#E0E0E0", marginBottom: "1rem" }}>6. Contact Us</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              If you have any questions about these Terms, please contact our legal team at: <strong>legal@bohenix.africa</strong>.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
