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
  INTRO_LOOK_TARGET,
  INTRO_AUTO_ROTATE_SPEED,
  FOG_COLOR,
  FOG_DENSITY,
  BACKGROUND_COLOR,
} from './constants/scene'

export function Scene(): React.JSX.Element {
  const orbitRef = useRef<OrbitControlsImpl | null>(null)
  const mode = useCameraStore((s) => s.mode)

  return (
    <>
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />

      <CameraController orbitRef={orbitRef} />

      <OrbitControls
        ref={orbitRef}
        enabled={mode === 'intro'}
        target={INTRO_LOOK_TARGET}
        autoRotate={mode === 'intro'}
        autoRotateSpeed={INTRO_AUTO_ROTATE_SPEED}
        enablePan={false}
        enableZoom={false}
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
