"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Truck, AlertTriangle, CheckCircle2, TrendingDown, Package, Zap } from "lucide-react";

const INITIAL_INVENTORY = [
  { id: 1, name: "Paracetamol 500mg", stock: 120, status: "critical", predictedOutage: "2 days", trend: "down" },
  { id: 2, name: "Amoxicillin 250mg", stock: 450, status: "stable", predictedOutage: "14 days", trend: "stable" },
  { id: 3, name: "Ibuprofen 400mg", stock: 85, status: "warning", predictedOutage: "5 days", trend: "down" },
  { id: 4, name: "Saline IV Bags 1L", stock: 1200, status: "stable", predictedOutage: "30+ days", trend: "up" },
];

export default function SupplyChainPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [restocking, setRestocking] = useState<number | null>(null);

  const handleAutoRestock = (id: number) => {
    setRestocking(id);
    setTimeout(() => {
      setInventory(prev => prev.map(item => 
        item.id === id 
          ? { ...item, stock: item.stock + 500, status: 'stable', predictedOutage: '30+ days' }
          : item
      ));
      setRestocking(null);
    }, 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck color="#B14CFF" /> BX Supply Chain & Logistics
          </h1>
          <p className={styles.pageDesc}>AI predictive inventory management and automated vendor negotiations.</p>
        </div>
        <div style={{ background: 'rgba(177,76,255,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', border: '1px solid rgba(177,76,255,0.3)', color: '#B14CFF', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
          <Zap size={16} /> AI Routing Active
        </div>
      </div>

      {/* AI Alert Banner */}
      <div style={{ 
        background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', borderRadius: '16px', 
        padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' 
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,51,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF3366', flexShrink: 0 }}>
          <AlertTriangle size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#FF3366', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Critical Stock Depletion Warning</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            AI predictive models indicate <strong style={{color:'#fff'}}>Paracetamol 500mg</strong> will run out in exactly 48 hours due to a localized 35% spike in flu-like symptoms. 
          </p>
        </div>
        <button 
          onClick={() => handleAutoRestock(1)}
          disabled={restocking === 1}
          style={{ 
            background: 'linear-gradient(135deg, #ff0055, #FF3366)', border: 'none', color: '#fff', 
            padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: restocking === 1 ? 'not-allowed' : 'pointer',
            opacity: restocking === 1 ? 0.7 : 1, whiteSpace: 'nowrap'
          }}
        >
          {restocking === 1 ? "Negotiating PO..." : "Auto-Restock (1-Click)"}
        </button>
      </div>

      {/* Inventory Grid */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>Medical Item</th>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>Current Stock</th>
              <th style={{ padding: '1.5rem', fontWeight: 600 }}>AI Predicted Outage</th>
              <th style={{ padding: '1.5rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      <Package size={20} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.stock}</span>
                    {item.trend === 'down' ? <TrendingDown size={16} color="#FF3366" /> : null}
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700,
                    background: item.status === 'critical' ? 'rgba(255,51,102,0.1)' : item.status === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                    color: item.status === 'critical' ? '#FF3366' : item.status === 'warning' ? '#f59e0b' : '#22c55e'
                  }}>
                    {item.predictedOutage}
                  </span>
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                  {item.status === 'stable' ? (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Optimal
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleAutoRestock(item.id)}
                      disabled={restocking === item.id}
                      style={{ 
                        background: 'rgba(177,76,255,0.1)', border: '1px solid rgba(177,76,255,0.3)', color: '#B14CFF', 
                        padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                        opacity: restocking === item.id ? 0.5 : 1
                      }}
                    >
                      {restocking === item.id ? "Ordering..." : "Restock"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
