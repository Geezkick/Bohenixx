import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import LaunchSequence from "@/components/LaunchSequence";
import LiveTelemetry from "@/components/LiveTelemetry";
import ActivityFeed from "@/components/ActivityFeed";
import {
  CodeIcon, BrainIcon, CloudIcon, PaletteIcon, ShieldIcon, ChartIcon,
  SignalIcon, CpuIcon, ZapIcon,
} from "@/components/Icons";

const ecosystemApps = [
  { name: "NjiaSafe", icon: "njiasafee.png", tagline: "Smart Road Safety", color: "#00C853", url: "https://njiasafe.six.vercel.app" },
  { name: "Mboka", icon: "mboka.png", tagline: "Digital Marketplace", color: "#FF6D00", url: "https://mboka.vercel.app" },
  { name: "Fixxo", icon: "fixxo.png", tagline: "Repair & Maintenance", color: "#2979FF", url: "https://fixxo.vercel.app" },
  { name: "Vuna", icon: "vuna.png", tagline: "AgriTech Intelligence", color: "#76FF03", url: "https://vunashorts.vercel.app" },
  { name: "Safura", icon: "safura.png", tagline: "AI Health & Wellness", color: "#00E5FF", url: "https://safura-ai.vercel.app" },
];

const services = [
  {
    title: "Software Development",
    description: "Custom enterprise applications, mobile apps, and cloud-native solutions built with cutting-edge technology.",
    IconComponent: CodeIcon,
    price: "From KES 150,000",
  },
  {
    title: "AI & Machine Learning",
    description: "Intelligent automation, predictive analytics, and computer vision solutions for your business.",
    IconComponent: BrainIcon,
    price: "Custom Quote",
  },
  {
    title: "Cloud Infrastructure",
    description: "Scalable, secure cloud architecture design, migration, and managed services.",
    IconComponent: CloudIcon,
    price: "From KES 50,000/mo",
  },
  {
    title: "UI/UX Design",
    description: "Premium interface design, brand identity systems, and user experience consulting.",
    IconComponent: PaletteIcon,
    price: "From KES 80,000",
  },
  {
    title: "Cybersecurity",
    description: "Penetration testing, security audits, compliance frameworks, and threat monitoring.",
    IconComponent: ShieldIcon,
    price: "From KES 120,000",
  },
  {
    title: "Consulting & Strategy",
    description: "Digital transformation roadmaps, technology advisory, and innovation workshops.",
    IconComponent: ChartIcon,
    price: "From KES 75,000",
  },
];

const comingSoon = [
  { title: "IoT Telemetry", description: "Connected device monitoring & analytics", IconComponent: SignalIcon },
  { title: "Robotics Platform", description: "Autonomous systems management", IconComponent: CpuIcon },
  { title: "Energy Grid", description: "Smart energy distribution & monitoring", IconComponent: ZapIcon },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <LaunchSequence />
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <Image src="/bohenixx.png" alt="Bohenix Logo" width={36} height={36} className={styles.logo} />
          <span className={styles.brandName}>BOHENIX</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#apps" className={styles.navLink}>Apps</a>
          <a href="#services" className={styles.navLink}>Services</a>
          <a href="#coming-soon" className={styles.navLink}>Labs</a>
        </div>
        <button className={styles.contactBtn}>Get In Touch</button>
      </nav>

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot}></span>
          Powering the future of technology
        </div>
        <h1 className={styles.title}>
          One Platform.<br />
          <span className="text-gradient">Infinite Possibilities.</span>
        </h1>
        <p className={styles.subtitle}>
          Bohenix Technologies builds world-class digital products and delivers
          premium technology services across Africa and beyond.
        </p>
        <div className={styles.heroCta}>
          <a href="#apps" className={styles.primaryAction}>Explore Ecosystem</a>
          <a href="#services" className={styles.secondaryAction}>Our Services →</a>
        </div>

        {/* Live Telemetry & Feed */}
        <div className={styles.dashboardContainer}>
          <LiveTelemetry />
          <ActivityFeed />
        </div>
      </header>

      {/* Ecosystem Apps */}
      <section id="apps" className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>ECOSYSTEM</p>
          <h2 className={styles.sectionTitle}>Our Products</h2>
          <p className={styles.sectionSubtitle}>
            A unified suite of intelligent applications designed to solve real-world problems.
          </p>
        </div>
        <div className={styles.ecosystemGrid}>
          {ecosystemApps.map((app) => (
            <Link href={app.url} target="_blank" rel="noopener noreferrer" key={app.name} className={`${styles.appCard} glass-panel`}>
              <div className={styles.appIconContainer} style={{ boxShadow: `0 0 20px ${app.color}20` }}>
                <Image src={`/${app.icon}`} alt={`${app.name} Logo`} width={56} height={56} className={styles.appIcon} />
              </div>
              <div className={styles.appHeader}>
                <h3 className={styles.appName}>{app.name}</h3>
                <span className={styles.healthDot} style={{ backgroundColor: app.color, boxShadow: `0 0 8px ${app.color}` }}></span>
              </div>
              <p className={styles.appTagline}>{app.tagline}</p>
              <div className={styles.launchBtn} style={{ borderColor: `${app.color}40`, color: app.color }}>
                Launch App
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>SERVICES</p>
          <h2 className={styles.sectionTitle}>What We Build</h2>
          <p className={styles.sectionSubtitle}>
            Enterprise-grade technology solutions tailored for businesses of every scale.
          </p>
        </div>
        <div className={styles.servicesGrid}>
          {services.map((svc) => (
            <div key={svc.title} className={`${styles.serviceCard} glass-panel`}>
              <div className={styles.serviceIconWrapper}>
                <svc.IconComponent size={24} color="#B14CFF" />
              </div>
              <h3 className={styles.serviceTitle}>{svc.title}</h3>
              <p className={styles.serviceDesc}>{svc.description}</p>
              <div className={styles.serviceFooter}>
                <span className={styles.servicePrice}>{svc.price}</span>
                <button className={styles.serviceBtn}>Inquire →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section id="coming-soon" className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>BOHENIX LABS</p>
          <h2 className={styles.sectionTitle}>Coming Soon</h2>
          <p className={styles.sectionSubtitle}>
            Next-generation platforms currently in development.
          </p>
        </div>
        <div className={styles.comingSoonGrid}>
          {comingSoon.map((item) => (
            <div key={item.title} className={`${styles.comingSoonCard} glass-panel`}>
              <div className={styles.comingSoonIconWrapper}>
                <item.IconComponent size={28} color="#B14CFF" />
              </div>
              <h3 className={styles.comingSoonTitle}>{item.title}</h3>
              <p className={styles.comingSoonDesc}>{item.description}</p>
              <span className={styles.comingSoonBadge}>In Development</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <h2>Ready to build the future?</h2>
        <p>Partner with Bohenix Technologies for world-class digital solutions.</p>
        <div className={styles.ctaActions}>
          <button className={styles.primaryAction}>Start a Project</button>
          <button className={styles.secondaryAction}>Schedule a Call →</button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Image src="/bohenixx.png" alt="Bohenix" width={28} height={28} />
            <span>BOHENIX</span>
          </div>
          <p className={styles.footerTagline}>Engineering the future, one product at a time.</p>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Bohenix Technologies. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
