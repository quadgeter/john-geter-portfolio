import { useCallback } from "react";
import type { AppId } from "../../types/os";
import { useOsStore } from "../../store/useOsStore";
import { APP_MAP } from "../../constants/apps";
import styles from "./DesktopShortcut.module.css";

interface DesktopShortcutProps {
  appId: AppId;
  name: string;
  iconSrc: string;
}

export function DesktopShortcut({ appId, name, iconSrc }: DesktopShortcutProps) {
  const openWindow = useOsStore((s) => s.openWindow);

  const handleDoubleClick = useCallback(() => {
    const def = APP_MAP[appId];
    if (def) {
      openWindow(appId, def.name, def.defaultSize);
    }
  }, [appId, openWindow]);

  return (
    <div className={styles.shortcut} onDoubleClick={handleDoubleClick}>
      <img
        className={styles.icon}
        src={iconSrc}
        alt={name}
        draggable={false}
      />
      <span className={styles.label}>{name}</span>
    </div>
  );
}
