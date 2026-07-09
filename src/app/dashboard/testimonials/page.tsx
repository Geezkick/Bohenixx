"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Check, Star, Code, ArrowRight, Zap, Loader2, MessageSquare, Trash2, CheckCircle2 } from "lucide-react";
import PremiumLock from "@/components/PremiumLock";

export default function SocialProofDashboard() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/subscription/check')
      .then(res => res.json())
      .then(data => {
        setHasAccess(data.isActive);
        if (data.isActive) {
          fetchData();
        }
      })
      .catch(() => setHasAccess(false));
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setConfig(data.config);
      setTestimonials(data.testimonials || []);
    } catch (e) {
      console.error(e);
    }
  };

  const simulateSubmission = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Alex Johnson",
          company: "TechFlow Inc.",
          message: "Bohenix completely transformed how we run our operations. The AI tools saved us 20 hours a week!",
          rating: 5
        })
      });
      if (res.ok) {
        fetchData(); // Refresh list
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (hasAccess === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Loader2 size={40} className="spin" color="#B14CFF" />
      </div>
    );
  }

  if (!hasAccess) {
    return <PremiumLock featureName="BX Social Proof" />;
  }

  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
    : "0.0";

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
          <button 
            onClick={simulateSubmission}
            disabled={generating}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
          >
            {generating ? <Loader2 size={16} className="spin" /> : <Star size={16} />} 
            Simulate New Testimonial
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Total Testimonials</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{testimonials.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Average Rating</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {averageRating} <Star size={24} color="#ffd700" fill="#ffd700" />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>Widget Views</h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>1,204</div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>Recent Submissions</h2>
      
      {testimonials.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(177,76,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
            <Star size={32} color="#B14CFF" />
          </div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No testimonials yet</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
            Start collecting love from your customers by sharing your unique submission link, or click 'Simulate New Testimonial' above.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <input 
              type="text" 
              readOnly 
              value={`https://bohenix.com/submit/${user?.id || 'demo'}`} 
              style={{ padding: "0.8rem 1rem", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "350px", outline: "none" }}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {testimonials.map(t => (
            <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} color="#ffd700" fill="#ffd700" />)}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>• {new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.5, marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                  "{t.message}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #B14CFF, #FF3366)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{t.company}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: t.approved ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.1)', border: 'none', color: t.approved ? '#22c55e' : '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} /> {t.approved ? 'Approved' : 'Approve'}
                </button>
                <button style={{ background: 'rgba(255,51,102,0.1)', border: 'none', color: '#FF3366', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
