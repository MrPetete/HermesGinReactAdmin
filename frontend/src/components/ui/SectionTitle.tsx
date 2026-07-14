import { Typography } from 'antd'
import { tokens } from '../../theme/tokens'

const { Title, Text } = Typography

// Page/section heading with a small jade accent tick — consistent across features.
export default function SectionTitle({
  title,
  subtitle,
  extra,
}: {
  title: string
  subtitle?: string
  extra?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            width: 4,
            height: 20,
            borderRadius: 4,
            background: `linear-gradient(${tokens.color.jade}, ${tokens.color.cyan})`,
          }}
        />
        <div>
          <Title level={4} style={{ color: tokens.color.text, margin: 0, fontWeight: 600 }}>
            {title}
          </Title>
          {subtitle && (
            <Text style={{ color: tokens.color.textTertiary, fontSize: 12 }}>{subtitle}</Text>
          )}
        </div>
      </div>
      {extra}
    </div>
  )
}
