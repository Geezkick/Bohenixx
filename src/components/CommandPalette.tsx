"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CommandPalette.module.css";

const MOCK_LINKS = [
  { name: "NjiaSafe Dashboard", href: "https://njiasafe.six.vercel.app", icon: "🛡️", category: "Apps" },
  { name: "Mboka Marketplace", href: "https://mboka.vercel.app", icon: "🛒", category: "Apps" },
  { name: "Fixxo Repairs", href: "https://fixxo.vercel.app", icon: "🔧", category: "Apps" },
  { name: "Vuna AgriTech", href: "https://vunashorts.vercel.app", icon: "🌱", category: "Apps" },
  { name: "Safura Health", href: "https://safura-ai.vercel.app", icon: "⚕️", category: "Apps" },
  { name: "Product Catalog", href: "/store", icon: "🛍️", category: "Store" },
  { name: "Service Request", href: "/services/request", icon: "📝", category: "Services" },
  { name: "Settings", href: "/settings", icon: "⚙️", category: "System" },
  { name: "Documentation", href: "/docs", icon: "📚", category: "System" },
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
          <span className={styles.searchIcon}>🔍</span>
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
