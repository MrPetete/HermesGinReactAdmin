import { Card, CardProps } from 'antd'
import { forwardRef } from 'react'

type GlassCardProps = CardProps & {
  strong?: boolean
  lift?: boolean
}

// Frosted-glass surface primitive. Tokens drive look; swap tokens to rebrand.
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { strong, lift = true, className = '', styles, ...rest },
  ref,
) {
  const cls = [
    'ruyi-glass',
    strong ? 'ruyi-glass-strong' : '',
    lift ? 'ruyi-lift' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Card
      ref={ref as never}
      className={cls}
      styles={{ body: { padding: 18, ...styles?.body }, ...styles }}
      {...rest}
    />
  )
})

export default GlassCard
