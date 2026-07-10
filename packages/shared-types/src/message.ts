// ── Screen state (shared across all three apps) ───────────────
export type ScreenState = "off" | "loading" | "ready" | "on" | "sleep" | "error";

// ── R3F → quadOS ──────────────────────────────────────────────
export type R3FToQuadOS =
  | { type: "enter"; winWidth: number; winHeight: number; isMobile: boolean }
  | { type: "resize"; winWidth: number; winHeight: number };

// ── quadOS → R3F ──────────────────────────────────────────────
export type QuadOSToR3F =
  | { type: "ready" }
  | { type: "boot" }
  | { type: "sleep" }
  | { type: "reboot" }
  | { type: "shutdown" }
  | { type: "focus" }
  | { type: "blur" }
  | { type: "error"; message: string };

// ── R3F → gameOS ──────────────────────────────────────────────
export type R3FToGameOS =
  | { type: "enter"; winWidth: number; winHeight: number; isMobile: boolean }
  | { type: "resize"; winWidth: number; winHeight: number };

// ── gameOS → R3F ──────────────────────────────────────────────
export type GameOSToR3F =
  | { type: "ready" }
  | { type: "boot" }
  | { type: "sleep" }
  | { type: "reboot" }
  | { type: "shutdown" }
  | { type: "focus" }
  | { type: "blur" }
  | { type: "error"; message: string };

// ── Discriminated union for inbound routing ───────────────────
export type InboundMessage =
  | { source: "quadOS"; payload: QuadOSToR3F }
  | { source: "gameOS"; payload: GameOSToR3F };

// ── Type guards ───────────────────────────────────────────────
export const isQuadOSMessage = (
  msg: InboundMessage,
): msg is { source: "quadOS"; payload: QuadOSToR3F } => msg.source === "quadOS";

export const isGameOSMessage = (
  msg: InboundMessage,
): msg is { source: "gameOS"; payload: GameOSToR3F } => msg.source === "gameOS";
