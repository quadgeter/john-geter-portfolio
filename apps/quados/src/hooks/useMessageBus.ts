import { useEffect } from "react";
import type { R3FToQuadOS, QuadOSToR3F } from "@repo/shared-types/message-types";
import { useOsStore } from "../store/useOsStore";

function sendToParent(msg: QuadOSToR3F): void {
  window.parent.postMessage(msg, "*");
}

export function useMessageBus(): void {
  const boot = useOsStore((s) => s.boot);
  const setViewport = useOsStore((s) => s.setViewport);

  // Auto-boot when opened directly (not inside an iframe)
  useEffect(() => {
    const isTopLevel = window.self === window.parent;
    if (isTopLevel) {
      setViewport(window.innerWidth, window.innerHeight, false);
      boot();
    }
  }, [boot, setViewport]);

  // Listen for inbound messages from R3F parent
  useEffect(() => {
    function handleMessage(event: MessageEvent): void {
      const msg = event.data as R3FToQuadOS;
      if (!msg || typeof msg !== "object" || !("type" in msg)) return;

      switch (msg.type) {
        case "enter":
          setViewport(msg.winWidth, msg.winHeight, msg.isMobile);
          boot();
          break;
        case "resize":
          setViewport(msg.winWidth, msg.winHeight);
          break;
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [boot, setViewport]);

  // Subscribe to OS state changes and send messages to parent
  useEffect(() => {
    const unsub = useOsStore.subscribe((state, prev) => {
      if (state.osState === prev.osState) return;

      switch (state.osState) {
        case "booting":
          sendToParent({ type: "ready" });
          break;
        case "on":
          sendToParent({ type: "boot" });
          break;
        case "sleep":
          sendToParent({ type: "sleep" });
          break;
        case "off":
          if (prev.osState === "on" || prev.osState === "sleep") {
            sendToParent({ type: "shutdown" });
          }
          break;
      }
    });
    return unsub;
  }, []);
}
