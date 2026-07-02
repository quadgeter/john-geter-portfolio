import { useCameraStore } from '../store/useCameraStore'

export function DebugOverlay(): React.JSX.Element | null {
  if (import.meta.env.PROD) return null

  const mode = useCameraStore((s) => s.mode)
  const setMode = useCameraStore((s) => s.setMode)

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
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>mode: {mode}</span>
      <button
        onClick={() => setMode('intro')}
        style={{
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        Reset
      </button>
    </div>
  )
}
