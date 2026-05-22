import { useGLTF } from '@react-three/drei'

export function Desk(): React.JSX.Element {
  const { scene } = useGLTF('/models/desk.glb')
  return <primitive object={scene} />
}
