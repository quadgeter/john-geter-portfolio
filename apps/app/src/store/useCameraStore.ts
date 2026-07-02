import { create } from 'zustand'

export type CameraMode = 'intro' | 'desk' | 'monitor' | 'psp'

interface CameraState {
  mode: CameraMode
  inTransition: boolean
  setMode: (mode: CameraMode) => void
  setInTransition: (inTransition: boolean) => void
}

const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const useCameraStore = create<CameraState>()((set) => ({
  mode: isMobile ? 'desk' : 'intro',
  inTransition: false,
  setMode: (mode) => set({ mode, inTransition: true }),
  setInTransition: (inTransition) => set({ inTransition }),
}))
