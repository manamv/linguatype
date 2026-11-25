import React from 'react'
import { AlertTriangle, Globe } from 'lucide-react'

interface KeyboardGuardPillProps {
  capsLockOn: boolean
  wrongLayout: boolean
}

export const KeyboardGuardPill: React.FC<KeyboardGuardPillProps> = ({ capsLockOn, wrongLayout }) => {
  if (!capsLockOn && !wrongLayout) return null

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 animate-fade-in"
      role="status"
      aria-live="polite"
      data-testid="keyboard-warning-pill"
    >
      {capsLockOn && (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-[11px] font-mono font-medium shadow-md shadow-amber-500/10"
          data-testid="capslock-warning"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Включён Caps Lock — отключите для точной печати</span>
        </span>
      )}
      {wrongLayout && (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-200 text-[11px] font-mono font-medium shadow-md shadow-sky-500/10"
          data-testid="wrong-layout-warning"
        >
          <Globe className="w-3.5 h-3.5 shrink-0 text-sky-400" />
          <span>Неправильная раскладка — переключите на английскую (EN)</span>
        </span>
      )}
    </div>
  )
}
