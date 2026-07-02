import { create } from 'zustand'
import type { Camera } from '../scene/camera/Camera'

export type CameraMode = 'intro' | 'desk' | 'monitor' | 'psp'

interface CameraState {
  mode: CameraMode
  inTransition: boolean
  camera: Camera | null
  setMode: (mode: CameraMode) => void
  setInTransition: (inTransition: boolean) => void
  setCamera: (camera: Camera) => void
}

const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const useCameraStore = create<CameraState>()((set) => ({
  mode: isMobile ? 'desk' : 'intro',
  inTransition: false,
  camera: null,
  setMode: (mode) => set({ mode, inTransition: true }),
  setInTransition: (inTransition) => set({ inTransition }),
  setCamera: (camera) => set({ camera }),
}))
