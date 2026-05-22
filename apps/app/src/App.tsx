import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './Scene'
import { usePreloadAssets } from './hooks/usePreloadAssets'
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  INITIAL_POSITION,
} from './constants/scene'

function App(): React.JSX.Element {
  usePreloadAssets()

  return (
    <Canvas
      camera={{
        fov: CAMERA_FOV,
        near: CAMERA_NEAR,
        far: CAMERA_FAR,
        position: INITIAL_POSITION,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

export default App
