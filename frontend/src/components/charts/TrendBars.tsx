import { tokens } from '../../theme/tokens'

export interface TrendPoint {
  label: string
  value: number
}

// Lightweight CSS bar chart — no chart lib dependency. Drop-in for any feature.
export default function TrendBars({ data, height = 180 }: { data: TrendPoint[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height, padding: '10px 4px' }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div
            style={{
              height: `${(d.value / max) * (height - 28)}px`,
              background: `linear-gradient(180deg, ${tokens.color.cyan}, ${tokens.color.jade})`,
              borderRadius: '6px 6px 0 0',
              boxShadow: `0 0 18px rgba(76, 201, 240, 0.35)`,
              transition: 'height 0.5s var(--ruyi-ease)',
            }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: tokens.color.textSecondary }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}
