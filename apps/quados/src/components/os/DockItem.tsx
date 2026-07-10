import { forwardRef } from "react";
import styles from "./DockItem.module.css";

interface DockItemProps {
  iconSrc: string;
  label: string;
  isRunning: boolean;
  onClick: () => void;
}

export const DockItem = forwardRef<HTMLDivElement, DockItemProps>(
  function DockItem({ iconSrc, label, isRunning, onClick }, ref) {
    return (
      <div ref={ref} className={styles.dockItem} onClick={onClick}>
        <img
          className={styles.icon}
          src={iconSrc}
          alt={label}
          draggable={false}
        />
        {isRunning && <div className={styles.runningDot} />}
        <span className={styles.tooltip}>{label}</span>
      </div>
    );
  },
);
