import { useCameraStore } from '../store/useCameraStore'

export function IntroOverlay(): React.JSX.Element | null {
  const mode = useCameraStore((s) => s.mode)
  const setMode = useCameraStore((s) => s.setMode)

  if (mode !== 'intro') return null

  return (
    <div
      onClick={() => setMode('desk')}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '10vh',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      <p
        style={{
          margin: 0,
          color: 'rgba(255,255,255,0.55)',
          fontSize: '13px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Click anywhere to start
      </p>
    </div>
  )
}
