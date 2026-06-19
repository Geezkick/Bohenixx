"use client";

import Image from "next/image";
import styles from "./store.module.css";
import NativeHeader from "@/components/NativeHeader";

const PRODUCTS = [
  {
    id: "bx-ev-1",
    name: "Bohenix V-Drive",
    tagline: "Next-Gen Electric Mobility",
    price: "$75,000",
    specs: ["0-60 in 2.9s", "600mi Range", "Level 4 Autonomy"],
    color: "#00E5FF",
    image: "/bx_ev_1.png",
  },
  {
    id: "bx-drone-1",
    name: "Bohenix Aero X",
    tagline: "Industrial Heavy-Lift Drone",
    price: "$12,500",
    specs: ["200kg Payload", "Thermal Imaging", "Swarm Coordination"],
    color: "#FF6D00",
    image: "/bx_drone_1.png",
  },
];

export default function StorePage() {
  return (
    <>
      <NativeHeader title="Store" />
      <div className={styles.screen}>
        {PRODUCTS.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageWrap}>
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={360}
                  height={220}
                  className={styles.productImage}
                />
              )}
            </div>

            <div className={styles.productInfo}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productTagline}>{product.tagline}</p>

              <div className={styles.specsList}>
                {product.specs.map((spec) => (
                  <span key={spec} className={styles.specBadge}>{spec}</span>
                ))}
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>{product.price}</span>
                <button
                  className={styles.orderBtn}
                  style={{ background: product.color }}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
