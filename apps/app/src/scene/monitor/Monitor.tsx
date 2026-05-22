import { useGLTF } from '@react-three/drei'

export function Monitor(): React.JSX.Element {
  const { scene } = useGLTF('/models/monitor.glb')
  return <primitive object={scene} />
}