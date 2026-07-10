import { create } from 'zustand'
import type { ScreenState } from '@repo/shared-types/message-types'

export const INTENSITY_TARGET: Record<ScreenState, number> = {
  off: 0,
  loading: 0.3,
  ready: 0.5,
  on: 1,
  sleep: 0.15,
  error: 0.5,
}

interface ScreenStoreState {
  monitorState: ScreenState
  pspState: ScreenState
  osFocused: boolean
  setMonitorState: (state: ScreenState) => void
  setPspState: (state: ScreenState) => void
  setOsFocused: (focused: boolean) => void
}

export const useScreenStore = create<ScreenStoreState>()((set) => ({
  monitorState: 'off',
  pspState: 'off',
  osFocused: false,
  setMonitorState: (monitorState) => set({ monitorState }),
  setPspState: (pspState) => set({ pspState }),
  setOsFocused: (osFocused) => set({ osFocused }),
}))
