import { create } from "zustand";
import type {
  OsState,
  AppId,
  OSWindow,
  WindowPosition,
  WindowSize,
} from "../types/os";
import { MENU_BAR_HEIGHT, DOCK_HEIGHT } from "../constants/layout";

interface OsStoreState {
  osState: OsState;
  isMobile: boolean;
  viewportWidth: number;
  viewportHeight: number;

  windows: OSWindow[];
  activeWindowId: string | null;
  nextZIndex: number;

  boot: () => void;
  sleep: () => void;
  shutdown: () => void;
  reboot: () => void;
  setOsState: (state: OsState) => void;
  setViewport: (w: number, h: number, isMobile?: boolean) => void;

  openWindow: (
    appId: AppId,
    title: string,
    size: WindowSize,
    position?: WindowPosition,
  ) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: WindowPosition) => void;
  resizeWindow: (id: string, size: WindowSize) => void;
}

function centerWindow(
  size: WindowSize,
  vpWidth: number,
  vpHeight: number,
): WindowPosition {
  const availableHeight = vpHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;
  return {
    x: Math.max(0, (vpWidth - size.width) / 2),
    y: Math.max(0, (availableHeight - size.height) / 2),
  };
}

function updateWindow(
  windows: OSWindow[],
  id: string,
  updater: (w: OSWindow) => Partial<OSWindow>,
): OSWindow[] {
  return windows.map((w) => (w.id === id ? { ...w, ...updater(w) } : w));
}

export const useOsStore = create<OsStoreState>()((set, get) => ({
  osState: "off",
  isMobile: false,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,

  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  boot: () =>
    set((s) => {
      if (s.osState === "off") return { osState: "booting" };
      if (s.osState === "sleep") return { osState: "on" };
      return {};
    }),

  sleep: () =>
    set((s) => {
      if (s.osState === "on") return { osState: "sleep" };
      return {};
    }),

  shutdown: () => set({ osState: "off", windows: [], activeWindowId: null }),

  reboot: () => {
    set({ osState: "off", windows: [], activeWindowId: null });
    setTimeout(() => get().boot(), 500);
  },

  setOsState: (osState) => set({ osState }),

  setViewport: (w, h, isMobile) =>
    set(() => ({
      viewportWidth: w,
      viewportHeight: h,
      ...(isMobile !== undefined ? { isMobile } : {}),
    })),

  openWindow: (appId, title, size, position) =>
    set((s) => {
      const existing = s.windows.find((w) => w.appId === appId);

      if (existing) {
        if (existing.isMinimized) {
          return {
            windows: updateWindow(s.windows, existing.id, () => ({
              isMinimized: false,
              zIndex: s.nextZIndex,
            })),
            activeWindowId: existing.id,
            nextZIndex: s.nextZIndex + 1,
          };
        }
        return {
          windows: updateWindow(s.windows, existing.id, () => ({
            zIndex: s.nextZIndex,
          })),
          activeWindowId: existing.id,
          nextZIndex: s.nextZIndex + 1,
        };
      }

      const pos =
        position ?? centerWindow(size, s.viewportWidth, s.viewportHeight);

      const newWindow: OSWindow = {
        id: appId,
        appId,
        title,
        position: pos,
        size,
        isMinimized: false,
        isMaximized: false,
        zIndex: s.nextZIndex,
      };

      return {
        windows: [...s.windows, newWindow],
        activeWindowId: appId,
        nextZIndex: s.nextZIndex + 1,
      };
    }),

  closeWindow: (id) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.id !== id),
      activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
    })),

  minimizeWindow: (id) =>
    set((s) => ({
      windows: updateWindow(s.windows, id, () => ({ isMinimized: true })),
      activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
    })),

  maximizeWindow: (id) =>
    set((s) => {
      const availH = s.viewportHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT;
      return {
        windows: updateWindow(s.windows, id, (w) =>
          w.isMaximized
            ? {
                isMaximized: false,
                position: w.preMaxPosition ?? w.position,
                size: w.preMaxSize ?? w.size,
                preMaxPosition: undefined,
                preMaxSize: undefined,
              }
            : {
                isMaximized: true,
                preMaxPosition: w.position,
                preMaxSize: w.size,
                position: { x: 0, y: 0 },
                size: { width: s.viewportWidth, height: availH },
              },
        ),
      };
    }),

  restoreWindow: (id) =>
    set((s) => ({
      windows: updateWindow(s.windows, id, () => ({
        isMinimized: false,
        zIndex: s.nextZIndex,
      })),
      activeWindowId: id,
      nextZIndex: s.nextZIndex + 1,
    })),

  focusWindow: (id) =>
    set((s) => ({
      windows: updateWindow(s.windows, id, () => ({
        zIndex: s.nextZIndex,
      })),
      activeWindowId: id,
      nextZIndex: s.nextZIndex + 1,
    })),

  moveWindow: (id, position) =>
    set((s) => ({
      windows: updateWindow(s.windows, id, () => ({ position })),
    })),

  resizeWindow: (id, size) =>
    set((s) => ({
      windows: updateWindow(s.windows, id, () => ({ size })),
    })),
}));
