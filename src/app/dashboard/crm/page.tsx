"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Megaphone, BrainCircuit, Users, Send, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import PremiumLock from "@/components/PremiumLock";

export default function CRMPage() {
  const [generating, setGenerating] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [sent, setSent] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  React.useEffect(() => {
    fetch('/api/subscription/check')
      .then(res => res.json())
      .then(data => setHasAccess(data.isActive))
      .catch(() => setHasAccess(false));
  }, []);

  const generateCampaign = async () => {
    setGenerating(true);
    setCampaign(null);
    setSent(false);

    try {
      const res = await fetch('/api/crm/generate', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.campaign) {
        setCampaign(data.campaign);
      } else {
        throw new Error(data.error || 'Failed to generate campaign');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate campaign with AI.");
    } finally {
      setGenerating(false);
    }
  };

  const sendCampaign = () => {
    setSent(true);
  };

  if (hasAccess === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Loader2 size={40} className="spin" color="#f59e0b" />
      </div>
    );
  }

  if (!hasAccess) {
    return <PremiumLock featureName="BX Care CRM" />;
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone color="#f59e0b" /> BX Care CRM
          </h1>
          <p className={styles.pageDesc}>AI-driven preventative care marketing and patient outreach.</p>
        </div>
        <button 
          onClick={generateCampaign}
          disabled={generating}
          style={{ 
            background: 'linear-gradient(135deg, #e67e22, #f59e0b)', border: 'none', color: '#fff', 
            padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          {generating ? <Loader2 size={18} className="spin" /> : <BrainCircuit size={18} />}
          {generating ? "Analyzing Epidemiological Data..." : "Auto-Generate Campaign"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
        
        {/* Main Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Users size={16} /> TOTAL PATIENT BASE
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>4,892</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', marginBottom: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} /> PREVENTATIVE RETENTION
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#22c55e' }}>86%</div>
            </div>
          </div>

          {/* Campaign Preview */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare color="#f59e0b" /> AI Drafted Campaign
            </h2>

            {!campaign && !generating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                <BrainCircuit size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                Click "Auto-Generate Campaign" to let AI analyze current health trends and draft an outreach message.
              </div>
            )}

            {generating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#f59e0b' }}>
                <Loader2 size={40} className="spin" style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: 600 }}>Cross-referencing EMR data with regional health trends...</p>
              </div>
            )}

            {campaign && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                  <p style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Logic Trigger</p>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>{campaign.trend}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Audience</label>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {campaign.targetAudience}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Predicted Conversion</label>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#22c55e', fontWeight: 700 }}>
                      {campaign.estimatedConversion}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>SMS Message Content</label>
                  <textarea 
                    defaultValue={campaign.message}
                    style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}
                  />
                </div>

                <button 
                  onClick={sendCampaign}
                  disabled={sent}
                  style={{ 
                    width: '100%', background: sent ? 'rgba(34,197,94,0.1)' : '#f59e0b', color: sent ? '#22c55e' : '#000', 
                    border: sent ? '1px solid rgba(34,197,94,0.3)' : 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: sent ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s'
                  }}
                >
                  {sent ? <CheckCircle2 size={20} /> : <Send size={20} />}
                  {sent ? "Campaign Dispatched to 342 Patients" : "Approve & Dispatch Campaign"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Automated Campaigns</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '0.85rem', color: '#00E5FF', fontWeight: 700, marginBottom: '0.5rem' }}>Annual Checkup Reminder</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Sent to 120 patients • 2 days ago</div>
              <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>18 Appointments Booked</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '0.85rem', color: '#B14CFF', fontWeight: 700, marginBottom: '0.5rem' }}>Pediatric Vaccination Follow-up</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Sent to 45 patients • 1 week ago</div>
              <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>32 Appointments Booked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
