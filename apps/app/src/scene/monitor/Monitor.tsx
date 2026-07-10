import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useCallback, useRef } from "react";
import {
  createScreenMaterial,
  createBloomMaterial,
} from "../../shaders/screenMaterial";
import { useCameraStore } from "../../store/useCameraStore";
import { useScreenStore, INTENSITY_TARGET } from "../../store/useScreenStore";
import { monitorIframeRef } from "../../lib/iframeRefs";

const QUADOS_URL = import.meta.env.VITE_QUADOS_URL || "http://localhost:3001";
const QUADOS_ORIGIN = (() => {
  try {
    return new URL(QUADOS_URL).origin;
  } catch {
    return QUADOS_URL;
  }
})();

const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const SCREEN_POSITION: [number, number, number] = [0.5455, 1.21, -0.0275];
const SCREEN_ROTATION: [number, number, number] = [-0.13, -0.44, -0.055];
const SCREEN_WIDTH = 0.53;
const SCREEN_HEIGHT = 0.326;
const HIT_SCALE = 1.1;
const BLOOM_SCALE = 1.3;
const INTENSITY_LERP = 0.04;

// Iframe render resolution
const IFRAME_PX_WIDTH = 1024;
const IFRAME_PX_HEIGHT = Math.round(
  IFRAME_PX_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH),
);

export function Monitor(): React.JSX.Element {
  const { scene } = useGLTF("/models/monitor.glb");
  const setMode = useCameraStore((s) => s.setMode);
  const cameraMode = useCameraStore((s) => s.mode);
  const monitorState = useScreenStore((s) => s.monitorState);

  const screenMat = useMemo(() => createScreenMaterial(), []);
  const bloomMat = useMemo(() => createBloomMaterial(), []);

  const handleEnter = useCallback(() => {
    if (useCameraStore.getState().mode === "desk") setMode("monitor");
  }, [setMode]);

  const handleLeave = useCallback(() => {
    const { mode, inTransition } = useCameraStore.getState();
    const { osFocused } = useScreenStore.getState();
    if (mode === "monitor" && !inTransition && !osFocused) setMode("desk");
  }, [setMode]);

  // Send `enter` when the iframe finishes loading (avoids race with mount timing)
  const iframeLoadedRef = useRef(false);
  const handleIframeLoad = useCallback(() => {
    if (iframeLoadedRef.current) return;
    iframeLoadedRef.current = true;

    const iframe = monitorIframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        type: "enter" as const,
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
        isMobile,
      },
      QUADOS_ORIGIN,
    );
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    screenMat.uniforms.uTime.value = t;
    bloomMat.uniforms.uTime.value = t;

    const target = INTENSITY_TARGET[useScreenStore.getState().monitorState];
    screenMat.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      screenMat.uniforms.uIntensity.value,
      target,
      INTENSITY_LERP,
    );
    bloomMat.uniforms.uIntensity.value = screenMat.uniforms.uIntensity.value;
  });

  const showIframe = cameraMode === "monitor" || monitorState === "on";

  return (
    <group>
      <primitive object={scene} />

      {/* Screen surface shader — hidden when iframe is active */}
      <mesh
        position={SCREEN_POSITION}
        rotation={SCREEN_ROTATION}
        renderOrder={1}
        visible={!showIframe}
      >
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* quados iframe overlay */}
      {showIframe && (
        <group position={SCREEN_POSITION} rotation={SCREEN_ROTATION}>
          <Html
            transform
            distanceFactor={0.2071}
            style={{
              width: IFRAME_PX_WIDTH,
              height: IFRAME_PX_HEIGHT,
              overflow: "hidden",
              background: "#000",
            }}
            pointerEvents="auto"
          >
            <iframe
              ref={(el) => {
                monitorIframeRef.current = el;
                if (!el) iframeLoadedRef.current = false;
              }}
              src={QUADOS_URL}
              title="quadOS"
              onLoad={handleIframeLoad}
              style={{
                width: IFRAME_PX_WIDTH,
                height: IFRAME_PX_HEIGHT,
                border: "none",
                background: "#000",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </Html>
        </group>
      )}

      {/* Hit detection plane */}
      <mesh
        position={SCREEN_POSITION}
        rotation={SCREEN_ROTATION}
        visible={false}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
      >
        <planeGeometry
          args={[SCREEN_WIDTH * HIT_SCALE, SCREEN_HEIGHT * HIT_SCALE]}
        />
      </mesh>

      {/* Bloom glow */}
      <mesh
        position={SCREEN_POSITION}
        rotation={SCREEN_ROTATION}
        renderOrder={2}
      >
        <planeGeometry
          args={[SCREEN_WIDTH * BLOOM_SCALE, SCREEN_HEIGHT * BLOOM_SCALE]}
        />
        <primitive object={bloomMat} attach="material" />
      </mesh>
    </group>
  );
}
