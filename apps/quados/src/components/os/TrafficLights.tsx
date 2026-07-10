import styles from "./TrafficLights.module.css";

interface TrafficLightsProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  inactive?: boolean;
}

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  inactive,
}: TrafficLightsProps) {
  return (
    <div
      className={`${styles.trafficLights} ${inactive ? styles.inactive : ""}`}
    >
      <button
        className={`${styles.button} ${styles.close}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onClose}
      >
        <span className={styles.symbol}>&#x2715;</span>
      </button>
      <button
        className={`${styles.button} ${styles.minimize}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onMinimize}
      >
        <span className={styles.symbol}>&#x2013;</span>
      </button>
      <button
        className={`${styles.button} ${styles.maximize}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onMaximize}
      >
        <span className={styles.symbol}>&#x2b;</span>
      </button>
    </div>
  );
}
