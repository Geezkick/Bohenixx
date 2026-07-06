"use client";

import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./pos.module.css";
import {
  Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package,
  Monitor, Wrench, Smartphone, Zap, BarChart3, Receipt, Clock,
  CheckCircle2, Printer, X, Tag, Shield, Users, Wifi, Loader2, ExternalLink
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

// ─── Types ───
type Category = "All" | "Food & Drink" | "Retail" | "Electronics" | "Services";
interface Product { id: string; name: string; price: number; category: Category; icon: React.ReactNode; stock: number; }
interface CartItem extends Product { quantity: number; }
interface Transaction { id: string; items: CartItem[]; subtotal: number; tax: number; discount: number; total: number; date: Date; method: string; status: "completed" | "pending"; checkoutUrl?: string; }

// ─── Demo Inventory ───
const PRODUCTS: Product[] = [
  { id: "p1", name: "Espresso", price: 3.50, category: "Food & Drink", icon: <Package size={26} />, stock: 999 },
  { id: "p2", name: "Cappuccino", price: 4.50, category: "Food & Drink", icon: <Package size={26} />, stock: 999 },
  { id: "p3", name: "Croissant", price: 3.00, category: "Food & Drink", icon: <Package size={26} />, stock: 50 },
  { id: "p4", name: "Club Sandwich", price: 8.99, category: "Food & Drink", icon: <Package size={26} />, stock: 30 },
  { id: "p5", name: "Fresh Juice", price: 5.50, category: "Food & Drink", icon: <Package size={26} />, stock: 40 },
  { id: "p6", name: "T-Shirt (M)", price: 24.99, category: "Retail", icon: <Tag size={26} />, stock: 120 },
  { id: "p7", name: "Sneakers", price: 89.99, category: "Retail", icon: <Tag size={26} />, stock: 35 },
  { id: "p8", name: "Backpack", price: 49.99, category: "Retail", icon: <Tag size={26} />, stock: 20 },
  { id: "p9", name: "Phone Case", price: 14.99, category: "Electronics", icon: <Smartphone size={26} />, stock: 200 },
  { id: "p10", name: "USB-C Cable", price: 9.99, category: "Electronics", icon: <Monitor size={26} />, stock: 150 },
  { id: "p11", name: "Wireless Earbuds", price: 39.99, category: "Electronics", icon: <Smartphone size={26} />, stock: 60 },
  { id: "p12", name: "Power Bank", price: 29.99, category: "Electronics", icon: <Zap size={26} />, stock: 45 },
  { id: "p13", name: "Haircut", price: 15.00, category: "Services", icon: <Wrench size={26} />, stock: 999 },
  { id: "p14", name: "Car Wash", price: 12.00, category: "Services", icon: <Wrench size={26} />, stock: 999 },
  { id: "p15", name: "Laundry (5kg)", price: 8.00, category: "Services", icon: <Wrench size={26} />, stock: 999 },
];

const CATEGORIES: Category[] = ["All", "Food & Drink", "Retail", "Electronics", "Services"];
const DISCOUNT_CODES: Record<string, number> = { "BOHENIX10": 10, "LAUNCH20": 20, "VIP50": 50 };
const TAX_RATE = 0.16;

// ─── Subscription Plans ───
const PLANS = [
  { name: "Starter", price: 0, period: "Free forever", features: ["Up to 50 products", "Basic POS terminal", "Receipt generation", "1 user account"], popular: false },
  { name: "Business", price: 29, period: "/month", features: ["Unlimited products", "Transaction history", "Discount codes", "Analytics dashboard", "5 user accounts", "Email receipts"], popular: true },
  { name: "Enterprise", price: 79, period: "/month", features: ["Everything in Business", "Multi-location", "API access", "Priority support", "Unlimited users", "Custom branding"], popular: false },
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
  const [showHistory, setShowHistory] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

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
        localStorage.setItem("bx_pos_plan", "Business");
        setSelectedPlan("Business");
      }
      showNotification({ title: "Welcome to BX POS", message: "Your subscription is active. Start selling!", type: "success" });
      router.replace("/dashboard/pos"); // Clean URL
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
  }, []);

  const updateQty = (id: string, d: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const nq = i.quantity + d;
      return nq > 0 ? { ...i, quantity: nq } : i;
    }));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setCart([]); setAppliedDiscount(0); setDiscountCode(""); };

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
      showNotification({ title: "Discount Applied", message: `${pct}% off your order!`, type: "success" });
    } else {
      showNotification({ title: "Invalid Code", message: "That discount code doesn't exist.", type: "error" });
    }
  };

  const handleCharge = async () => {
    if (!cart.length) return;
    setIsCharging(true);
    
    try {
      // Create a real checkout session for the customer
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: `POS Order (${cart.length} items)`,
          priceAmount: total,
          type: 'pos_transaction',
          returnUrl: '/dashboard/pos'
        })
      });
      const data = await res.json();
      
      const txn: Transaction = {
        id: `TXN-${Date.now().toString(36).toUpperCase()}`,
        items: [...cart], subtotal, tax, discount: discountAmt, total,
        date: new Date(), method: "Stripe Checkout", status: "pending",
        checkoutUrl: data.url
      };
      
      setTransactions(prev => [txn, ...prev]);
      setShowReceipt(txn);
      clearCart();
    } catch (err) {
      showNotification({ title: "Payment Error", message: "Failed to generate payment link.", type: "error" });
    } finally {
      setIsCharging(false);
    }
  };

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) {
      localStorage.setItem("bx_pos_plan", plan.name);
      setSelectedPlan(plan.name);
      setIsSubscribed(true);
      showNotification({ title: "Free Plan Activated", message: "Welcome to BX POS Terminal!", type: "success" });
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
        // Fallback for mock mode if stripe is not configured
        localStorage.setItem("bx_pos_plan", plan.name);
        setSelectedPlan(plan.name);
        setIsSubscribed(true);
        showNotification({ title: "Dev Mode: Plan Activated", message: "Stripe key missing. Simulating checkout.", type: "success" });
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
          <div className={styles.gateBadge}><Zap size={14} /> New Product</div>
          <h1 className={styles.gateTitle}>Bohenix POS Terminal</h1>
          <p className={styles.gateSubtitle}>
            A modern, intelligent point-of-sale system built for African businesses.
            Accept payments, manage inventory, generate receipts, and track sales — all from your browser.
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
            { icon: <CreditCard size={24} />, title: "Accept Any Payment", desc: "Generate real Stripe checkout links instantly." },
            { icon: <BarChart3 size={24} />, title: "Real-Time Analytics", desc: "Track sales, revenue, and top products live." },
            { icon: <Shield size={24} />, title: "Secure & Compliant", desc: "PCI-DSS compliant with encrypted transactions." },
            { icon: <Users size={24} />, title: "Multi-User Access", desc: "Add cashiers with role-based permissions." },
            { icon: <Wifi size={24} />, title: "Works Offline", desc: "Transactions sync when connectivity resumes." },
            { icon: <Receipt size={24} />, title: "Digital Receipts", desc: "Print or email branded receipts instantly." },
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
  if (showHistory) {
    return (
      <div className={styles.posContainer} style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Transaction History</h2>
          <button className={styles.historyToggle} onClick={() => setShowHistory(false)}>
            <X size={16} /> Close
          </button>
        </div>
        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "rgba(255,255,255,0.3)" }}>
            <Clock size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p>No transactions yet. Start selling!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {transactions.map(txn => (
              <div key={txn.id} onClick={() => setShowReceipt(txn)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", cursor: "pointer", transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>{txn.id}</div>
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

  // ─── Active POS Terminal ───
  return (
    <div className={styles.terminal}>
      {/* Receipt / Payment Modal */}
      {showReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setShowReceipt(null)}>
          <div className={styles.receipt} onClick={e => e.stopPropagation()}>
            <div className={styles.receiptLogo}>
              <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} style={{ margin: "0 auto 8px" }} />
              <h3>Bohenix POS</h3>
              <p>{user?.name || "Business"} · {selectedPlan} Plan</p>
            </div>
            
            {showReceipt.checkoutUrl && (
              <div style={{ textAlign: 'center', margin: '1rem 0', padding: '1rem', background: 'rgba(177, 76, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(177, 76, 255, 0.3)' }}>
                <p style={{ fontSize: '0.85rem', color: '#B14CFF', fontWeight: 600, marginBottom: '0.5rem' }}>Customer Payment Link Ready</p>
                <a href={showReceipt.checkoutUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#B14CFF', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                  Open Checkout <ExternalLink size={14} />
                </a>
              </div>
            )}
            
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptMeta}><span>Transaction</span><span>{showReceipt.id}</span></div>
            <div className={styles.receiptMeta}><span>Date</span><span>{showReceipt.date.toLocaleDateString()}</span></div>
            <div className={styles.receiptMeta}><span>Time</span><span>{showReceipt.date.toLocaleTimeString()}</span></div>
            <div className={styles.receiptMeta}><span>Cashier</span><span>{user?.name || "Staff"}</span></div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptItems}>
              {showReceipt.items.map(i => (
                <div key={i.id} className={styles.receiptItem}>
                  <span>{i.quantity}x {i.name}</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className={styles.receiptDivider} />
            <div className={styles.receiptTotals}>
              <div className={styles.receiptTotalRow}><span>Subtotal</span><span>${showReceipt.subtotal.toFixed(2)}</span></div>
              {showReceipt.discount > 0 && <div className={styles.receiptTotalRow} style={{ color: "#22c55e" }}><span>Discount</span><span>-${showReceipt.discount.toFixed(2)}</span></div>}
              <div className={styles.receiptTotalRow}><span>Tax (16%)</span><span>${showReceipt.tax.toFixed(2)}</span></div>
              <div className={styles.receiptGrandTotal}><span>TOTAL</span><span>${showReceipt.total.toFixed(2)}</span></div>
            </div>
            <div className={styles.receiptFooter}>Thank you for your purchase!<br />Powered by Bohenix POS · bohenix.africa</div>
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
            <h1>BX <span>POS</span></h1>
            <div className={`${styles.statusPill} ${styles.statusOnline}`}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} /> Online
            </div>
          </div>
          <div className={styles.terminalActions}>
            <button className={styles.historyToggle} onClick={() => setShowHistory(true)}>
              <Clock size={15} /> History ({transactions.length})
            </button>
          </div>
        </div>

        <div className={styles.searchInput}>
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
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
              {p.stock < 100 && <div className={styles.pCardStock}>{p.stock} left</div>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              No products match your search.
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className={styles.cartPanel}>
        <div className={styles.cartHead}>
          <h2><ShoppingCart size={18} /> Order {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}</h2>
          {cart.length > 0 && <button className={styles.clearBtn} onClick={clearCart}>Clear</button>}
        </div>

        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingCart size={40} />
              <p>Tap items to add<br />them to the order</p>
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
          <div className={styles.discountRow}>
            <input className={styles.discountInput} placeholder="Discount code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            <button className={styles.discountBtn} onClick={applyDiscount}>Apply</button>
          </div>
          <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {appliedDiscount > 0 && <div className={`${styles.summaryRow} ${styles.discountActive}`}><span>Discount ({appliedDiscount}%)</span><span>-${discountAmt.toFixed(2)}</span></div>}
          <div className={styles.summaryRow}><span>Tax (16%)</span><span>${tax.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className={styles.chargeBtn} disabled={!cart.length || isCharging} onClick={handleCharge}>
            {isCharging ? <Loader2 size={18} className="spin" /> : <><CreditCard size={18} /> Charge ${total.toFixed(2)}</>}
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
