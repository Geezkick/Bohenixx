"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CommandPalette.module.css";
import { 
  SearchIcon, ShieldIcon, ShoppingBagIcon, FileTextIcon, 
  SettingsIcon, BookOpenIcon, ZapIcon, SignalIcon 
} from "./Icons";

const MOCK_LINKS = [
  { name: "Dashboard Overview", href: "/dashboard", icon: <SignalIcon size={18} color="#00E5FF" />, category: "Dashboard" },
  { name: "Products & Services", href: "/dashboard/subscriptions", icon: <ShoppingBagIcon size={18} color="#B14CFF" />, category: "Dashboard" },
  { name: "BX Labs", href: "/dashboard/labs", icon: <ZapIcon size={18} color="#B14CFF" />, category: "Dashboard" },
  { name: "Events", href: "/dashboard/events", icon: <FileTextIcon size={18} color="#B14CFF" />, category: "Dashboard" },
  { name: "Developer Portal", href: "/dashboard/developer", icon: <SettingsIcon size={18} color="#00E5FF" />, category: "Dashboard" },
  { name: "Account Settings", href: "/dashboard/settings", icon: <SettingsIcon size={18} color="#22c55e" />, category: "Dashboard" },
  { name: "BX POS Terminal", href: "/dashboard/pos", icon: <ShoppingBagIcon size={18} color="#B14CFF" />, category: "Apps" },
  { name: "NjiaSafe Dashboard", href: "https://njiasafe.six.vercel.app", icon: <ShieldIcon size={18} color="#00C853" />, category: "Apps" },
  { name: "Mboka Marketplace", href: "https://mboka.vercel.app", icon: <ShoppingBagIcon size={18} color="#FF6D00" />, category: "Apps" },
  { name: "Fixxo Repairs", href: "https://fixxo.vercel.app", icon: <SettingsIcon size={18} color="#2979FF" />, category: "Apps" },
  { name: "Vuna AgriTech", href: "https://vunashorts.vercel.app", icon: <SignalIcon size={18} color="#76FF03" />, category: "Apps" },
  { name: "Safura Health", href: "https://safura-ai.vercel.app", icon: <ZapIcon size={18} color="#00E5FF" />, category: "Apps" },
  { name: "Developer Documentation", href: "/developers", icon: <BookOpenIcon size={18} color="#B14CFF" />, category: "System" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredLinks = MOCK_LINKS.filter((link) =>
    link.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <SearchIcon size={20} color="rgba(255,255,255,0.5)" className={styles.searchIcon} />
          <input
            autoFocus
            type="text"
            className={styles.searchInput}
            placeholder="Search ecosystem or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className={styles.escKey}>ESC</kbd>
        </div>

        <div className={styles.results}>
          {filteredLinks.length === 0 ? (
            <p className={styles.noResults}>No results found.</p>
          ) : (
            filteredLinks.map((link) => (
              <button
                key={link.name}
                className={styles.resultItem}
                onClick={() => handleSelect(link.href)}
              >
                <span className={styles.resultIcon}>{link.icon}</span>
                <div className={styles.resultContent}>
                  <span className={styles.resultName}>{link.name}</span>
                  <span className={styles.resultCategory}>{link.category}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
