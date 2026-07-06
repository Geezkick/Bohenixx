"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Check, Star, Code, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function SocialProofDashboard() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would check the UserApp or UserSubscription table here
  // For now, we'll simulate an API call that checks if they've purchased/installed it
  useEffect(() => {
    const checkAccess = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // We will default to showing the paywall/landing page first
      setHasAccess(false); 
      setLoading(false);
    };
    checkAccess();
  }, []);

  const handleInstall = () => {
    setLoading(true);
    // Simulate payment / installation flow
    setTimeout(() => {
      setHasAccess(true);
      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(177,76,255,0.2)", borderTopColor: "#B14CFF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Image src="/bohenixx.png" alt="BX Social Proof" width={64} height={64} style={{ marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", background: "linear-gradient(to right, #fff, #a0a0a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BX Social Proof
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
            Collect video and text testimonials from your customers and display them anywhere with a beautiful, embeddable "Wall of Love".
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {/* Free Tier */}
          <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Starter</h3>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>$0 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>/ forever</span></div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Up to 10 Text Testimonials
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Basic Grid Layout
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Bohenix Branding
              </li>
            </ul>

            <button 
              onClick={handleInstall}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              Install Free
            </button>
          </div>

          {/* Business Tier */}
          <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(177,76,255,0.3)", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, rgba(177,76,255,0.05) 0%, rgba(0,0,0,0) 100%)" }}>
            <div style={{ position: "absolute", top: 0, right: 0, background: "#B14CFF", color: "#fff", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 1rem", borderBottomLeftRadius: "8px" }}>
              RECOMMENDED
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#B14CFF" }}>Business</h3>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>$19 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>/ month</span></div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Unlimited Video & Text
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Premium Carousel Layouts
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Remove Bohenix Branding
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Auto-Approval Rules
              </li>
            </ul>

            <button 
              onClick={handleInstall}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, boxShadow: "0 0 20px rgba(177,76,255,0.4)", transition: "all 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 0 30px rgba(177,76,255,0.6)"}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 0 20px rgba(177,76,255,0.4)"}
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Image src="/bohenixx.png" alt="BX Social Proof" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Social Proof</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Manage your Wall of Love</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Code size={16} /> Embed Code
          </button>
          <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
            <Star size={16} /> Request Testimonial
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Total Testimonials</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Average Rating</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            0.0 <Star size={24} color="#ffd700" fill="#ffd700" style={{ opacity: 0.3 }} />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Widget Views</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(177,76,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
          <Star size={32} color="#B14CFF" />
        </div>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No testimonials yet</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
          Start collecting love from your customers by sharing your unique submission link.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <input 
            type="text" 
            readOnly 
            value={`https://bohenix.com/submit/${user?.id || 'demo'}`} 
            style={{ padding: "0.8rem 1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "350px", outline: "none" }}
          />
          <button style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", background: "#fff", border: "none", color: "#000", cursor: "pointer", fontWeight: 600 }}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
