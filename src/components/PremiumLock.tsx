"use client";

import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PremiumLock({ featureName }: { featureName: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: `Bohenix Premium: ${featureName} Access`,
          priceAmount: 49,
          type: 'PREMIUM',
          email: user?.email || '',
          returnUrl: window.location.pathname
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      alert("Failed to initiate checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center", padding: "2rem" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", border: "2px solid rgba(245,158,11,0.3)" }}>
        <Lock size={40} color="#f59e0b" />
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>{featureName} is a Premium Feature</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", marginBottom: "3rem", lineHeight: 1.6 }}>
        Upgrade to Bohenix Premium to unlock advanced AI capabilities, including autonomous campaign generation, ambient scribing, and predictive analytics.
      </p>
      
      <button 
        onClick={handleUpgrade}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #e67e22, #f59e0b)",
          color: "#fff",
          border: "none",
          padding: "1rem 2.5rem",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "transform 0.2s"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {loading ? <Loader2 className="spin" size={20} /> : <Lock size={20} />}
        Unlock Premium for $49/mo
      </button>
    </div>
  );
}
