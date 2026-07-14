import { ReactNode } from 'react'
import { tokens } from '../../theme/tokens'

// Consistent content wrapper for every page: max width, padding, scroll area.
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div
      className="ruyi-scroll"
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: tokens.layout.contentPad,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  )
}
