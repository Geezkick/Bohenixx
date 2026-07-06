"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Check, Plus, Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function AppointmentsDashboard() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setHasAccess(false); 
      setLoading(false);
    };
    checkAccess();
  }, []);

  const handleInstall = () => {
    setLoading(true);
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
          <Image src="/bohenixx.png" alt="BX Scheduler" width={64} height={64} style={{ marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", background: "linear-gradient(to right, #fff, #a0a0a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BX Scheduler
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
            The smartest way to manage your time. Let clients book appointments instantly with a customized booking portal.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {/* Free Tier */}
          <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Solo</h3>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>$0 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>/ forever</span></div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> 1 Active Calendar
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Basic Booking Page
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Manual Approvals
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
          <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", border: "1px solid rgba(177,76,255,0.3)", position: "relative", background: "linear-gradient(180deg, rgba(177,76,255,0.05) 0%, rgba(0,0,0,0) 100%)" }}>
            <div style={{ position: "absolute", top: 0, right: 0, background: "#B14CFF", color: "#fff", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 1rem", borderBottomLeftRadius: "8px" }}>
              POPULAR
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#B14CFF" }}>Business</h3>
            <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>$15 <span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)" }}>/ month</span></div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Unlimited Calendars & Services
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Automated Email/SMS Reminders
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}>
                <Check size={18} color="#B14CFF" /> Google/Outlook Sync
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
          <Image src="/bohenixx.png" alt="BX Scheduler" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Scheduler</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Manage your appointments</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
            <Plus size={16} /> New Service
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CalendarIcon size={16} /> Upcoming Bookings
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={16} /> Hours Booked (This Week)
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>0h</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={16} /> Active Services
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>0</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(177,76,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
          <CalendarIcon size={32} color="#B14CFF" />
        </div>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your calendar is empty</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
          Create a service, set your availability, and share your booking link with clients.
        </p>
        <button style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", background: "#fff", border: "none", color: "#000", cursor: "pointer", fontWeight: 600 }}>
          Create First Service
        </button>
      </div>
    </div>
  );
}
