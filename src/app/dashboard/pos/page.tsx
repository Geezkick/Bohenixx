"use client";

import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./pos.module.css";
import {
  Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package,
  BarChart3, Receipt, Clock, CheckCircle2, Printer, X, Shield, Users, 
  Wifi, Loader2, ExternalLink, Activity, Pill, Stethoscope, AlertTriangle, Lightbulb, BrainCircuit, HeartPulse, Smartphone,
  MonitorSmartphone, Watch, Shirt, Coffee, Utensils, CalendarClock, Laptop, BookOpen, Edit3, Tag
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

// ─── Types ───
type BusinessMode = string;
interface Product { id: string; name: string; price: number; category: string; icon: React.ReactNode; stock: number; interactsWith?: string[]; atcCode?: string; isCustom?: boolean; }
interface CartItem extends Product { quantity: number; }
interface Transaction { id: string; items: CartItem[]; subtotal: number; tax: number; discount: number; total: number; date: Date; method: string; status: "completed" | "pending"; checkoutUrl?: string; clientName?: string; }

// ─── Dynamic Data Sets ───
const MEDICAL_CATEGORIES = ["All", "Pharmacy (Rx)", "OTC Meds", "Consultations", "Lab Tests", "Medical Devices"];
const MEDICAL_PRODUCTS: Product[] = [
  { id: "rx1", name: "Amoxicillin 500mg", price: 12.50, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 350, atcCode: "J01CA04" },
  { id: "rx2", name: "Lisinopril 10mg", price: 8.99, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 120, atcCode: "C09AA03" },
  { id: "rx3", name: "Warfarin 5mg", price: 15.00, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 80, interactsWith: ["otc1", "rx4"] },
  { id: "rx4", name: "Aspirin 81mg (Rx)", price: 5.50, category: "Pharmacy (Rx)", icon: <Pill size={26} />, stock: 500, interactsWith: ["rx3", "otc1"] },
  { id: "otc1", name: "Ibuprofen 400mg", price: 6.99, category: "OTC Meds", icon: <Package size={26} />, stock: 800, interactsWith: ["rx3", "rx4"] },
  { id: "otc2", name: "Paracetamol 500mg", price: 4.50, category: "OTC Meds", icon: <Package size={26} />, stock: 45 },
  { id: "c1", name: "General Consultation", price: 50.00, category: "Consultations", icon: <Stethoscope size={26} />, stock: 999 },
  { id: "t1", name: "Comprehensive Blood Panel", price: 85.00, category: "Lab Tests", icon: <Activity size={26} />, stock: 999 },
  { id: "d1", name: "Digital Thermometer", price: 14.99, category: "Medical Devices", icon: <HeartPulse size={26} />, stock: 60 },
];

const RETAIL_CATEGORIES = ["All", "Electronics", "Apparel", "Home Goods", "Accessories"];
const RETAIL_PRODUCTS: Product[] = [
  { id: "rt1", name: "Wireless Earbuds Pro", price: 129.99, category: "Electronics", icon: <MonitorSmartphone size={26} />, stock: 45 },
  { id: "rt2", name: "Smart Watch Series X", price: 299.00, category: "Electronics", icon: <Watch size={26} />, stock: 12 },
  { id: "rt3", name: "Cotton Crew T-Shirt (M)", price: 24.50, category: "Apparel", icon: <Shirt size={26} />, stock: 120 },
  { id: "rt4", name: "Denim Jacket", price: 89.99, category: "Apparel", icon: <Shirt size={26} />, stock: 8 },
  { id: "rt5", name: "Leather Wallet", price: 45.00, category: "Accessories", icon: <Tag size={26} />, stock: 35 },
  { id: "rt6", name: "Polarized Sunglasses", price: 65.00, category: "Accessories", icon: <Tag size={26} />, stock: 15 },
];

const RESTAURANT_CATEGORIES = ["All", "Mains", "Starters", "Beverages", "Desserts"];
const RESTAURANT_PRODUCTS: Product[] = [
  { id: "rs1", name: "Wagyu Beef Burger", price: 18.50, category: "Mains", icon: <Utensils size={26} />, stock: 999 },
  { id: "rs2", name: "Truffle Fries", price: 8.00, category: "Starters", icon: <Utensils size={26} />, stock: 999 },
  { id: "rs3", name: "Margherita Pizza", price: 15.00, category: "Mains", icon: <Utensils size={26} />, stock: 999 },
  { id: "rs4", name: "Caesar Salad", price: 12.00, category: "Starters", icon: <Utensils size={26} />, stock: 999 },
  { id: "rs5", name: "Artisan Latte", price: 4.50, category: "Beverages", icon: <Coffee size={26} />, stock: 999 },
  { id: "rs6", name: "Iced Matcha", price: 5.50, category: "Beverages", icon: <Coffee size={26} />, stock: 999 },
];

const SERVICE_CATEGORIES = ["All", "Consulting", "Repairs", "Design", "Workshops"];
const SERVICE_PRODUCTS: Product[] = [
  { id: "sv1", name: "1Hr Strategy Call", price: 150.00, category: "Consulting", icon: <CalendarClock size={26} />, stock: 999 },
  { id: "sv2", name: "Business Audit", price: 500.00, category: "Consulting", icon: <BookOpen size={26} />, stock: 999 },
  { id: "sv3", name: "PC Diagnostic", price: 45.00, category: "Repairs", icon: <Laptop size={26} />, stock: 999 },
  { id: "sv4", name: "Screen Replacement", price: 120.00, category: "Repairs", icon: <Laptop size={26} />, stock: 999 },
  { id: "sv5", name: "Logo Design Concept", price: 250.00, category: "Design", icon: <Edit3 size={26} />, stock: 999 },
];

const DISCOUNT_CODES: Record<string, number> = { "PROMO10": 10, "VIP20": 20, "EMPLOYEE50": 50 };
const TAX_RATE = 0.08;

const PLANS = [
  { name: "Starter POS", price: 0, period: "Free forever", features: ["Up to 50 items", "Basic billing", "Receipt generation", "1 staff account"], popular: false },
  { name: "Pro System", price: 89, period: "/month", features: ["Unlimited inventory", "AI Business Insights", "Integrations", "Predictive analytics", "5 staff accounts", "CRM sync"], popular: true },
  { name: "Enterprise Hub", price: 299, period: "/month", features: ["Everything in Pro", "Multi-branch synchronization", "Full API access", "24/7 dedicated support", "Unlimited staff", "Custom AI models"], popular: false },
];

function POSContent() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode state
  const [mode, setMode] = useState<BusinessMode>("Medical");

  useEffect(() => {
    const savedMode = localStorage.getItem("bx_pos_mode") as BusinessMode;
    if (savedMode) setMode(savedMode);
  }, []);

  const config = useMemo(() => {
    switch(mode) {
      case "Retail": return { title: "Retail", subtitle: "Next-gen retail terminal with predictive inventory.", cat: RETAIL_CATEGORIES, prod: RETAIL_PRODUCTS, clientLabel: "Customer Details", aiBtn: "AI Upsell Analysis", icon: <ShoppingCart size={16} /> };
      case "Restaurant": return { title: "Restaurant", subtitle: "High-speed kitchen and table management terminal.", cat: RESTAURANT_CATEGORIES, prod: RESTAURANT_PRODUCTS, clientLabel: "Table Number", aiBtn: "AI Combo Analysis", icon: <Utensils size={16} /> };
      case "Service": return { title: "Service", subtitle: "Booking and billing terminal for professionals.", cat: SERVICE_CATEGORIES, prod: SERVICE_PRODUCTS, clientLabel: "Client Name", aiBtn: "AI Schedule Optimizer", icon: <CalendarClock size={16} /> };
      case "Medical": return { title: "Medical", subtitle: "Advanced healthcare point-of-sale with clinical AI.", cat: MEDICAL_CATEGORIES, prod: MEDICAL_PRODUCTS, clientLabel: "Patient Name", aiBtn: "Run AI Safety Check", icon: <BrainCircuit size={16} /> };
      default: return { title: mode || "Custom", subtitle: "AI-powered generalized point-of-sale terminal.", cat: ["All", "Products", "Services", "Miscellaneous"], prod: [], clientLabel: "Client / Customer Name", aiBtn: "Run AI Optimization", icon: <Activity size={16} /> };
    }
  }, [mode]);

  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Terminal state
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showReceipt, setShowReceipt] = useState<Transaction | null>(null);
  
  // Dashboard Views
  const [view, setView] = useState<"terminal" | "history" | "insights">("terminal");
  
  const [isCharging, setIsCharging] = useState(false);
  const [clientName, setClientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaProcessing, setMpesaProcessing] = useState(false);
  
  // AI State
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiWarning, setAiWarning] = useState<{ active: boolean; message: string; severity: 'high' | 'medium' }>({ active: false, message: "", severity: 'medium' });

  // Custom Item State
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");

  // Hydrate subscription state
  useEffect(() => {
    const savedPlan = localStorage.getItem("bx_pos_plan");
    if (savedPlan) {
      setSelectedPlan(savedPlan);
      setIsSubscribed(true);
    }
    
    if (searchParams.get("success") === "true") {
      setIsSubscribed(true);
      if (!savedPlan) {
        localStorage.setItem("bx_pos_plan", "Pro System");
        setSelectedPlan("Pro System");
      }
      showNotification({ title: "Welcome to BX POS", message: "Your terminal is active.", type: "success" });
      router.replace("/dashboard/pos");
    }
  }, [searchParams, router, showNotification]);

  // Handle activeCat reset if changing mode
  useEffect(() => {
    setActiveCat("All");
    setCart([]);
    setAiWarning({ active: false, message: "", severity: 'medium' });
  }, [mode]);

  const filtered = useMemo(() => config.prod.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "All" || p.category === activeCat;
    return matchSearch && matchCat;
  }), [search, activeCat, config.prod]);

  const addToCart = useCallback((p: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...p, quantity: 1 }];
    });
    setAiWarning({ active: false, message: "", severity: 'medium' });
  }, []);

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice || isNaN(parseFloat(customItemPrice))) {
      showNotification({ title: "Invalid Item", message: "Please provide a valid name and price.", type: "error" });
      return;
    }
    const price = parseFloat(customItemPrice);
    const p: Product = {
      id: `custom_${Date.now()}`,
      name: customItemName,
      price: price,
      category: "Custom",
      icon: <Tag size={26} />,
      stock: 999,
      isCustom: true
    };
    addToCart(p);
    setShowCustomItem(false);
    setCustomItemName("");
    setCustomItemPrice("");
  };

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
    setCart([]); setAppliedDiscount(0); setDiscountCode(""); setClientName(""); setAiWarning({ active: false, message: "", severity: 'medium' }); 
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
      showNotification({ title: "Discount Applied", message: `${pct}% removed!`, type: "success" });
    } else {
      showNotification({ title: "Invalid Code", message: "That promo code doesn't exist.", type: "error" });
    }
  };

  const runAiCheck = () => {
    if (cart.length === 0) {
      showNotification({ title: "AI Engine", message: "Add items to cart to run AI analysis.", type: "success" });
      return;
    }
    
    setIsAiChecking(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAiChecking(false);
      
      if (mode === "Medical") {
        let interactionFound = false;
        for (const item of cart) {
          if (item.interactsWith) {
            const conflictingItem = cart.find(cartItem => item.interactsWith?.includes(cartItem.id));
            if (conflictingItem) {
              interactionFound = true;
              setAiWarning({
                active: true,
                severity: 'high',
                message: `AI Safety Alert: Severe interaction detected between ${item.name} and ${conflictingItem.name}.`
              });
              break;
            }
          }
        }
        if (!interactionFound) {
          setAiWarning({
            active: true, severity: 'medium', message: `AI Safety Check complete: No known adverse interactions detected.`
          });
        }
      } else if (mode === "Retail") {
        setAiWarning({ active: true, severity: 'medium', message: "AI Upsell: Customers buying these items often purchase an extended warranty." });
      } else if (mode === "Restaurant") {
        setAiWarning({ active: true, severity: 'medium', message: "AI Insights: Suggesting a seasonal beverage pairs well with this order." });
      } else if (mode === "Service") {
        setAiWarning({ active: true, severity: 'medium', message: "AI Optimizer: This service requires 1h 30m. Next available slot is perfectly aligned." });
      } else {
        setAiWarning({ active: true, severity: 'medium', message: `AI Analyzer: Transaction patterns show high conversion rates for ${mode} businesses when offering loyalty discounts at this cart value.` });
      }
    }, 1200);
  };

  const handleCharge = async () => {
    if (!cart.length) return;
    setIsCharging(true);
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: `${mode} Billing (${cart.length} items)`,
          priceAmount: total,
          type: 'pos_transaction',
          returnUrl: '/dashboard/pos'
        })
      });
      const data = await res.json();
      
      const txn: Transaction = {
        id: `TXN-${Date.now().toString(36).toUpperCase()}`,
        items: [...cart], subtotal, tax, discount: discountAmt, total,
        date: new Date(), method: "Card", status: "pending",
        checkoutUrl: data.url,
        clientName: clientName || "Guest"
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
          description: `Billing (${cart.length} items)`,
        })
      });
      const data = await res.json();
      
      const txn: Transaction = {
        id: `MPESA-${Date.now().toString(36).toUpperCase()}`,
        items: [...cart], subtotal, tax, discount: discountAmt, total,
        date: new Date(), method: `M-Pesa (${mpesaPhone})`, status: data.success ? "completed" : "pending",
        clientName: clientName || "Guest"
      };
      
      setTransactions(prev => [txn, ...prev]);
      setShowReceipt(txn);
      clearCart();
      setMpesaPhone("");
      showNotification({ title: "M-Pesa STK Push Sent", message: data.message || "Check the phone to complete payment.", type: "success" });
    } catch (err) {
      showNotification({ title: "M-Pesa Error", message: "Failed to initiate STK push.", type: "error" });
    } finally {
      setMpesaProcessing(false);
    }
  };

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) {
      localStorage.setItem("bx_pos_plan", plan.name);
      setSelectedPlan(plan.name);
      setIsSubscribed(true);
      showNotification({ title: "Free Plan Activated", message: "Welcome to BX POS!", type: "success" });
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
        localStorage.setItem("bx_pos_plan", plan.name);
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
          <div className={styles.gateBadge}><BrainCircuit size={14} /> Multi-Industry AI POS</div>
          <h1 className={styles.gateTitle}>Bohenix {mode} POS</h1>
          <p className={styles.gateSubtitle}>
            {config.subtitle} Fully customizable point-of-sale system powered by advanced AI insights and seamless billing features.
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
            { icon: <Shield size={24} />, title: "AI Insights", desc: "Context-aware analytics tailored to your industry." },
            { icon: <BarChart3 size={24} />, title: "Predictive Inventory", desc: "AI forecasts stock depletion based on sales velocity." },
            { icon: <CreditCard size={24} />, title: "Multi-Payment", desc: "Process Cards, Cash, and M-Pesa natively." },
            { icon: <Users size={24} />, title: "Staff Profiles", desc: "Track sales and performance by employee." },
            { icon: <Wifi size={24} />, title: "Works Offline", desc: "Critical business operations continue without internet." },
            { icon: <Receipt size={24} />, title: "Custom Receipts", desc: "Print customizable branded receipts." },
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
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Transaction History</h2>
          <button className={styles.historyToggle} onClick={() => setView("terminal")}>
            <X size={16} /> Close
          </button>
        </div>
        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>
            <Clock size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {transactions.map(txn => (
              <div key={txn.id} onClick={() => { setShowReceipt(txn); setView("terminal"); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", cursor: "pointer", transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{txn.id} <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: "10px" }}>{txn.clientName}</span></div>
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
            <BrainCircuit color="#B14CFF" /> {config.title} AI Insights
          </h2>
          <button className={styles.historyToggle} onClick={() => setView("terminal")}>
            <X size={16} /> Close
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Forecasting
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Based on recent trends, specific inventory items in the <strong>{config.cat[1]}</strong> category are depleting 42% faster than last month. AI suggests increasing safety stock levels.
            </p>
            <button style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              Auto-Reorder
            </button>
          </div>

          <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ color: '#00E5FF', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} /> Revenue Optimization
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Traffic peaks on weekends. AI recommends enabling an automated discount code (<strong>WEEKEND_DEAL</strong>) to drive volume during off-peak hours.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>Generated Code: WEEKEND_DEAL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active POS Terminal ───
  return (
    <div className={styles.terminal}>
      {/* Receipt Modal */}
      {showReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setShowReceipt(null)}>
          <div className={styles.receipt} onClick={e => e.stopPropagation()}>
            <div className={styles.receiptLogo}>
              <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} style={{ margin: "0 auto 8px" }} />
              <h3>Bohenix {config.title}</h3>
              <p>{user?.name || "Staff"} · {selectedPlan}</p>
            </div>
            
            {showReceipt.checkoutUrl && (
              <div style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem', background: 'rgba(177, 76, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(177, 76, 255, 0.3)' }}>
                <p style={{ fontSize: '0.85rem', color: '#B14CFF', fontWeight: 600, marginBottom: '0.5rem' }}>Payment Link Ready</p>
                <a href={showReceipt.checkoutUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#B14CFF', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                  Open Checkout <ExternalLink size={14} />
                </a>
              </div>
            )}
            
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptMeta}><span>{config.clientLabel}</span><span>{showReceipt.clientName}</span></div>
            <div className={styles.receiptMeta}><span>Invoice ID</span><span>{showReceipt.id}</span></div>
            <div className={styles.receiptMeta}><span>Date</span><span>{showReceipt.date.toLocaleDateString()} {showReceipt.date.toLocaleTimeString()}</span></div>
            <div className={styles.receiptMeta}><span>Attending</span><span>{user?.name || "Staff"}</span></div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptItems}>
              {showReceipt.items.map(i => (
                <div key={i.id} className={styles.receiptItem}>
                  <div>
                    <span>{i.quantity}x {i.name}</span>
                    {i.atcCode && <div style={{ fontSize: '10px', color: '#888' }}>Code: {i.atcCode}</div>}
                  </div>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptTotals}>
              <div className={styles.receiptTotalRow}><span>Subtotal</span><span>${showReceipt.subtotal.toFixed(2)}</span></div>
              {showReceipt.discount > 0 && <div className={styles.receiptTotalRow} style={{ color: "#22c55e" }}><span>Discount</span><span>-${showReceipt.discount.toFixed(2)}</span></div>}
              <div className={styles.receiptTotalRow}><span>Tax / Fees</span><span>${showReceipt.tax.toFixed(2)}</span></div>
              <div className={styles.receiptGrandTotal}><span>TOTAL</span><span>${showReceipt.total.toFixed(2)}</span></div>
            </div>
            <div className={styles.receiptFooter}>Thank you for your business!<br />Powered by Bohenix POS · bohenix.africa</div>
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

      {/* Custom Item Modal */}
      {showCustomItem && (
        <div className={styles.receiptOverlay} onClick={() => setShowCustomItem(false)}>
          <div className={styles.receipt} onClick={e => e.stopPropagation()} style={{ background: '#111', color: '#fff' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={20} color="#B14CFF"/> Add Custom Item</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Item Name</label>
              <input 
                type="text" 
                value={customItemName} 
                onChange={e => setCustomItemName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                placeholder="e.g. Special Request"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>Price ($)</label>
              <input 
                type="number" 
                value={customItemPrice} 
                onChange={e => setCustomItemPrice(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                placeholder="0.00"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowCustomItem(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addCustomItem} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#B14CFF', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={styles.terminalMain}>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalBrand}>
            <Image src="/bohenixx.png" alt="Logo" width={28} height={28} />
            <h1>BX <span>{config.title}</span></h1>
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
          <input placeholder="Search inventory or barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className={styles.categories} style={{ marginTop: "1rem" }}>
          {config.cat.map(c => (
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

      {/* Cart / Billing */}
      <div className={styles.cartPanel}>
        <div className={styles.cartHead}>
          <h2><Activity size={18} /> Checkout {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className={styles.clearBtn} onClick={() => setShowCustomItem(true)} style={{ color: '#00E5FF' }}><Plus size={14}/> Custom</button>
            {cart.length > 0 && <button className={styles.clearBtn} onClick={clearCart}>Clear</button>}
          </div>
        </div>

        <div className={styles.cartBody}>
          <input 
            className={styles.discountInput} 
            placeholder={config.clientLabel}
            value={clientName} 
            onChange={e => setClientName(e.target.value)}
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
          {/* AI Feature Engine */}
          {cart.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={runAiCheck} 
                disabled={isAiChecking}
                style={{ 
                  width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(177,76,255,0.4)',
                  background: 'rgba(177,76,255,0.1)', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {isAiChecking ? <Loader2 size={16} className="spin" /> : config.icon} 
                {isAiChecking ? "Processing..." : config.aiBtn}
              </button>
              
              {aiWarning.active && (
                <div style={{ 
                  marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.4,
                  background: aiWarning.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                  border: `1px solid ${aiWarning.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                  color: aiWarning.severity === 'high' ? '#ef4444' : '#22c55e',
                  display: 'flex', alignItems: 'flex-start', gap: '8px'
                }}>
                  {aiWarning.severity === 'high' ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> : <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
                  <span>{aiWarning.message}</span>
                </div>
              )}
            </div>
          )}

          <div className={styles.discountRow}>
            <input className={styles.discountInput} placeholder="Promo / Discount Code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            <button className={styles.discountBtn} onClick={applyDiscount}>Apply</button>
          </div>
          <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {appliedDiscount > 0 && <div className={`${styles.summaryRow} ${styles.discountActive}`}><span>Discount ({appliedDiscount}%)</span><span>-${discountAmt.toFixed(2)}</span></div>}
          <div className={styles.summaryRow}><span>Tax / Fees</span><span>${tax.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>

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
              placeholder="Safaricom No. (e.g. 0712345678)"
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
                : <><CreditCard size={18} /> Charge ${total.toFixed(2)}</>
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
