"use client";

import { useRouter } from "next/navigation";
import styles from "./NativeHeader.module.css";
import { ArrowLeftIcon } from "./Icons";

interface NativeHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export default function NativeHeader({ title, rightAction }: NativeHeaderProps) {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        <ArrowLeftIcon size={22} />
        <span>Back</span>
      </button>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.rightAction}>
        {rightAction}
      </div>
    </div>
  );
}
