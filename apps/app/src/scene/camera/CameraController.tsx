import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useCameraStore } from '../../store/useCameraStore'
import {
  INTRO_ORBIT_RADIUS,
  INTRO_ORBIT_HEIGHT,
  INTRO_ORBIT_SPEED,
  INTRO_START_ANGLE,
  INTRO_LOOK_TARGET,
  DESK_CAMERA_POSITION,
  DESK_CAMERA_TARGET,
  MONITOR_CAMERA_POSITION,
  MONITOR_CAMERA_TARGET,
} from '../../constants/scene'

interface Props {
  orbitRef: React.RefObject<OrbitControlsImpl | null>
}

// Pre-allocated to avoid per-frame heap pressure
const _introLook = new THREE.Vector3(...INTRO_LOOK_TARGET)
const _deskPos = new THREE.Vector3(...DESK_CAMERA_POSITION)
const _deskTarget = new THREE.Vector3(...DESK_CAMERA_TARGET)
const _monitorPos = new THREE.Vector3(...MONITOR_CAMERA_POSITION)
const _monitorTarget = new THREE.Vector3(...MONITOR_CAMERA_TARGET)

export function CameraController({ orbitRef }: Props): null {
  const mode = useCameraStore((s) => s.mode)
  const setOrbitEnabled = useCameraStore((s) => s.setOrbitEnabled)

  const introAngle = useRef(INTRO_START_ANGLE)
  const currentLookAt = useRef(new THREE.Vector3(...INTRO_LOOK_TARGET))
  const prevOrbitEnabled = useRef<boolean | null>(null)

  // Sync orbit target from OrbitControls when leaving desk mode
  useEffect(() => {
    if (mode === 'monitor' && orbitRef.current) {
      currentLookAt.current.copy(orbitRef.current.target)
    }
  }, [mode, orbitRef])

  useFrame(({ camera }, delta) => {
    const orbit = orbitRef.current

    const setOrbit = (enabled: boolean) => {
      if (prevOrbitEnabled.current === enabled) return
      prevOrbitEnabled.current = enabled
      setOrbitEnabled(enabled)
      if (orbit) orbit.enabled = enabled
    }

    if (mode === 'intro') {
      setOrbit(false)
      introAngle.current += delta * INTRO_ORBIT_SPEED
      camera.position.set(
        -Math.sin(introAngle.current) * INTRO_ORBIT_RADIUS,
        INTRO_ORBIT_HEIGHT,
        Math.cos(introAngle.current) * INTRO_ORBIT_RADIUS,
      )
      camera.lookAt(_introLook)
      return
    }

    if (mode === 'desk') {
      const dist = camera.position.distanceTo(_deskPos)

      if (dist > 0.05) {
        setOrbit(false)
        camera.position.lerp(_deskPos, 0.05)
        currentLookAt.current.lerp(_deskTarget, 0.05)
        camera.lookAt(currentLookAt.current)
      } else {
        if (orbit && !orbit.enabled) {
          camera.position.copy(_deskPos)
          orbit.target.copy(_deskTarget)
          orbit.update()
        }
        setOrbit(true)
      }
      return
    }

    if (mode === 'monitor') {
      setOrbit(false)
      camera.position.lerp(_monitorPos, 0.05)
      currentLookAt.current.lerp(_monitorTarget, 0.05)
      camera.lookAt(currentLookAt.current)
      return
    }
  })

  return null
}
