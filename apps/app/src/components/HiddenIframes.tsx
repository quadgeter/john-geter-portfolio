import type { MessageBus } from '../hooks/useMessageBus'

const QUADOS_URL = import.meta.env.VITE_QUADOS_URL || 'http://localhost:3001'
const GAMEOS_URL = import.meta.env.VITE_GAMEOS_URL || 'http://localhost:3002'

const IFRAME_STYLE: React.CSSProperties = {
  position: 'fixed',
  width: 1,
  height: 1,
  top: -9999,
  left: -9999,
  border: 'none',
  opacity: 0,
  pointerEvents: 'none',
}

interface HiddenIframesProps {
  bus: MessageBus
}

export function HiddenIframes({ bus }: HiddenIframesProps): React.JSX.Element {
  return (
    <>
      <iframe
        ref={bus.monitorIframeRef}
        src={QUADOS_URL}
        title="quadOS"
        style={IFRAME_STYLE}
        sandbox="allow-scripts allow-same-origin"
      />
      <iframe
        ref={bus.pspIframeRef}
        src={GAMEOS_URL}
        title="gameOS"
        style={IFRAME_STYLE}
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
