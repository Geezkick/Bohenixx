"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./PageTransition.module.css";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      setTransitioning(true);

      // Short fade-out, then swap content
      const timer = setTimeout(() => {
        setDisplayedChildren(children);
        setTransitioning(false);
        previousPathname.current = pathname;
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setDisplayedChildren(children);
    }
  }, [pathname, children]);

  return (
    <div className={`${styles.pageWrap} ${transitioning ? styles.exiting : styles.entering}`}>
      {displayedChildren}
    </div>
  );
}
