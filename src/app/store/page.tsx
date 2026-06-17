"use client";

import Image from "next/image";
import styles from "./store.module.css";
import ThreeDPreview from "@/components/ThreeDPreview";

const PRODUCTS = [
  {
    id: "bx-robot-1",
    name: "Bohenix Optimus R1",
    tagline: "The Future of Autonomous Labor",
    price: "$45,000",
    specs: ["Bipedal Movement", "AI Object Recognition", "8-hour Battery"],
    color: "#8B2EFF",
    image: "/bx1.png",
  },
  {
    id: "bx-ev-1",
    name: "Bohenix V-Drive",
    tagline: "Next-Gen Electric Mobility",
    price: "$75,000",
    specs: ["0-60 in 2.9s", "600mi Range", "Level 4 Autonomy"],
    color: "#00E5FF",
  },
  {
    id: "bx-drone-1",
    name: "Bohenix Aero X",
    tagline: "Industrial Heavy-Lift Drone",
    price: "$12,500",
    specs: ["200kg Payload", "Thermal Imaging", "Swarm Coordination"],
    color: "#FF6D00",
  }
];

export default function Store() {
  const handleCheckout = async (productName: string, priceStr: string) => {
    const priceAmount = parseInt(priceStr.replace(/[^0-9]/g, ''));
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: productName, priceAmount, type: 'store' })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error('Checkout failed', error);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>BOHENIX <span className="text-gradient">STORE</span></h1>
        <p>Premium Hardware & Automation Systems</p>
      </header>

      <div className={styles.catalog}>
        {PRODUCTS.map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imagePlaceholder}>
              {product.image ? (
                <div className={styles.productImageContainer}>
                  <Image src={product.image} alt={product.name} fill className={styles.productImage} />
                </div>
              ) : (
                <div className={styles.modelPlaceholder} style={{ borderColor: product.color, boxShadow: `inset 0 0 50px ${product.color}40` }}>
                  <ThreeDPreview color={product.color} type={product.id.includes("ev") ? "ev" : "drone"} />
                </div>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <h2>{product.name}</h2>
              <p className={styles.tagline}>{product.tagline}</p>
              
              <ul className={styles.specs}>
                {product.specs.map(spec => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              
              <div className={styles.footer}>
                <span className={styles.price}>{product.price}</span>
                <button 
                  className={styles.orderBtn} 
                  style={{ backgroundColor: product.color }}
                  onClick={() => handleCheckout(product.name, product.price)}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
