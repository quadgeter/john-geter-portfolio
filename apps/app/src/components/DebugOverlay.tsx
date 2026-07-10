import { useCameraStore } from '../store/useCameraStore'
import { useScreenStore } from '../store/useScreenStore'
import type { ScreenState } from '@repo/shared-types/message-types'

const SCREEN_STATES: ScreenState[] = ['off', 'loading', 'ready', 'on', 'sleep', 'error']

const btnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '4px 8px',
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: 12,
}

const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.5)' }

function nextState(current: ScreenState): ScreenState {
  const i = SCREEN_STATES.indexOf(current)
  return SCREEN_STATES[(i + 1) % SCREEN_STATES.length]!
}

export function DebugOverlay(): React.JSX.Element | null {
  if (import.meta.env.PROD) return null

  const mode = useCameraStore((s) => s.mode)
  const setMode = useCameraStore((s) => s.setMode)
  const monitorState = useScreenStore((s) => s.monitorState)
  const pspState = useScreenStore((s) => s.pspState)
  const osFocused = useScreenStore((s) => s.osFocused)
  const setMonitorState = useScreenStore((s) => s.setMonitorState)
  const setPspState = useScreenStore((s) => s.setPspState)

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: 'monospace',
        fontSize: 12,
      }}
    >
      <span style={labelStyle}>mode: {mode}</span>
      <button style={btnStyle} onClick={() => setMonitorState(nextState(monitorState))}>
        monitor: {monitorState}
      </button>
      <button style={btnStyle} onClick={() => setPspState(nextState(pspState))}>
        psp: {pspState}
      </button>
      <span style={labelStyle}>focus: {osFocused ? 'locked' : 'free'}</span>
      <button onClick={() => setMode('intro')} style={btnStyle}>
        Reset
      </button>
    </div>
  )
}
