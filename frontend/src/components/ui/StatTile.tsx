import { Statistic, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import GlassCard from './GlassCard'

const { Text } = Typography

export interface StatTileProps {
  title: string
  value: number
  suffix?: string
  delta: number
  icon?: React.ReactNode
  delay?: number
}

// Reusable KPI tile. Used by Dashboard and any feature that shows metrics.
export default function StatTile({ title, value, suffix, delta, icon, delay = 0 }: StatTileProps) {
  const up = delta >= 0
  const accent = up ? tokens.color.jade : '#e08a8a'
  return (
    <GlassCard style={{ animationDelay: `${delay}ms` }} styles={{ body: { padding: 18 } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ color: tokens.color.textSecondary, fontSize: 13 }}>{title}</Text>
          <div style={{ marginTop: 8 }}>
            <Statistic
              value={value}
              suffix={suffix}
              valueStyle={{ color: tokens.color.text, fontWeight: 700, fontSize: 26 }}
            />
          </div>
        </div>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              fontSize: 20,
              color: tokens.color.jade,
              background: 'rgba(57, 197, 187, 0.12)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: accent }}>
        {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(delta)}% 较上周
      </div>
    </GlassCard>
  )
}
