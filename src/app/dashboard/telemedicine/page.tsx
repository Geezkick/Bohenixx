"use client";

import React, { useState, useEffect, useRef } from "react";
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
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const text = event.results[lastResultIndex][0].transcript;
        if (text.trim()) {
          setTranscript(p => [...p, { role: 'doctor', text }]);
        }
      };
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, inCall]);

  const startCall = async () => {
    setConnecting(true);
    
    try {
      // Request real webcam/mic access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      
      setConnecting(false);
      setInCall(true);
      
      // Start AI Transcription
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setTranscript([{ role: 'ai', text: '[AI] Secure connection established. Live transcription active.'}]);
      }
      
    } catch (err) {
      console.error("Failed to access media devices", err);
      alert("Microphone and Camera access are required for Telemedicine.");
      setConnecting(false);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setInCall(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoOff(!localStream.getVideoTracks()[0].enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicMuted(!localStream.getAudioTracks()[0].enabled);
    }
  };

  const autoGenerateRx = async () => {
    if (transcript.length === 0) return;
    
    // Simulate sending to Gemini for Rx (similar to Scribe)
    setTranscript(p => [...p, { role: 'ai', text: '[AI] Generating prescription and clinical summary...' }]);
    
    setTimeout(() => {
      setTranscript(p => [...p, { role: 'ai', text: '[AI] Recommended Rx: Amoxicillin 500mg. Sent to pharmacy.' }]);
    }, 2000);
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
          <p style={{ color: '#00E5FF', fontWeight: 600 }}>Requesting camera and microphone access...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
          {/* Main Video Area */}
          <div style={{ 
            background: '#000', borderRadius: '24px', position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Real Webcam Feed (Using local feed as main view for demonstration since no remote peer exists) */}
            <video 
              ref={localVideoRef}
              autoPlay 
              playsInline 
              muted
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: 'scaleX(-1)', opacity: videoOff ? 0 : 1
              }}
            />
            {videoOff && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <VideoOff size={60} />
              </div>
            )}
            
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)', pointerEvents: 'none' }} />

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
              <button onClick={toggleAudio} style={{ background: micMuted ? 'rgba(255,255,255,0.2)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
                {micMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button onClick={toggleVideo} style={{ background: videoOff ? 'rgba(255,255,255,0.2)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
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
              {transcript.map((msg, i) => (
                <div key={i} style={{ 
                  background: msg.role === 'ai' ? 'rgba(177,76,255,0.1)' : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'ai' ? '1px solid rgba(177,76,255,0.2)' : 'none',
                  padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', color: msg.role === 'ai' ? '#B14CFF' : '#fff'
                }}>
                  {msg.role === 'doctor' && <span style={{ fontWeight: 700, opacity: 0.5, marginRight: '6px' }}>You:</span>}
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={autoGenerateRx} style={{ 
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
