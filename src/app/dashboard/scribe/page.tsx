"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Mic, MicOff, Save, Loader2, BrainCircuit, FileText, CheckCircle2 } from "lucide-react";

export default function ScribePage() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      setProcessing(true);
      
      // Simulate AI generating SOAP notes from ambient listening
      setTimeout(() => {
        setProcessing(false);
        setNotes({
          subjective: "Patient reports mild chest pain and shortness of breath over the past 2 days. Pain is localized to the center of the chest and does not radiate. No history of cardiac issues.",
          objective: "BP 135/85, HR 88, SpO2 97% on room air. Lungs clear to auscultation bilaterally. Heart: regular rate and rhythm, no murmurs.",
          assessment: "Atypical chest pain, likely musculoskeletal given the presentation, but cannot definitively rule out mild angina.",
          plan: "1. Order 12-lead EKG today.\n2. Prescribe Ibuprofen 400mg PRN for pain.\n3. Return to clinic in 48 hours for follow-up if symptoms persist."
        });
      }, 2500);
    } else {
      setNotes({ subjective: "", objective: "", assessment: "", plan: "" });
      setListening(true);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Mic color="#22c55e" /> BX Ambient Scribe
        </h1>
        <p className={styles.pageDesc}>AI listens to your consultation and autonomously drafts structured SOAP notes.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
        {/* Controls */}
        <div>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px', padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {listening && <div style={{ position: 'absolute', inset: 0, background: 'rgba(34,197,94,0.05)', animation: 'pulse 2s infinite' }} />}
            
            <button 
              onClick={toggleListen}
              style={{
                width: '120px', height: '120px', borderRadius: '50%', cursor: 'pointer',
                background: listening ? 'rgba(255,51,102,0.1)' : 'rgba(34,197,94,0.1)',
                border: `2px solid ${listening ? '#FF3366' : '#22c55e'}`,
                color: listening ? '#FF3366' : '#22c55e',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                margin: '0 auto 1.5rem', transition: 'all 0.3s', position: 'relative', zIndex: 1
              }}
            >
              {listening ? <MicOff size={40} /> : <Mic size={40} />}
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', position: 'relative', zIndex: 1 }}>
              {listening ? "Listening to Consultation..." : "Start Ambient Scribe"}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.5rem', position: 'relative', zIndex: 1 }}>
              {listening ? "AI is processing speech in real-time." : "Click to begin hands-free dictation."}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(177,76,255,0.05)', borderRadius: '20px', border: '1px solid rgba(177,76,255,0.2)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B14CFF', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <BrainCircuit size={16} /> AI Confidence Score
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: notes.subjective ? '98%' : '0%', height: '100%', background: 'linear-gradient(90deg, #8B2EFF, #B14CFF)', transition: 'width 1s ease' }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: '#B14CFF', fontWeight: 700 }}>{notes.subjective ? '98%' : '0%'}</span>
            </div>
          </div>
        </div>

        {/* Note Output */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText color="#22c55e" /> Clinical SOAP Note
            </h2>
            <button style={{ 
              background: 'linear-gradient(135deg, #16a34a, #22c55e)', border: 'none', color: '#fff',
              padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', opacity: notes.subjective ? 1 : 0.5
            }}>
              <Save size={16} /> Save to EMR
            </button>
          </div>

          {processing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <Loader2 size={40} color="#22c55e" className="spin" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#22c55e', fontWeight: 600 }}>AI is structuring your clinical note...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Subjective</label>
                <textarea 
                  value={notes.subjective} readOnly placeholder="AI will extract patient symptoms and history..."
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Objective</label>
                <textarea 
                  value={notes.objective} readOnly placeholder="AI will extract physical exam findings and vitals..."
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Assessment</label>
                <textarea 
                  value={notes.assessment} readOnly placeholder="AI will extract diagnoses..."
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Plan</label>
                <textarea 
                  value={notes.plan} readOnly placeholder="AI will extract treatment plan and prescriptions..."
                  style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
