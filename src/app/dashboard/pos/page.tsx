"use client";

import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./pos.module.css";
import {
  Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package,
  BarChart3, Receipt, Clock, CheckCircle2, Printer, X, Shield, Users, 
  Wifi, Loader2, ExternalLink, Activity, Pill, Stethoscope, AlertTriangle, Lightbulb, BrainCircuit, HeartPulse, Smartphone
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

// ─── Types ───
type Category = "All" | "Pharmacy (Rx)" | "OTC Meds" | "Consultations" | "Lab Tests" | "Medical Devices";
interface Product { id: string; name: string; price: number; category: Category; icon: React.ReactNode; stock: number; interactsWith?: string[]; atcCode?: string; }
interface CartItem extends Product { quantity: number; }
interface Transaction { id: string; items: CartItem[]; subtotal: number; tax: number; discount: number; total: number; date: Date; method: string; status: "completed" | "pending"; checkoutUrl?: string; patientName?: string; }

// ─── Medical Demo Inventory ───
const PRODUCTS: Product[] = [
  { id: "rx1", name: "Amoxicillin 500mg", price: 12.50, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 350, atcCode: "J01CA04" },
  { id: "rx2", name: "Lisinopril 10mg", price: 8.99, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 120, atcCode: "C09AA03" },
  { id: "rx3", name: "Warfarin 5mg", price: 15.00, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 80, interactsWith: ["otc1", "rx4"] },
  { id: "rx4", name: "Aspirin 81mg (Rx)", price: 5.50, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 500, interactsWith: ["rx3", "otc1"] },
  { id: "otc1", name: "Ibuprofen 400mg", price: 6.99, category: "OTC Meds", icon: <Package size={26} />, stock: 800, interactsWith: ["rx3", "rx4"] },
  { id: "otc2", name: "Paracetamol 500mg", price: 4.50, category: "OTC Meds", icon: <Package size={26} />, stock: 45 },
  { id: "otc3", name: "Loratadine 10mg", price: 9.99, category: "OTC Meds", icon: <Package size={26} />, stock: 200 },
  { id: "c1", name: "General Consultation", price: 50.00, category: "Consultations", icon: <Stethoscope size={26} />, stock: 999 },
  { id: "c2", name: "Specialist Follow-up", price: 120.00, category: "Consultations", icon: <Stethoscope size={26} />, stock: 999 },
  { id: "t1", name: "Comprehensive Blood Panel", price: 85.00, category: "Lab Tests", icon: <Activity size={26} />, stock: 999 },
  { id: "t2", name: "Lipid Profile", price: 45.00, category: "Lab Tests", icon: <Activity size={26} />, stock: 999 },
  { id: "d1", name: "Digital Thermometer", price: 14.99, category: "Medical Devices", icon: <HeartPulse size={26} />, stock: 60 },
  { id: "d2", name: "Blood Pressure Monitor", price: 49.99, category: "Medical Devices", icon: <HeartPulse size={26} />, stock: 15 },
];

const CATEGORIES: Category[] = ["All", "Pharmacy (Rx)", "OTC Meds", "Consultations", "Lab Tests", "Medical Devices"];
const DISCOUNT_CODES: Record<string, number> = { "HEALTH10": 10, "SENIOR20": 20, "INSURANCE_COPAY": 80 };
const TAX_RATE = 0.08; // Healthcare specific tax rate

// ─── Subscription Plans ───
const PLANS = [
  { name: "Clinic Starter", price: 0, period: "Free forever", features: ["Up to 50 medical items", "Basic patient billing", "Receipt generation", "1 practitioner account"], popular: false },
  { name: "Health Pro", price: 89, period: "/month", features: ["Unlimited inventory", "AI Drug Interaction Engine", "Insurance integrations", "Predictive stock analytics", "5 practitioner accounts", "EMR sync"], popular: true },
  { name: "Hospital Enterprise", price: 299, period: "/month", features: ["Everything in Pro", "Multi-branch synchronization", "Full API access", "24/7 dedicated support", "Unlimited staff", "Custom AI models"], popular: false },
];

function POSContent() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Terminal state
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showReceipt, setShowReceipt] = useState<Transaction | null>(null);
  
  // Dashboard Views
  const [view, setView] = useState<"terminal" | "history" | "insights">("terminal");
  
  const [isCharging, setIsCharging] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaProcessing, setMpesaProcessing] = useState(false);
  
  // AI State
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiWarning, setAiWarning] = useState<{ active: boolean; message: string; severity: 'high' | 'medium' }>({ active: false, message: "", severity: 'medium' });

  // Hydrate subscription state
  useEffect(() => {
    const savedPlan = localStorage.getItem("bx_health_pos_plan");
    if (savedPlan) {
      setSelectedPlan(savedPlan);
      setIsSubscribed(true);
    }
    
    if (searchParams.get("success") === "true") {
      setIsSubscribed(true);
      if (!savedPlan) {
        localStorage.setItem("bx_health_pos_plan", "Health Pro");
        setSelectedPlan("Health Pro");
      }
      showNotification({ title: "Welcome to BX Medical POS", message: "Your health terminal is active.", type: "success" });
      router.replace("/dashboard/pos");
    }
  }, [searchParams, router, showNotification]);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "All" || p.category === activeCat;
    return matchSearch && matchCat;
  }), [search, activeCat]);

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    setAiWarning({ active: false, message: "", severity: 'medium' }); // Reset AI warning on cart change
  }, []);

  const updateQty = (id: string, d: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const nq = i.quantity + d;
      return nq > 0 ? { ...i, quantity: nq } : i;
    }));
    setAiWarning({ active: false, message: "", severity: 'medium' });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    setAiWarning({ active: false, message: "", severity: 'medium' });
  };
  
  const clearCart = () => { 
    setCart([]); setAppliedDiscount(0); setDiscountCode(""); setPatientName(""); setAiWarning({ active: false, message: "", severity: 'medium' }); 
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmt = subtotal * (appliedDiscount / 100);
  const taxable = subtotal - discountAmt;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const applyDiscount = () => {
    const pct = DISCOUNT_CODES[discountCode.toUpperCase()];
    if (pct) {
      setAppliedDiscount(pct);
      showNotification({ title: "Insurance/Discount Applied", message: `${pct}% covered!`, type: "success" });
    } else {
      showNotification({ title: "Invalid Code", message: "That coverage code doesn't exist.", type: "error" });
    }
  };

  const runAiSafetyCheck = () => {
    if (cart.length < 2) {
      showNotification({ title: "AI Engine", message: "Add more items to check for interactions.", type: "success" });
      return;
    }
    
    setIsAiChecking(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAiChecking(false);
      
      // Check for predefined interactions
      let interactionFound = false;
      
      for (const item of cart) {
        if (item.interactsWith) {
          const conflictingItem = cart.find(cartItem => item.interactsWith?.includes(cartItem.id));
          if (conflictingItem) {
            interactionFound = true;
            setAiWarning({
              active: true,
              severity: 'high',
              message: `AI Safety Alert: Severe interaction detected between ${item.name} and ${conflictingItem.name}. This combination increases risk of internal bleeding. Please review prescription protocols.`
            });
            break;
          }
        }
      }
      
      if (!interactionFound) {
        setAiWarning({
          active: true,
          severity: 'medium',
          message: `AI Safety Check complete: No known adverse interactions detected among current cart items.`
        });
      }
    }, 1500);
  };

  const handleCharge = async () => {
    if (!cart.length) return;
    setIsCharging(true);
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: `Medical Billing (${cart.length} items)`,
          priceAmount: total,
          type: 'pos_transaction',
          returnUrl: '/dashboard/pos'
        })
      });
      const data = await res.json();
      
      const txn: Transaction = {
        id: `MED-TXN-${Date.now().toString(36).toUpperCase()}`,
        items: [...cart], subtotal, tax, discount: discountAmt, total,
        date: new Date(), method: "Stripe (Card)", status: "pending",
        checkoutUrl: data.url,
        patientName: patientName || "Walk-in Patient"
      };
      
      setTransactions(prev => [txn, ...prev]);
      setShowReceipt(txn);
      clearCart();
    } catch (err) {
      showNotification({ title: "Billing Error", message: "Failed to generate payment link.", type: "error" });
    } finally {
      setIsCharging(false);
    }
  };

  const handleMpesaCharge = async () => {
    if (!cart.length) return;
    if (!mpesaPhone || mpesaPhone.length < 10) {
      showNotification({ title: "M-Pesa", message: "Enter a valid Safaricom phone number.", type: "error" });
      return;
    }
    setMpesaProcessing(true);
    
    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaPhone,
          amount: Math.ceil(total * 130), // USD to KES approximate conversion
          description: `Medical Billing (${cart.length} items)`,
        })
      });
      const data = await res.json();
      
      const txn: Transaction = {
        id: `MPESA-${Date.now().toString(36).toUpperCase()}`,
        items: [...cart], subtotal, tax, discount: discountAmt, total,
        date: new Date(), method: `M-Pesa (${mpesaPhone})`, status: data.success ? "completed" : "pending",
        patientName: patientName || "Walk-in Patient"
      };
      
      setTransactions(prev => [txn, ...prev]);
      setShowReceipt(txn);
      clearCart();
      setMpesaPhone("");
      showNotification({ title: "M-Pesa STK Push Sent", message: data.message || "Check the patient's phone to complete payment.", type: "success" });
    } catch (err) {
      showNotification({ title: "M-Pesa Error", message: "Failed to initiate STK push.", type: "error" });
    } finally {
      setMpesaProcessing(false);
    }
  };

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) {
      localStorage.setItem("bx_health_pos_plan", plan.name);
      setSelectedPlan(plan.name);
      setIsSubscribed(true);
      showNotification({ title: "Free Plan Activated", message: "Welcome to BX Medical POS!", type: "success" });
      return;
    }
    
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: `BX POS ${plan.name} Subscription`,
          priceAmount: plan.price,
          type: 'pos_subscription',
          returnUrl: '/dashboard/pos'
        })
      });
      const data = await res.json();
      if (data.url && !data.url.includes("mock_checkout")) {
        window.location.href = data.url;
      } else {
        localStorage.setItem("bx_health_pos_plan", plan.name);
        setSelectedPlan(plan.name);
        setIsSubscribed(true);
        showNotification({ title: "Dev Mode: Plan Activated", message: "Simulating checkout.", type: "success" });
      }
    } catch (error) {
      showNotification({ title: "Checkout Error", message: "Failed to start checkout process.", type: "error" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ─── Subscription Gate ───
  if (!isSubscribed) {
    return (
      <div className={styles.gateContainer}>
        <div className={styles.gateHero}>
          <div className={styles.gateBadge}><BrainCircuit size={14} /> AI Healthcare Integrated</div>
          <h1 className={styles.gateTitle}>Bohenix Medical POS</h1>
          <p className={styles.gateSubtitle}>
            An advanced AI-integrated point-of-sale and inventory system optimized for healthcare, pharmacies, and clinics. Features real-time AI drug interaction warnings, predictive stock forecasting, and seamless medical billing.
          </p>
        </div>

        <div className={styles.plansGrid}>
          {PLANS.map(plan => (
            <div key={plan.name} className={`${styles.planCard} ${plan.popular ? styles.planPopular : ""}`}>
              {plan.popular && <span className={styles.popularTag}>Most Popular</span>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>${plan.price}</span>
                <span className={styles.planPeriod}>{plan.period}</span>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map(f => (
                  <li key={f}><CheckCircle2 size={16} color="#22c55e" /> {f}</li>
                ))}
              </ul>
              <button
                className={`${styles.planBtn} ${plan.popular ? styles.planBtnPrimary : styles.planBtnSecondary}`}
                onClick={() => handleSubscribe(plan)}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? <Loader2 size={18} className="spin" /> : (plan.price === 0 ? "Start Free" : "Subscribe Now")}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.featuresGrid}>
          {[
            { icon: <Shield size={24} />, title: "AI Safety Checks", desc: "Real-time drug interaction warnings before checkout." },
            { icon: <BarChart3 size={24} />, title: "Predictive Inventory", desc: "AI forecasts medical stock depletion based on seasonal trends." },
            { icon: <CreditCard size={24} />, title: "Insurance & Billing", desc: "Process split payments and medical insurance copays." },
            { icon: <Users size={24} />, title: "Practitioner Profiles", desc: "Track sales and prescriptions by attending physician." },
            { icon: <Wifi size={24} />, title: "Works Offline", desc: "Critical healthcare operations continue without internet." },
            { icon: <Receipt size={24} />, title: "Medical Receipts", desc: "Print compliant receipts with ICD-10 codes and patient data." },
          ].map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Transaction History View ───
  if (view === "history") {
    return (
      <div className={styles.posContainer} style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Medical Billing History</h2>
          <button className={styles.historyToggle} onClick={() => setView("terminal")}>
            <X size={16} /> Close
          </button>
        </div>
        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>
            <Clock size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p>No billing records yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {transactions.map(txn => (
              <div key={txn.id} onClick={() => { setShowReceipt(txn); setView("terminal"); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", cursor: "pointer", transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{txn.id} <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: "10px" }}>{txn.patientName}</span></div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
                    {txn.date.toLocaleString()} · {txn.items.length} item{txn.items.length > 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#22c55e", fontSize: "1.1rem" }}>${txn.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── AI Insights View ───
  if (view === "insights") {
    return (
      <div className={styles.posContainer} style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit color="#B14CFF" /> AI Health Operations Insights
          </h2>
          <button className={styles.historyToggle} onClick={() => setView("terminal")}>
            <X size={16} /> Close
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Inventory Forecasting
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              <strong>Paracetamol 500mg</strong> stock is depleting 42% faster than last month. Based on local epidemiological data predicting an early flu season, current stock will be exhausted in 4 days.
            </p>
            <button style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              Auto-Reorder Supply
            </button>
          </div>

          <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#00E5FF', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} /> Revenue Optimization
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Patient consultations have increased by 15% on weekends. AI recommends enabling automated Copay capture and offering a specific discount code (<strong>WEEKEND_CARE</strong>) to balance patient load to weekdays.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>Generated Code: WEEKEND_CARE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active POS Terminal ───
  return (
    <div className={styles.terminal}>
      {/* Receipt / Payment Modal */}
      {showReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setShowReceipt(null)}>
          <div className={styles.receipt} onClick={e => e.stopPropagation()}>
            <div className={styles.receiptLogo}>
              <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} style={{ margin: "0 auto 8px" }} />
              <h3>Bohenix Medical POS</h3>
              <p>{user?.name || "Clinic Staff"} · {selectedPlan}</p>
            </div>
            
            {showReceipt.checkoutUrl && (
              <div style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem', background: 'rgba(177, 76, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(177, 76, 255, 0.3)' }}>
                <p style={{ fontSize: '0.85rem', color: '#B14CFF', fontWeight: 600, marginBottom: '0.5rem' }}>Patient Payment Link Ready</p>
                <a href={showReceipt.checkoutUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#B14CFF', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                  Open Checkout <ExternalLink size={14} />
                </a>
              </div>
            )}
            
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptMeta}><span>Patient</span><span>{showReceipt.patientName}</span></div>
            <div className={styles.receiptMeta}><span>Invoice ID</span><span>{showReceipt.id}</span></div>
            <div className={styles.receiptMeta}><span>Date</span><span>{showReceipt.date.toLocaleDateString()} {showReceipt.date.toLocaleTimeString()}</span></div>
            <div className={styles.receiptMeta}><span>Attending</span><span>{user?.name || "Dr. Staff"}</span></div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptItems}>
              {showReceipt.items.map(i => (
                <div key={i.id} className={styles.receiptItem}>
                  <div>
                    <span>{i.quantity}x {i.name}</span>
                    {i.atcCode && <div style={{ fontSize: '10px', color: '#888' }}>ATC: {i.atcCode}</div>}
                  </div>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptTotals}>
              <div className={styles.receiptTotalRow}><span>Subtotal</span><span>${showReceipt.subtotal.toFixed(2)}</span></div>
              {showReceipt.discount > 0 && <div className={styles.receiptTotalRow} style={{ color: "#22c55e" }}><span>Coverage/Discount</span><span>-${showReceipt.discount.toFixed(2)}</span></div>}
              <div className={styles.receiptTotalRow}><span>Tax / Fees</span><span>${showReceipt.tax.toFixed(2)}</span></div>
              <div className={styles.receiptGrandTotal}><span>PATIENT TOTAL</span><span>${showReceipt.total.toFixed(2)}</span></div>
            </div>
            <div className={styles.receiptFooter}>Wishing you a speedy recovery!<br />Powered by Bohenix AI Health · bohenix.africa</div>
            <div className={styles.receiptActions}>
              <button className={`${styles.receiptBtn} ${styles.receiptBtnPrint}`} onClick={() => window.print()}>
                <Printer size={16} /> Print
              </button>
              <button className={`${styles.receiptBtn} ${styles.receiptBtnClose}`} onClick={() => setShowReceipt(null)}>
                <X size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={styles.terminalMain}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalBrand}>
            <Image src="/bohenixx.png" alt="Logo" width={28} height={28} />
            <h1>BX <span>Medical POS</span></h1>
            <div className={`${styles.statusPill} ${styles.statusOnline}`}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> System Online
            </div>
          </div>
          <div className={styles.terminalActions}>
            <button className={styles.historyToggle} onClick={() => setView("insights")} style={{ color: '#B14CFF', borderColor: 'rgba(177,76,255,0.3)' }}>
              <BrainCircuit size={15} /> AI Insights
            </button>
            <button className={styles.historyToggle} onClick={() => setView("history")}>
              <Clock size={15} /> History ({transactions.length})
            </button>
          </div>
        </div>

        <div className={styles.searchInput}>
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input placeholder="Search medications, services, or ICD-10..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className={styles.categories} style={{ marginTop: "1rem" }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`${styles.catBtn} ${activeCat === c ? styles.catBtnActive : ""}`}
              onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {filtered.map(p => (
            <div key={p.id} className={styles.pCard} onClick={() => addToCart(p)}>
              <div className={styles.pCardIcon}>{p.icon}</div>
              <div className={styles.pCardName}>{p.name}</div>
              <div className={styles.pCardPrice}>${p.price.toFixed(2)}</div>
              {p.stock < 100 && <div className={styles.pCardStock} style={{ color: p.stock < 20 ? '#ef4444' : '#f59e0b' }}>{p.stock} left</div>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              No items match your search.
            </div>
          )}
        </div>
      </div>

      {/* Cart / Patient Billing */}
      <div className={styles.cartPanel}>
        <div className={styles.cartHead}>
          <h2><Activity size={18} /> Patient Billing {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}</h2>
          {cart.length > 0 && <button className={styles.clearBtn} onClick={clearCart}>Clear</button>}
        </div>

        <div className={styles.cartBody}>
          <input 
            className={styles.discountInput} 
            placeholder="Patient Name (Optional)" 
            value={patientName} 
            onChange={e => setPatientName(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingCart size={40} />
              <p>Tap items to add<br />them to the invoice</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.cartItemInfo}>
                <div className={styles.cartItemName}>{item.name}</div>
                <div className={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, -1)}><Minus size={13} /></button>
                <span className={styles.qtyNum}>{item.quantity}</span>
                <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}><Plus size={13} /></button>
              </div>
              <button className={styles.removeBtn} onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <div className={styles.cartFooter}>
          {/* AI Drug Interaction Engine UI */}
          {cart.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={runAiSafetyCheck} 
                disabled={isAiChecking}
                style={{ 
                  width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(177,76,255,0.4)',
                  background: 'rgba(177,76,255,0.1)', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {isAiChecking ? <Loader2 size={16} className="spin" /> : <BrainCircuit size={16} />} 
                {isAiChecking ? "Analyzing Protocols..." : "Run AI Safety Check"}
              </button>
              
              {aiWarning.active && (
                <div style={{ 
                  marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.4,
                  background: aiWarning.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                  border: `1px solid ${aiWarning.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                  color: aiWarning.severity === 'high' ? '#ef4444' : '#22c55e',
                  display: 'flex', alignItems: 'flex-start', gap: '8px'
                }}>
                  {aiWarning.severity === 'high' ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
                  <span>{aiWarning.message}</span>
                </div>
              )}
            </div>
          )}

          <div className={styles.discountRow}>
            <input className={styles.discountInput} placeholder="Insurance / Copay Code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            <button className={styles.discountBtn} onClick={applyDiscount}>Apply</button>
          </div>
          <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {appliedDiscount > 0 && <div className={`${styles.summaryRow} ${styles.discountActive}`}><span>Coverage ({appliedDiscount}%)</span><span>-${discountAmt.toFixed(2)}</span></div>}
          <div className={styles.summaryRow}><span>Tax / Fees</span><span>${tax.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Patient Total</span><span>${total.toFixed(2)}</span></div>

          {/* Payment Method Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                flex: 1, padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                background: paymentMethod === 'card' ? 'rgba(177,76,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${paymentMethod === 'card' ? 'rgba(177,76,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: paymentMethod === 'card' ? '#B14CFF' : 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <CreditCard size={14} /> Card
            </button>
            <button
              onClick={() => setPaymentMethod('mpesa')}
              style={{
                flex: 1, padding: '0.55rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                background: paymentMethod === 'mpesa' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${paymentMethod === 'mpesa' ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: paymentMethod === 'mpesa' ? '#22c55e' : 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Smartphone size={14} /> M-Pesa
            </button>
          </div>

          {paymentMethod === 'mpesa' && (
            <input
              className={styles.discountInput}
              placeholder="Patient Safaricom No. (e.g. 0712345678)"
              value={mpesaPhone}
              onChange={e => setMpesaPhone(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
          )}

          <button
            className={styles.chargeBtn}
            disabled={!cart.length || isCharging || mpesaProcessing}
            onClick={paymentMethod === 'mpesa' ? handleMpesaCharge : handleCharge}
            style={paymentMethod === 'mpesa' ? { background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' } : undefined}
          >
            {isCharging || mpesaProcessing
              ? <Loader2 size={18} className="spin" />
              : paymentMethod === 'mpesa'
                ? <><Smartphone size={18} /> Pay KES {Math.ceil(total * 130).toLocaleString()} via M-Pesa</>
                : <><CreditCard size={18} /> Invoice ${total.toFixed(2)}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function POSPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 className="spin" size={32} color="#B14CFF" /></div>}>
      <POSContent />
    </Suspense>
  );
}
