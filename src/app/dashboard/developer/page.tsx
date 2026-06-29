"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Key, Webhook, BookOpen, Copy, Eye, EyeOff, RefreshCcw } from "lucide-react";

export default function DeveloperPortalPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("bx_live_8f92a4e7c1d3b50...");
  
  const handleCopy = () => {
    navigator.clipboard.writeText("bx_live_8f92a4e7c1d3b5089f2a4e7c1d3b5089");
    alert("API Key copied to clipboard!");
  };

  const handleRollKey = () => {
    if (confirm("Are you sure you want to roll your API key? The old key will expire immediately.")) {
      setApiKey("bx_live_" + Math.random().toString(36).substring(2, 15) + "...");
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <h1 className={styles.pageTitle} style={{ margin: 0 }}>Developer Portal</h1>
      </div>
      <p className={styles.pageDesc}>Manage your API keys, webhooks, and integrate Bohenix services into your infrastructure.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* API Keys */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <Key size={24} color="#B14CFF" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>API Keys</h2>
          </div>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Use this key to authenticate with the BX Omni and NjiaSafe APIs. Do not share this key publicly.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
            <code style={{ flex: 1, fontFamily: 'monospace', color: '#00E5FF', fontSize: '1rem' }}>
              {showKey ? "bx_live_8f92a4e7c1d3b5089f2a4e7c1d3b5089" : apiKey}
            </code>
            <button onClick={() => setShowKey(!showKey)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <Copy size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleRollKey} className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <RefreshCcw size={16} /> Roll Key
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <Webhook size={24} color="#00E5FF" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: 0 }}>Webhooks</h2>
          </div>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Configure endpoint URLs to receive real-time JSON payloads for ecosystem events (e.g., Safura scans, NjiaSafe alerts).
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Endpoint URL</label>
            <input 
              type="url" 
              defaultValue="https://api.yourcompany.com/webhooks/bohenix" 
              style={{ width: '100%', background: '#000', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} 
            />
          </div>

          <button className={styles.btnPrimary}>
            Save Webhook
          </button>
        </div>

      </div>

      <div style={{ marginTop: '3rem', background: 'rgba(177, 76, 255, 0.05)', border: '1px solid rgba(177, 76, 255, 0.2)', borderRadius: '20px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="#B14CFF" /> Documentation & SDKs
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            Read the official API documentation, view OpenAPI schemas, and download official SDKs for Node.js, Python, and Go.
          </p>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); alert('Documentation site coming soon!'); }} className={styles.btnSecondary} style={{ background: '#fff', color: '#000' }}>
          View Documentation
        </a>
      </div>
    </>
  );
}
