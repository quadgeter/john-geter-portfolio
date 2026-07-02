import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useCameraStore } from "../../store/useCameraStore";
import {
  INITIAL_POSITION,
  INTRO_LOOK_TARGET,
  DESK_CAMERA_POSITION,
  DESK_CAMERA_TARGET,
  DESK_LOOK_X,
  DESK_LOOK_Y,
  DESK_LOOK_SMOOTHING,
  MONITOR_CAMERA_POSITION,
  MONITOR_CAMERA_TARGET,
  PSP_CAMERA_POSITION,
  PSP_CAMERA_TARGET,
} from "../../constants/scene";

interface Props {
  orbitRef: React.RefObject<OrbitControlsImpl | null>;
}

const _deskPos = new THREE.Vector3(...DESK_CAMERA_POSITION);
const _deskTarget = new THREE.Vector3(...DESK_CAMERA_TARGET);
const _monitorPos = new THREE.Vector3(...MONITOR_CAMERA_POSITION);
const _monitorTarget = new THREE.Vector3(...MONITOR_CAMERA_TARGET);
const _pspPos = new THREE.Vector3(...PSP_CAMERA_POSITION);
const _pspTarget = new THREE.Vector3(...PSP_CAMERA_TARGET);
const _lookTarget = new THREE.Vector3();

const ARRIVE_THRESHOLD = 0.05;

export function CameraController({ orbitRef }: Props): null {
  const mode = useCameraStore((s) => s.mode);
  const setInTransition = useCameraStore((s) => s.setInTransition);

  const currentLookAt = useRef(new THREE.Vector3());
  const deskTransitionDone = useRef(false);

  useEffect(() => {
    if (mode === "intro" && orbitRef.current) {
      orbitRef.current.object.position.set(...INITIAL_POSITION);
      orbitRef.current.target.set(...INTRO_LOOK_TARGET);
      orbitRef.current.update();
    }
    // Capture orbit target as starting look-at when leaving intro
    if (mode === "desk" && orbitRef.current) {
      currentLookAt.current.copy(orbitRef.current.target);
    }
    if (mode === "monitor" || mode === "psp") {
      currentLookAt.current.copy(_deskTarget);
    }
    if (mode !== "desk") {
      deskTransitionDone.current = false;
    }
  }, [mode, orbitRef]);

  useFrame(({ camera, pointer }) => {
    if (mode === "intro") return;

    if (mode === "desk") {
      if (!deskTransitionDone.current) {
        const posDist = camera.position.distanceTo(_deskPos);
        const lookDist = currentLookAt.current.distanceTo(_deskTarget);

        if (posDist > 0.05 || lookDist > 0.05) {
          camera.position.lerp(_deskPos, 0.05);
          currentLookAt.current.lerp(_deskTarget, 0.05);
          camera.lookAt(currentLookAt.current);
        } else {
          camera.position.copy(_deskPos);
          deskTransitionDone.current = true;
        }
        return;
      }

      _lookTarget.set(
        _deskTarget.x + pointer.x * DESK_LOOK_X,
        _deskTarget.y + pointer.y * DESK_LOOK_Y,
        _deskTarget.z,
      );
      currentLookAt.current.lerp(_lookTarget, DESK_LOOK_SMOOTHING);
      camera.lookAt(currentLookAt.current);
      return;
    }

    if (mode === "monitor") {
      camera.position.lerp(_monitorPos, 0.05);
      currentLookAt.current.lerp(_monitorTarget, 0.05);
      camera.lookAt(currentLookAt.current);
      if (camera.position.distanceTo(_monitorPos) < ARRIVE_THRESHOLD) {
        setInTransition(false);
      }
      return;
    }

    if (mode === "psp") {
      camera.position.lerp(_pspPos, 0.05);
      currentLookAt.current.lerp(_pspTarget, 0.05);
      camera.lookAt(currentLookAt.current);
      return;
    }
  });

  return null;
}
