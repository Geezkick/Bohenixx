"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard.module.css";
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, Settings, 
  Activity, HeartPulse, Stethoscope, BrainCircuit, Loader2, CheckCircle2
} from "lucide-react";

export default function TelemedicinePage() {
  const [inCall, setInCall] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [transcript, setTranscript] = useState<{role: 'ai'|'patient'|'doctor', text: string}[]>([]);

  const startCall = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setInCall(true);
      
      // Simulate live AI transcription
      setTimeout(() => setTranscript(p => [...p, { role: 'ai', text: '[AI] Connection secure. Patient vitals acquired via IoT.'}]), 1000);
      setTimeout(() => setTranscript(p => [...p, { role: 'patient', text: 'Hi Dr. Sarah, my throat has been hurting since yesterday.'}]), 3000);
      setTimeout(() => setTranscript(p => [...p, { role: 'ai', text: '[AI] Symptom detected: Sore throat. Duration: 24hrs. Checking local epidemiological data... 15% spike in Strep A.'}]), 4500);
    }, 1500);
  };

  const endCall = () => {
    setInCall(false);
    setTranscript([]);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Video color="#00E5FF" /> BX Telemedicine
        </h1>
        <p className={styles.pageDesc}>Secure virtual care with real-time AI transcription and vital monitoring.</p>
      </div>

      {!inCall && !connecting ? (
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' 
        }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,229,255,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#00E5FF'
          }}>
            <Video size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Waiting Room</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
            Next Appointment: John Doe (Follow-up)
          </p>
          <button 
            onClick={startCall}
            style={{
              background: 'linear-gradient(135deg, #00B4D8, #00E5FF)', border: 'none', color: '#000',
              padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto'
            }}
          >
            <Video size={20} /> Admit Patient to Call
          </button>
        </div>
      ) : connecting ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem' }}>
          <Loader2 size={40} color="#00E5FF" className="spin" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#00E5FF', fontWeight: 600 }}>Establishing end-to-end encrypted connection...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
          {/* Main Video Area */}
          <div style={{ 
            background: '#000', borderRadius: '24px', position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Simulated Patient Video (Placeholder) */}
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'url("https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }} />
            
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)' }} />

            {/* Doctor PIP */}
            <div style={{
              position: 'absolute', top: '20px', right: '20px', width: '150px', height: '100px',
              background: '#111', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)'
            }}>
              {videoOff ? <VideoOff size={30} /> : "You"}
            </div>

            {/* Vitals Overlay */}
            <div style={{
              position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,51,102,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF3366', fontWeight: 700, marginBottom: '8px' }}>
                <HeartPulse size={16} /> 72 BPM
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00E5FF', fontWeight: 700 }}>
                <Activity size={16} /> 98% SpO2
              </div>
            </div>

            {/* Controls */}
            <div style={{
              position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.5rem', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <button onClick={() => setMicMuted(!micMuted)} style={{ background: micMuted ? 'rgba(255,255,255,0.2)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                {micMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button onClick={() => setVideoOff(!videoOff)} style={{ background: videoOff ? 'rgba(255,255,255,0.2)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                {videoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
              <button onClick={endCall} style={{ background: '#FF3366', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px 24px', borderRadius: '99px', fontWeight: 600 }}>
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* AI Sidebar */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(177,76,255,0.05)' }}>
              <BrainCircuit color="#B14CFF" size={20} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#B14CFF' }}>AI Copilot Live</h3>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transcript.length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: '2rem' }}>
                  Listening...
                </div>
              )}
              {transcript.map((msg, i) => (
                <div key={i} style={{ 
                  background: msg.role === 'ai' ? 'rgba(177,76,255,0.1)' : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'ai' ? '1px solid rgba(177,76,255,0.2)' : 'none',
                  padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', color: msg.role === 'ai' ? '#B14CFF' : '#fff'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button style={{ 
                width: '100%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                color: '#22c55e', padding: '0.75rem', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
              }}>
                <Stethoscope size={16} /> Auto-Generate Rx
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
