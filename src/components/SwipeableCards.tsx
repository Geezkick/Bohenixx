"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SwipeableCards.module.css";

interface AppItem {
  name: string;
  icon: string;
  tagline: string;
  color: string;
  url: string;
}

export default function SwipeableCards({ apps }: { apps: AppItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.clientWidth || 1;
    const gap = 16;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, apps.length - 1));
  }, [apps.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.wrapper}>
      <div ref={scrollRef} className={styles.track}>
        {apps.map((app) => {
          const isExternal = app.url.startsWith("http");
          return (
          <Link
            href={app.url}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            key={app.name}
            className={styles.card}
          >
            <div
              className={styles.cardGlow}
              style={{ background: `radial-gradient(circle at 50% 0%, ${app.color}18, transparent 70%)` }}
            />
            <div
              className={styles.iconContainer}
              style={{ boxShadow: `0 0 24px ${app.color}30` }}
            >
              <Image
                src={`/${app.icon}`}
                alt={`${app.name} Logo`}
                width={52}
                height={52}
                className={styles.icon}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{app.name}</h3>
                <span
                  className={styles.dot}
                  style={{
                    backgroundColor: app.color,
                    boxShadow: `0 0 6px ${app.color}`,
                  }}
                />
              </div>
              <p className={styles.tagline}>{app.tagline}</p>
            </div>
            <div
              className={styles.openBtn}
              style={{ borderColor: `${app.color}50`, color: app.color }}
            >
              Open
            </div>
          </Link>
          );
        })}
      </div>

      {/* Page indicators */}
      <div className={styles.dots}>
        {apps.map((_, i) => (
          <span
            key={i}
            className={`${styles.dotIndicator} ${i === activeIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
