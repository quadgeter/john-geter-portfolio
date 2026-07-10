import { useCallback } from "react";
import { useOsStore } from "../../store/useOsStore";
import { APP_REGISTRY, APP_MAP } from "../../constants/apps";
import { useDockMagnification } from "../../hooks/useDockMagnification";
import { DockItem } from "./DockItem";
import styles from "./Dock.module.css";

export function Dock() {
  const windows = useOsStore((s) => s.windows);
  const openWindow = useOsStore((s) => s.openWindow);
  const restoreWindow = useOsStore((s) => s.restoreWindow);
  const focusWindow = useOsStore((s) => s.focusWindow);

  const { dockRef, setItemRef, handleMouseMove, handleMouseLeave } =
    useDockMagnification(APP_REGISTRY.length);

  const handleAppClick = useCallback(
    (appId: string) => {
      const win = windows.find((w) => w.appId === appId);
      if (win) {
        if (win.isMinimized) {
          restoreWindow(win.id);
        } else {
          focusWindow(win.id);
        }
      } else {
        const def = APP_MAP[appId];
        if (def) openWindow(def.id, def.name, def.defaultSize);
      }
    },
    [windows, openWindow, restoreWindow, focusWindow],
  );

  return (
    <div
      ref={dockRef}
      className={styles.dock}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {APP_REGISTRY.map((app, i) => {
        const isRunning = windows.some(
          (w) => w.appId === app.id && !w.isMinimized,
        );
        return (
          <DockItem
            key={app.id}
            ref={setItemRef(i)}
            iconSrc={app.iconSrc}
            label={app.name}
            isRunning={isRunning}
            onClick={() => handleAppClick(app.id)}
          />
        );
      })}
    </div>
  );
}
