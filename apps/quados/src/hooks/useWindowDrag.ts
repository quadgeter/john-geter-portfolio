import { useRef, useEffect, useState } from "react";
import { useOsStore } from "../store/useOsStore";
import { MENU_BAR_HEIGHT, DOCK_HEIGHT, TITLE_BAR_HEIGHT } from "../constants/layout";

interface UseWindowDragOptions {
  windowId: string;
  titleBarRef: React.RefObject<HTMLDivElement | null>;
  isMaximized: boolean;
}

export function useWindowDrag({
  windowId,
  titleBarRef,
  isMaximized,
}: UseWindowDragOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = titleBarRef.current;
    if (!el || isMaximized) return;

    function onPointerDown(e: PointerEvent) {
      const win = useOsStore
        .getState()
        .windows.find((w) => w.id === windowId);
      if (!win) return;

      offsetRef.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      el!.setPointerCapture(e.pointerId);
      setIsDragging(true);
    }

    function onPointerMove(e: PointerEvent) {
      if (!el!.hasPointerCapture(e.pointerId)) return;

      const { viewportWidth, viewportHeight } = useOsStore.getState();
      const win = useOsStore
        .getState()
        .windows.find((w) => w.id === windowId);
      if (!win) return;

      const maxY = viewportHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT - TITLE_BAR_HEIGHT;

      let x = e.clientX - offsetRef.current.x;
      let y = e.clientY - offsetRef.current.y;

      x = Math.max(-win.size.width + 40, Math.min(x, viewportWidth - 40));
      y = Math.max(0, Math.min(y, maxY));

      useOsStore.getState().moveWindow(windowId, { x, y });
    }

    function onPointerUp(e: PointerEvent) {
      if (el!.hasPointerCapture(e.pointerId)) {
        el!.releasePointerCapture(e.pointerId);
      }
      setIsDragging(false);
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
    };
  }, [windowId, titleBarRef, isMaximized]);

  return isDragging;
}
