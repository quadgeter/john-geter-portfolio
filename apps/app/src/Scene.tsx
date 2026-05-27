import { useRef } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Room } from './scene/room/Room'
import { Desk } from './scene/desk/Desk'
import { Monitor } from './scene/monitor/Monitor'
import { Psp } from './scene/psp/Psp'
import { CameraController } from './scene/camera/CameraController'
import { useCameraStore } from './store/useCameraStore'
import {
  DESK_CAMERA_TARGET,
  FOG_COLOR,
  FOG_DENSITY,
  BACKGROUND_COLOR,
} from './constants/scene'

export function Scene(): React.JSX.Element {
  const orbitRef = useRef<OrbitControlsImpl | null>(null)
  const orbitEnabled = useCameraStore((s) => s.orbitEnabled)

  return (
    <>
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />

      <CameraController orbitRef={orbitRef} />

      <OrbitControls
        ref={orbitRef}
        enabled={orbitEnabled}
        target={DESK_CAMERA_TARGET}
        minDistance={2}
        maxDistance={7}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
      />

      <Environment preset="apartment" background={false} />

      <Room />
      <Desk />
      <Monitor />
      <Psp />
    </>
  )
}
