"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Check, Plus, Calendar as CalendarIcon, Clock, Users, X, Loader2 } from "lucide-react";

export default function AppointmentsDashboard() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", duration: "30", price: "" });

  const fetchData = async () => {
    try {
      const [apptsRes, svcsRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/appointments/services')
      ]);
      const apptsData = await apptsRes.json();
      const svcsData = await svcsRes.json();
      
      if (apptsData.appointments) setAppointments(apptsData.appointments);
      if (svcsData.services) setServices(svcsData.services);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      setHasAccess(true); 
      await fetchData();
      setLoading(false);
    };
    checkAccess();
  }, []);

  const handleInstall = () => {
    setLoading(true);
    setTimeout(() => {
      setHasAccess(true);
      fetchData();
      setLoading(false);
    }, 1500);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", duration: "30", price: "" });
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleInstall} style={{ padding: "0.8rem 2rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            Activate App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form onSubmit={handleCreateService} style={{ background: "#111", padding: "2rem", borderRadius: "16px", width: "90%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>New Service</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Service Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Duration (mins)</label>
                <input required type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Price ($) (Optional)</label>
                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", minHeight: "80px" }} />
            </div>

            <button disabled={isSubmitting} type="submit" style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
              {isSubmitting ? <Loader2 size={18} className="spin" /> : "Create Service"}
            </button>
          </form>
        </div>
      )}

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Image src="/bohenixx.png" alt="BX Scheduler" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Scheduler</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Manage your appointments</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
            <Plus size={16} /> New Service
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CalendarIcon size={16} /> Upcoming Bookings
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{appointments.filter(a => new Date(a.startTime) > new Date()).length}</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={16} /> Total Bookings
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{appointments.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={16} /> Active Services
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{services.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Your Services</h3>
          {services.length === 0 ? (
            <div className="glass-panel" style={{ padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
              No services defined yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {services.map(svc => (
                <div key={svc.id} className="glass-panel" style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{svc.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "space-between" }}>
                    <span>{svc.duration} mins</span>
                    {svc.price && <span>${svc.price.toFixed(2)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(177,76,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
                <CalendarIcon size={32} color="#B14CFF" />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your calendar is empty</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
                Create a service, set your availability, and share your booking link with clients.
              </p>
            </div>
          ) : (
            <div className="glass-panel" style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Client</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Service</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Date & Time</th>
                    <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>
                        {appt.clientName}
                        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>{appt.clientEmail}</div>
                      </td>
                      <td style={{ padding: "1rem" }}>{appt.service.name}</td>
                      <td style={{ padding: "1rem" }}>
                        {new Date(appt.startTime).toLocaleDateString()}
                        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                          {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600, background: appt.status === 'CONFIRMED' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: appt.status === 'CONFIRMED' ? '#22c55e' : '#f59e0b' }}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
