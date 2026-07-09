"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Check, Plus, FileText, DollarSign, Users, X, Loader2 } from "lucide-react";

export default function InvoicesDashboard() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, unpaid: 0, totalClients: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ clientName: "", clientEmail: "", amount: "", dueDate: "", notes: "" });

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (data.invoices) {
        setInvoices(data.invoices);
        setClients(data.clients || []);
        
        const rev = data.invoices.filter((i: any) => i.status !== 'PAID').reduce((sum: number, i: any) => sum + i.amount, 0);
        const unp = data.invoices.filter((i: any) => i.status !== 'PAID').length;
        
        setStats({
          revenue: rev,
          unpaid: unp,
          totalClients: data.clients?.length || 0
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      // In a real app, this checks UserSubscription
      setHasAccess(true); 
      await fetchInvoices();
      setLoading(false);
    };
    checkAccess();
  }, []);

  const handleInstall = () => {
    setLoading(true);
    setTimeout(() => {
      setHasAccess(true);
      fetchInvoices();
      setLoading(false);
    }, 1500);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({ clientName: "", clientEmail: "", amount: "", dueDate: "", notes: "" });
        fetchInvoices();
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
          <Image src="/bohenixx.png" alt="BX Invoices" width={64} height={64} style={{ marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", background: "linear-gradient(to right, #fff, #a0a0a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BX Invoices
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
            Automate your billing. Create beautiful invoices, set up automatic payment reminders, and get paid faster.
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
          <form onSubmit={handleCreateInvoice} style={{ background: "#111", padding: "2rem", borderRadius: "16px", width: "90%", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Create Invoice</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Client Name</label>
              <input required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Client Email</label>
              <input required type="email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Amount ($)</label>
                <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              </div>
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Notes (Optional)</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", minHeight: "80px" }} />
            </div>

            <button disabled={isSubmitting} type="submit" style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
              {isSubmitting ? <Loader2 size={18} className="spin" /> : "Send Invoice"}
            </button>
          </form>
        </div>
      )}

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Image src="/bohenixx.png" alt="BX Invoices" width={40} height={40} />
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>Invoices</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: 0 }}>Manage your billing</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#B14CFF", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <DollarSign size={16} /> Outstanding Revenue
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>${stats.revenue.toFixed(2)}</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} /> Unpaid Invoices
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.unpaid}</div>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h4 style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 0.5rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={16} /> Total Clients
          </h4>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.totalClients}</div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(177,76,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
            <FileText size={32} color="#B14CFF" />
          </div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No invoices yet</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem auto" }}>
            Create your first invoice to start getting paid faster.
          </p>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", background: "#fff", border: "none", color: "#000", cursor: "pointer", fontWeight: 600 }}>
            Create First Invoice
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Invoice</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Client</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Amount</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Status</th>
                <th style={{ padding: "1rem", textAlign: "left", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: "1rem" }}>
                    <div>{inv.client.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{inv.client.email}</div>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>${inv.amount.toFixed(2)}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600, background: inv.status === 'PAID' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: inv.status === 'PAID' ? '#22c55e' : '#f59e0b' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "rgba(255,255,255,0.7)" }}>{new Date(inv.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
