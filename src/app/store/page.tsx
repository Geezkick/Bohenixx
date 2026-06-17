import Image from "next/image";
import styles from "./store.module.css";

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
                  <span className={styles.modelIcon}>📦</span>
                  <p>Interactive 3D Preview Available Soon</p>
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
                <button className={styles.orderBtn} style={{ backgroundColor: product.color }}>Order Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
