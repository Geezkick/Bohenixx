"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";
import { Package, Shield, Server, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

export default function SubscriptionsPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleCancelClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowCancelModal(true);
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Products & Services</h1>
      <p className={styles.pageDesc}>Manage your active subscriptions, enterprise retainers, and billing settings.</p>

      {/* Mock Cancel Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: '#111', padding: '3rem', borderRadius: '24px', width: '90%', maxWidth: '500px', border: '1px solid rgba(255,51,102,0.3)', position: 'relative', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#FF3366" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>Cancel {selectedService}?</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Are you sure you want to cancel your {selectedService} subscription? You will lose access to all premium features at the end of your current billing cycle.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowCancelModal(false)}
                className={styles.btnSecondary}
              >
                Keep Subscription
              </button>
              <button 
                onClick={() => {
                  alert(`In a production environment, this would cancel ${selectedService} via Stripe.`);
                  setShowCancelModal(false);
                }}
                className={styles.btnDanger}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Active Products */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={24} color="#B14CFF" /> Active Software Licenses
          </h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            
            <div className={styles.listItem} style={{ padding: '2rem 1.5rem' }}>
              <div className={styles.itemInfo}>
                <div className={styles.itemIcon}>
                  <img src="/safura.png" alt="Safura" style={{ width: '28px', height: '28px' }} />
                </div>
                <div>
                  <div className={styles.itemTitle}>Safura AI Food Scanner</div>
                  <div className={styles.itemDesc}>Enterprise API License • Billed $299/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                <button onClick={() => handleCancelClick("Safura API")} className={styles.btnDanger} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
              </div>
            </div>

            <div className={styles.listItem} style={{ padding: '2rem 1.5rem' }}>
              <div className={styles.itemInfo}>
                <div className={styles.itemIcon}>
                  <img src="/njiasafee.png" alt="NjiaSafe" style={{ width: '28px', height: '28px' }} />
                </div>
                <div>
                  <div className={styles.itemTitle}>NjiaSafe Fleet Analytics</div>
                  <div className={styles.itemDesc}>Pro Plan • Billed $49/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                <button onClick={() => handleCancelClick("NjiaSafe Fleet")} className={styles.btnDanger} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
              </div>
            </div>
            
          </div>
        </section>

        {/* Enterprise Retainers */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={24} color="#00E5FF" /> Managed Enterprise Services
          </h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            
            <div className={styles.listItem} style={{ padding: '2rem 1.5rem' }}>
              <div className={styles.itemInfo}>
                <div className={styles.itemIcon} style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <Shield size={24} color="#22c55e" />
                </div>
                <div>
                  <div className={styles.itemTitle}>24/7 SOC & Threat Monitoring</div>
                  <div className={styles.itemDesc}>Annual Contract • Renews Dec 2026</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>
                <button className={styles.btnSecondary} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Contract</button>
              </div>
            </div>

          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} color="#FFD700" /> Payment Methods
          </h2>
          <div className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.5rem 1rem', background: '#fff', borderRadius: '8px', color: '#111', fontWeight: 800, fontStyle: 'italic', fontSize: '1.2rem' }}>VISA</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Visa ending in 4242</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Expires 12/28 • Default</div>
              </div>
            </div>
            <button className={styles.btnSecondary}>Update Card</button>
          </div>
        </section>

      </div>
    </>
  );
}
