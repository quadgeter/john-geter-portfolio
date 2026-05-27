import { create } from 'zustand'

export type CameraMode = 'intro' | 'desk' | 'monitor'

interface CameraState {
  mode: CameraMode
  orbitEnabled: boolean
  setMode: (mode: CameraMode) => void
  setOrbitEnabled: (enabled: boolean) => void
}

const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const useCameraStore = create<CameraState>()((set) => ({
  mode: isMobile ? 'desk' : 'intro',
  orbitEnabled: isMobile,
  setMode: (mode) => set({ mode }),
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
}))
