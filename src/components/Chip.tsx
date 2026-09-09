import type { ReactNode } from 'react'
import type { AccentGroup } from '../lib/constants'

interface ChipProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  accent?: AccentGroup
}

export function Chip({ active, onClick, children, accent }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip${active ? ' chip-active' : ''}`}
      data-accent={accent}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
