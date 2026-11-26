import React from 'react'
import { BlindTypingKeyboard } from './BlindTypingKeyboard'

interface VirtualKeyboardProps {
  activeChar?: string
  pressedKey?: string | null
  heatmapMode?: boolean
  heatmapData?: Record<string, number>
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = React.memo(props => {
  return (
    <div className="w-full relative">
      <BlindTypingKeyboard {...props} />
    </div>
  )
})
