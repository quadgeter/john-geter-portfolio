import { OrbitControls, Environment } from '@react-three/drei'
import { Room } from './scene/room/Room'
import { Desk } from './scene/desk/Desk'
import { Monitor } from './scene/monitor/Monitor'
import { Psp } from './scene/psp/Psp'
import {
  INITIAL_TARGET,
  FOG_COLOR,
  FOG_DENSITY,
  BACKGROUND_COLOR,
} from './constants/scene'


export function Scene(): React.JSX.Element {
  return (
    <>
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />

      <OrbitControls
        target={INITIAL_TARGET}
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
