import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import {
  createScreenMaterial,
  createBloomMaterial,
} from "../../shaders/screenMaterial";

// Screen plane positioning (derived from PSP screen mesh bounds)
const SCREEN_POSITION: [number, number, number] = [-0.778, 1.001, 0.114];
const SCREEN_ROTATION: [number, number, number] = [
  -Math.PI / 2 + 0.01,
  0,
  0.535,
];
const SCREEN_WIDTH = 0.11;
const SCREEN_HEIGHT = 0.065;
const BLOOM_SCALE = 1.3;

export function Psp(): React.JSX.Element {
  const { scene } = useGLTF("/models/psp.glb");

  const screenMat = useMemo(() => createScreenMaterial(), []);
  const bloomMat = useMemo(() => createBloomMaterial(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    screenMat.uniforms.uTime.value = t;
    bloomMat.uniforms.uTime.value = t;
  });

  return (
    <group>
      <primitive object={scene} />

      {/* Screen surface */}
      <mesh
        position={SCREEN_POSITION}
        rotation={SCREEN_ROTATION}
        renderOrder={1}
      >
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <primitive object={screenMat} attach="material" />
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
