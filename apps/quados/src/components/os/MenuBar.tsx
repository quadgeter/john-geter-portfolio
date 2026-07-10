import { useEffect, useState } from "react";
import { useOsStore } from "../../store/useOsStore";
import { APP_MAP } from "../../constants/apps";
import styles from "./MenuBar.module.css";

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function MenuBar() {
  const activeWindowId = useOsStore((s) => s.activeWindowId);
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  const activeApp = activeWindowId ? APP_MAP[activeWindowId] : null;
  const appName = activeApp?.name ?? "Finder";

  return (
    <div className={styles.menuBar}>
      <span className={styles.appleLogo}></span>
      <span className={`${styles.menuItem} ${styles.appName}`}>{appName}</span>
      <span className={styles.menuItem}>File</span>
      <span className={styles.menuItem}>Edit</span>
      <span className={styles.menuItem}>View</span>
      <span className={styles.clock}>{time}</span>
    </div>
  );
}
