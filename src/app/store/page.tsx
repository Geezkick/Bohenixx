"use client";

import Image from "next/image";
import styles from "./store.module.css";
import NativeHeader from "@/components/NativeHeader";

const PRODUCTS = [
  {
    id: "bx-concept-1",
    name: "BX Concept Car 1",
    tagline: "Next-Gen Electric Concept Vehicle",
    price: "$85,000",
    specs: ["0-60 in 2.9s", "600mi Range", "Level 4 Autonomy"],
    color: "#00E5FF",
    image: "/bx_concept_1.png",
  },
  {
    id: "bx-charging-1",
    name: "BX Charging Concept 1",
    tagline: "Intelligent Charging Infrastructure",
    price: "$12,500",
    specs: ["150kW Output", "Smart Grid", "Solar Integration"],
    color: "#76FF03",
    image: "/bx_charging_1.png",
  },
  {
    id: "bx-humanoid-1",
    name: "BX-1 Humanoid",
    tagline: "Autonomous General-Purpose Robot",
    price: "$125,000",
    specs: ["Full Dexterity", "AI Vision", "72hr Battery"],
    color: "#B14CFF",
    image: "/bx1.png",
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
