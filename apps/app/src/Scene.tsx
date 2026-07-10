import './shaders/fogOverrides'
import { Environment } from '@react-three/drei'
import { Room } from './scene/room/Room'
import { Desk } from './scene/desk/Desk'
import { Monitor } from './scene/monitor/Monitor'
import { Psp } from './scene/psp/Psp'
import { CameraController } from './scene/camera/CameraController'
import {
  FOG_COLOR,
  FOG_DENSITY,
  BACKGROUND_COLOR,
} from './constants/scene'

export function Scene(): React.JSX.Element {
  return (
    <>
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />

      <CameraController />

      <Environment preset="apartment" background={false} />

      <Room />
      <Desk />
      <Monitor />
      <Psp />
    </>
  )
}
