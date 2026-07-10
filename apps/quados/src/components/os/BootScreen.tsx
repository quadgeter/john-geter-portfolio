import { useEffect } from "react";
import { useOsStore } from "../../store/useOsStore";
import { BOOT_DURATION_MS } from "../../constants/layout";
import styles from "./BootScreen.module.css";

export function BootScreen() {
  const setOsState = useOsStore((s) => s.setOsState);

  useEffect(() => {
    const timer = setTimeout(() => setOsState("on"), BOOT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [setOsState]);

  return (
    <div className={styles.bootScreen}>
      <div className={styles.logo}></div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
    </div>
  );
}
