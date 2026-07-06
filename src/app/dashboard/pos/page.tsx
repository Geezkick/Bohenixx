"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import styles from "./pos.module.css";
import {
  Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Package,
  Monitor, Wrench, Smartphone, Zap, BarChart3, Receipt, Clock,
  CheckCircle2, Printer, X, Tag, Shield, Users, Wifi
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

// ─── Types ───
type Category = "All" | "Food & Drink" | "Retail" | "Electronics" | "Services";
interface Product { id: string; name: string; price: number; category: Category; icon: React.ReactNode; stock: number; }
interface CartItem extends Product { quantity: number; }
interface Transaction { id: string; items: CartItem[]; subtotal: number; tax: number; discount: number; total: number; date: Date; method: string; }

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

export default function POSPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Subscription state — default to active for demo
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  // Terminal state
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showReceipt, setShowReceipt] = useState<Transaction | null>(null);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleCharge = () => {
    if (!cart.length) return;
    const txn: Transaction = {
      id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart], subtotal, tax, discount: discountAmt, total,
      date: new Date(), method: "Card"
    };
    setTransactions(prev => [txn, ...prev]);
    setShowReceipt(txn);
    showNotification({ title: "Payment Successful", message: `$${total.toFixed(2)} charged successfully`, type: "success" });
    clearCart();
  };

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setIsSubscribed(true);
    showNotification({ title: "Plan Activated", message: `${plan} plan is now active. Welcome to BX POS!`, type: "success" });
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
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.price === 0 ? "Start Free" : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.featuresGrid}>
          {[
            { icon: <CreditCard size={24} />, title: "Accept Any Payment", desc: "Cards, M-Pesa, cash, and NFC contactless." },
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
      {/* Receipt Modal */}
      {showReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setShowReceipt(null)}>
          <div className={styles.receipt} onClick={e => e.stopPropagation()}>
            <div className={styles.receiptLogo}>
              <Image src="/bohenixx.png" alt="Bohenix" width={32} height={32} style={{ margin: "0 auto 8px" }} />
              <h3>Bohenix POS</h3>
              <p>{user?.name || "Business"} · {selectedPlan} Plan</p>
            </div>
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
          <button className={styles.chargeBtn} disabled={!cart.length} onClick={handleCharge}>
            <CreditCard size={18} /> Charge ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
