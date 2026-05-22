import { useGLTF } from '@react-three/drei'

export function Psp(): React.JSX.Element {
  const { scene } = useGLTF('/models/psp.glb')
  return <primitive object={scene} />
}