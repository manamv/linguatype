import { useState, useEffect, useRef } from 'react'

/**
 * Lightweight hook that detects active Caps Lock or non-English keyboard layout (e.g. Russian Cyrillic)
 * while typing, without adding extra re-renders on normal English keystrokes.
 */
export function useKeyboardLayoutGuard(enabled: boolean = true) {
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [wrongLayout, setWrongLayout] = useState(false)
  const wrongLayoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setCapsLockOn(false)
      setWrongLayout(false)
      return
    }

    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (typeof e.getModifierState === 'function') {
        const nextCaps = e.getModifierState('CapsLock')
        setCapsLockOn(prev => (prev !== nextCaps ? nextCaps : prev))
      }

      if (e.type === 'keydown' && e.key.length === 1) {
        if (/[\u0400-\u04FF]/.test(e.key)) {
          setWrongLayout(true)
          if (wrongLayoutTimerRef.current) clearTimeout(wrongLayoutTimerRef.current)
          wrongLayoutTimerRef.current = setTimeout(() => {
            setWrongLayout(false)
          }, 3500)
        } else if (/[a-zA-Z]/.test(e.key)) {
          setWrongLayout(prev => (prev ? false : prev))
          if (wrongLayoutTimerRef.current) {
            clearTimeout(wrongLayoutTimerRef.current)
            wrongLayoutTimerRef.current = null
          }
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
      if (wrongLayoutTimerRef.current) clearTimeout(wrongLayoutTimerRef.current)
    }
  }, [enabled])

  return { capsLockOn, wrongLayout }
}
