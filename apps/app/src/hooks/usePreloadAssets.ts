import { useGLTF } from '@react-three/drei'

export function usePreloadAssets(): void {
  useGLTF.preload('/models/room.glb')
  useGLTF.preload('/models/desk.glb')
  useGLTF.preload('/models/monitor.glb')
  useGLTF.preload('/models/psp.glb')
}
