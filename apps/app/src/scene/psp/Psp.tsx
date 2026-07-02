import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useCallback, useRef } from "react";
import * as THREE from "three";
import {
  createScreenMaterial,
  createBloomMaterial,
} from "../../shaders/screenMaterial";
import { useCameraStore } from "../../store/useCameraStore";
import {
  PSP_HELD_LIFT,
  PSP_HELD_FORWARD,
  PSP_HELD_LATERAL,
  PSP_HELD_TILT,
  PSP_HELD_FLATTEN,
} from "../../constants/scene";

const SCREEN_POSITION: [number, number, number] = [-0.777, 1.001, 0.1135];
const SCREEN_ROTATION: [number, number, number] = [
  -Math.PI / 2 + 0.01,
  0,
  0.529,
];
const SCREEN_WIDTH = 0.11;
const SCREEN_HEIGHT = 0.0608;
const BLOOM_SCALE = 1.3;
const HIT_SCALE = 1.5;

const PIVOT: [number, number, number] = [-0.778, 1.001, 0.114];
const NEG_PIVOT: [number, number, number] = [0.778, -1.001, -0.114];

export function Psp(): React.JSX.Element {
  const { scene } = useGLTF("/models/psp.glb");
  const setMode = useCameraStore((s) => s.setMode);
  const liftRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);

  const screenMat = useMemo(() => createScreenMaterial(), []);
  const bloomMat = useMemo(() => createBloomMaterial(), []);

  const handleEnter = useCallback(() => {
    if (useCameraStore.getState().mode === "desk") setMode("psp");
  }, [setMode]);

  const handleLeave = useCallback(() => {
    const { mode, inTransition } = useCameraStore.getState();
    if (mode === "psp" && !inTransition) setMode("desk");
  }, [setMode]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    screenMat.uniforms.uTime.value = t;
    bloomMat.uniforms.uTime.value = t;

    const { mode, inTransition } = useCameraStore.getState();
    const held = mode === "psp";

    if (liftRef.current) {
      liftRef.current.position.x = THREE.MathUtils.lerp(
        liftRef.current.position.x,
        held ? PSP_HELD_LATERAL : 0,
        0.05,
      );
      liftRef.current.position.y = THREE.MathUtils.lerp(
        liftRef.current.position.y,
        held ? PSP_HELD_LIFT : 0,
        0.05,
      );
      liftRef.current.position.z = THREE.MathUtils.lerp(
        liftRef.current.position.z,
        held ? PSP_HELD_FORWARD : 0,
        0.05,
      );

      if (held && inTransition) {
        const dx = liftRef.current.position.x - PSP_HELD_LATERAL;
        const dy = liftRef.current.position.y - PSP_HELD_LIFT;
        const dz = liftRef.current.position.z - PSP_HELD_FORWARD;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.05) {
          useCameraStore.getState().setInTransition(false);
        }
      }
    }
    if (tiltRef.current) {
      tiltRef.current.rotation.x = THREE.MathUtils.lerp(
        tiltRef.current.rotation.x,
        held ? PSP_HELD_TILT : 0,
        0.05,
      );
      tiltRef.current.rotation.y = THREE.MathUtils.lerp(
        tiltRef.current.rotation.y,
        held ? PSP_HELD_FLATTEN : 0,
        0.05,
      );
    }
  });

  return (
    <group ref={liftRef}>
      <group position={PIVOT}>
        <group ref={tiltRef}>
          <group position={NEG_PIVOT}>
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
        </group>
      </group>
    </group>
  );
}
