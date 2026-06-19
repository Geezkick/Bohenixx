import Image from "next/image";
import Link from "next/link";
import styles from "./app.module.css";
import NativeHeader from "@/components/NativeHeader";

const appData: Record<string, any> = {
  safura: { name: "Safura Health", icon: "safura.png", color: "#00E5FF", desc: "AI Health & Wellness platform." },
  njiasafe: { name: "NjiaSafe", icon: "njiasafee.png", color: "#00C853", desc: "Smart Road Safety intelligence." },
  mboka: { name: "Mboka", icon: "mboka.png", color: "#FF6D00", desc: "Digital Marketplace for skilled workers." },
  fixxo: { name: "Fixxo", icon: "fixxo.png", color: "#2979FF", desc: "Premium Repair & Maintenance." },
  vuna: { name: "Vuna", icon: "vuna.png", color: "#76FF03", desc: "AgriTech Intelligence & Supply Chain." },
};

export default function AppDashboard({ params }: { params: { appId: string } }) {
  const data = appData[params.appId.toLowerCase()];

  if (!data) {
    return (
      <div className={styles.notFound}>
        <h1>App Not Found</h1>
        <Link href="/">Return Home</Link>
      </div>
    );
  }

  return (
    <>
      <NativeHeader title={data.name} />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.appTitle}>
          <Image src={`/${data.icon}`} alt={data.name} width={48} height={48} className={styles.icon} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.desc}</p>
          </div>
        </div>
        <div className={styles.healthStatus}>
          <span className={styles.statusDot} style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}></span>
          System Online
        </div>
      </header>

      <section className={styles.dashboardGrid}>
        <div className={`${styles.card} glass-panel`}>
          <h3>Active Sessions</h3>
          <p className={styles.metric}>2,304</p>
        </div>
        <div className={`${styles.card} glass-panel`}>
          <h3>Bandwidth Usage</h3>
          <p className={styles.metric}>45.2 GB/s</p>
        </div>
        <div className={`${styles.card} glass-panel`}>
          <h3>Latency</h3>
          <p className={styles.metric}>12 ms</p>
        </div>
      </section>

      <section className={styles.contentArea}>
        <div className={`${styles.activityFeed} glass-panel`}>
          <h3>Recent Activity</h3>
          <ul className={styles.feedList}>
            <li>User ID #892 logged in.</li>
            <li>Telemetry sync completed successfully.</li>
            <li>New system update applied.</li>
            <li>Anomaly detected and resolved.</li>
          </ul>
        </div>
        
        <div className={`${styles.actions} glass-panel`}>
          <h3>Quick Actions</h3>
          <button className={styles.actionBtn}>Manage Users</button>
          <button className={styles.actionBtn}>View Reports</button>
          <button className={styles.actionBtn}>System Settings</button>
        </div>
      </section>
    </main>
    </>
  );
}
