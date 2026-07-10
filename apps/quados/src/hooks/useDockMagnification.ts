import { useRef, useCallback } from "react";
import { DOCK_MAX_MAGNIFICATION, DOCK_MAGNIFICATION_SIGMA } from "../constants/layout";

export function useDockMagnification(_itemCount: number) {
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  const applyScales = useCallback(() => {
    const mx = mouseXRef.current;
    const dock = dockRef.current;
    if (!dock) return;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;

      if (mx === null) {
        el.style.transform = "scale(1)";
        continue;
      }

      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(mx - center);
      const scale =
        1 +
        DOCK_MAX_MAGNIFICATION *
          Math.exp(-(dist * dist) / (2 * DOCK_MAGNIFICATION_SIGMA * DOCK_MAGNIFICATION_SIGMA));
      el.style.transform = `scale(${scale})`;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseXRef.current = e.clientX;
      applyScales();
    },
    [applyScales],
  );

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = null;
    applyScales();
  }, [applyScales]);

  return { dockRef, setItemRef, handleMouseMove, handleMouseLeave };
}
