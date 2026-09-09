import type { ReactNode } from 'react'

interface SectionProps {
  index: string
  title: string
  action?: ReactNode
  children: ReactNode
}

export function Section({ index, title, action, children }: SectionProps) {
  return (
    <section className="ledger-section">
      <div className="section-header">
        <span className="section-index">§{index}</span>
        <h2>{title}</h2>
        <span className="section-rule" />
        {action}
      </div>
      {children}
    </section>
  )
}
