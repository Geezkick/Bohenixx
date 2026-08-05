"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./CommandPalette.module.css";
import { 
  LayoutDashboard, Layers, BrainCircuit, Workflow, 
  FileText, Network, TrendingUp, Settings, Shield, 
  CreditCard, Sparkles, Zap, Home, ArrowRight, Mail
} from "lucide-react";

interface SearchItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  keywords?: string;
}

const COMMAND_ITEMS: SearchItem[] = [
  { name: "Mission Control Overview", href: "/dashboard", icon: <LayoutDashboard size={18} color="#00E5FF" />, category: "Dashboard", keywords: "home main control center metrics status" },
  { name: "Departments & Fleet Governance", href: "/dashboard/departments", icon: <Layers size={18} color="#7B2DFF" />, category: "Workforce", keywords: "teams sales ops hr finance support departments" },
  { name: "AI Workforce & Employee Roster", href: "/dashboard/ai-employees", icon: <BrainCircuit size={18} color="#A78BFA" />, category: "Workforce", keywords: "agents bot hire employee roster digital staff" },
  { name: "Workflow Builder & Sequences", href: "/dashboard/workflows", icon: <Workflow size={18} color="#3B82F6" />, category: "Automation", keywords: "flow sequence pipeline automation triggers" },
  { name: "Documents & DNA Knowledge Vault", href: "/dashboard/documents", icon: <FileText size={18} color="#F59E0B" />, category: "Knowledge", keywords: "files pdf dna guidelines corporate mission policy" },
  { name: "Neural Knowledge Graph Core", href: "/dashboard/knowledge", icon: <Network size={18} color="#10B981" />, category: "Intelligence", keywords: "nodes memory graph neural context database" },
  { name: "Telemetry & Live Analytics", href: "/dashboard/analytics", icon: <TrendingUp size={18} color="#EC4899" />, category: "Analytics", keywords: "metrics performance csat logs stats reports" },
  { name: "System Settings & Profile", href: "/dashboard/settings", icon: <Settings size={18} color="#9CA3AF" />, category: "System", keywords: "account password 2fa security api keys profile" },
  { name: "Corporate DNA Risk & Policy Rules", href: "/dashboard/settings", icon: <Shield size={18} color="#EF4444" />, category: "Governance", keywords: "guardrails risk budget appetite rules compliance" },
  { name: "Subscription & Plan Management", href: "/dashboard/settings", icon: <CreditCard size={18} color="#10B981" />, category: "Billing", keywords: "pricing upgrade plan checkout mpesa invoice" },
  { name: "Deploy New AI Agent Fleet", href: "/dashboard/onboarding", icon: <Zap size={18} color="#F59E0B" />, category: "Deploy", keywords: "onboarding create setup launch agent" },
  { name: "Bohenix Flow AI Product", href: "/flow-ai", icon: <Image src="/bohenixx.png" alt="Logo" width={18} height={18} />, category: "Ecosystem", keywords: "product website flow ai overview" },
  { name: "Pricing & Enterprise Plans", href: "/pricing", icon: <Sparkles size={18} color="#7B2DFF" />, category: "Billing", keywords: "pricing cost tiers subscription" },
  { name: "Public Homepage", href: "/", icon: <Home size={18} color="#9CA3AF" />, category: "Navigation", keywords: "home landing page website" },
  { name: "Contact Founder Desk", href: "mailto:ceo@bohenix.africa", icon: <Mail size={18} color="#00E5FF" />, category: "Support", keywords: "email founder brian contact support" }
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredLinks = COMMAND_ITEMS.filter((item) => {
    const text = `${item.name} ${item.category} ${item.keywords || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    if (href.startsWith("http") || href.startsWith("mailto")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredLinks.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredLinks.length) % (filteredLinks.length || 1));
    } else if (e.key === "Enter" && filteredLinks[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredLinks[selectedIndex].href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <LayoutDashboard size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Type a command or search dashboard, agents, workflows..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
          <kbd className={styles.escKey}>ESC</kbd>
        </div>

        <div className={styles.results}>
          {filteredLinks.length === 0 ? (
            <div className={styles.noResults}>
              <p>No matching commands or pages found.</p>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Try searching for "agents", "workflows", or "settings".</span>
            </div>
          ) : (
            filteredLinks.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${item.name}-${idx}`}
                  className={`${styles.resultItem} ${isSelected ? styles.resultItemSelected : ""}`}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className={styles.resultIcon}>{item.icon}</span>
                  <div className={styles.resultContent}>
                    <span className={styles.resultName}>{item.name}</span>
                    <span className={styles.resultCategory}>{item.category}</span>
                  </div>
                  <ArrowRight size={14} className={styles.arrowIcon} />
                </button>
              );
            })
          )}
        </div>
        <div className={styles.footerHint}>
          <span>Use <strong>↑↓</strong> to navigate</span>
          <span><strong>↵</strong> to select</span>
          <span><strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>
  );
}

