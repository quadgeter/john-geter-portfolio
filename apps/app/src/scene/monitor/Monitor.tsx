import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useCallback } from "react";
import {
  createScreenMaterial,
  createBloomMaterial,
} from "../../shaders/screenMaterial";
import { useCameraStore } from "../../store/useCameraStore";

const SCREEN_POSITION: [number, number, number] = [0.5455, 1.21, -0.0275];
const SCREEN_ROTATION: [number, number, number] = [-0.13, -0.44, -0.055];
const SCREEN_WIDTH = 0.53;
const SCREEN_HEIGHT = 0.326;
const HIT_SCALE = 1.1;
const BLOOM_SCALE = 1.3;

export function Monitor(): React.JSX.Element {
  const { scene } = useGLTF("/models/monitor.glb");
  const setMode = useCameraStore((s) => s.setMode);

  const screenMat = useMemo(() => createScreenMaterial(), []);
  const bloomMat = useMemo(() => createBloomMaterial(), []);

  const handleEnter = useCallback(() => {
    if (useCameraStore.getState().mode === "desk") setMode("monitor");
  }, [setMode]);

  const handleLeave = useCallback(() => {
    const { mode, inTransition } = useCameraStore.getState();
    if (mode === "monitor" && !inTransition) setMode("desk");
  }, [setMode]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    screenMat.uniforms.uTime.value = t;
    bloomMat.uniforms.uTime.value = t;
  });

  return (
    <group>
      <primitive object={scene} />

      <mesh
        position={SCREEN_POSITION}
        rotation={SCREEN_ROTATION}
        renderOrder={1}
      >
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

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
