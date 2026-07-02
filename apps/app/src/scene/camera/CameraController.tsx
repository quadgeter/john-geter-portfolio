import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Camera } from "./Camera";
import { useCameraStore } from "../../store/useCameraStore";

export function CameraController(): null {
  const mode = useCameraStore((s) => s.mode);
  const setInTransition = useCameraStore((s) => s.setInTransition);
  const setCamera = useCameraStore((s) => s.setCamera);
  const { camera } = useThree();

  const camRef = useRef<Camera | null>(null);
  const prevMode = useRef(mode);
  const clockRef = useRef(new THREE.Clock());

  if (!camRef.current) {
    camRef.current = new Camera(mode, setInTransition);
    camera.position.copy(camRef.current._position);
    camera.lookAt(camRef.current._focalPoint);
    setCamera(camRef.current);
  }

  useEffect(() => {
    if (prevMode.current !== mode && camRef.current) {
      camRef.current.transition(mode);
      prevMode.current = mode;
    }
  }, [mode]);

  useFrame(({ pointer }) => {
    if (!camRef.current) return;

    camRef.current.update({ clock: clockRef.current, pointer });
    camera.position.copy(camRef.current._position);
    camera.lookAt(camRef.current._focalPoint);
  });

  return null;
}
