import { useGLTF } from '@react-three/drei'

export function Room(): React.JSX.Element {
  const { scene } = useGLTF('/models/room.glb')
  return <primitive object={scene} />
}
