import { useRef } from "react";
import type { OSWindow } from "../../types/os";
import { useOsStore } from "../../store/useOsStore";
import { useWindowDrag } from "../../hooks/useWindowDrag";
import { TrafficLights } from "./TrafficLights";
import styles from "./Window.module.css";

interface WindowProps {
  window: OSWindow;
  children: React.ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const titleBarRef = useRef<HTMLDivElement>(null);
  const activeWindowId = useOsStore((s) => s.activeWindowId);
  const closeWindow = useOsStore((s) => s.closeWindow);
  const minimizeWindow = useOsStore((s) => s.minimizeWindow);
  const maximizeWindow = useOsStore((s) => s.maximizeWindow);
  const focusWindow = useOsStore((s) => s.focusWindow);

  const isFocused = activeWindowId === win.id;

  useWindowDrag({
    windowId: win.id,
    titleBarRef,
    isMaximized: win.isMaximized,
  });

  if (win.isMinimized) return null;

  return (
    <div
      className={`${styles.window} ${isFocused ? styles.focused : ""}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => {
        if (!isFocused) focusWindow(win.id);
      }}
    >
      <div
        ref={titleBarRef}
        className={`${styles.titleBar} ${!isFocused ? styles.inactive : ""}`}
      >
        <TrafficLights
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => maximizeWindow(win.id)}
          inactive={!isFocused}
        />
        <span className={styles.title}>{win.title}</span>
      </div>
      <div className={styles.windowContent}>{children}</div>
    </div>
  );
}
