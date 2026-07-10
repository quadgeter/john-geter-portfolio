import { useEffect, useCallback } from 'react'
import type { R3FToQuadOS, R3FToGameOS, QuadOSToR3F, GameOSToR3F, ScreenState } from '@repo/shared-types/message-types'
import { useScreenStore } from '../store/useScreenStore'
import { useCameraStore } from '../store/useCameraStore'
import { monitorIframeRef, pspIframeRef } from '../lib/iframeRefs'

const QUADOS_URL = import.meta.env.VITE_QUADOS_URL || 'http://localhost:3001'
const GAMEOS_URL = import.meta.env.VITE_GAMEOS_URL || 'http://localhost:3002'

const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

function getOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

const QUADOS_ORIGIN = getOrigin(QUADOS_URL)
const GAMEOS_ORIGIN = getOrigin(GAMEOS_URL)

export interface MessageBus {
  pspIframeRef: typeof pspIframeRef
}

function makeHandler(
  setState: (s: ScreenState) => void,
  setOsFocused: (f: boolean) => void,
) {
  return (msg: QuadOSToR3F | GameOSToR3F) => {
    switch (msg.type) {
      case 'ready': setState('ready'); break
      case 'boot': setState('on'); break
      case 'sleep': setState('sleep'); break
      case 'shutdown': setState('off'); break
      case 'reboot':
        setState('off')
        setTimeout(() => setState('loading'), 500)
        break
      case 'focus': setOsFocused(true); break
      case 'blur': setOsFocused(false); break
      case 'error': setState('error'); break
    }
  }
}

export function useMessageBus(): MessageBus {
  const sendToQuadOS = useCallback((msg: R3FToQuadOS) => {
    monitorIframeRef.current?.contentWindow?.postMessage(msg, QUADOS_ORIGIN)
  }, [])

  const sendToGameOS = useCallback((msg: R3FToGameOS) => {
    pspIframeRef.current?.contentWindow?.postMessage(msg, GAMEOS_ORIGIN)
  }, [])

  // ── Inbound message listener ──────────────────────────────
  useEffect(() => {
    const { setMonitorState, setPspState, setOsFocused } = useScreenStore.getState()
    const handleQuadOS = makeHandler(setMonitorState, setOsFocused)
    const handleGameOS = makeHandler(setPspState, setOsFocused)

    function handleMessage(event: MessageEvent): void {
      if (event.origin === QUADOS_ORIGIN) {
        handleQuadOS(event.data as QuadOSToR3F)
      } else if (event.origin === GAMEOS_ORIGIN) {
        handleGameOS(event.data as GameOSToR3F)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // ── Send `enter` when camera mode changes to monitor/psp ──
  useEffect(() => {
    const unsub = useCameraStore.subscribe((state, prev) => {
      if (state.mode === prev.mode) return

      const dims = { winWidth: window.innerWidth, winHeight: window.innerHeight }

      if (state.mode === 'monitor') {
        sendToQuadOS({ type: 'enter', ...dims, isMobile })
      } else if (state.mode === 'psp') {
        sendToGameOS({ type: 'enter', ...dims, isMobile })
      }
    })
    return unsub
  }, [sendToQuadOS, sendToGameOS])

  // ── Send `resize` on window resize while focused ──────────
  useEffect(() => {
    function handleResize(): void {
      const mode = useCameraStore.getState().mode
      const dims = { winWidth: window.innerWidth, winHeight: window.innerHeight }

      if (mode === 'monitor') {
        sendToQuadOS({ type: 'resize', ...dims })
      } else if (mode === 'psp') {
        sendToGameOS({ type: 'resize', ...dims })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sendToQuadOS, sendToGameOS])

  return { pspIframeRef }
}
