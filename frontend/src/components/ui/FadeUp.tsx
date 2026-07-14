import { CSSProperties, ReactNode } from 'react'

// Entrance animation wrapper. Stagger via `delay` (ms).
export default function FadeUp({
  children,
  delay = 0,
  style,
  className = '',
}: {
  children: ReactNode
  delay?: number
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={`ruyi-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}
