// Design tokens — the single source of truth for the Ruyi visual language.
// Copy this file, change values, and the whole system rebrands.
// Colors are HEX; glass/motion/shadow are expressed as CSS-ready strings.

export const tokens = {
  color: {
    // Canvas — deep ink-blue (墨蓝)
    canvas: '#0a1426',
    canvasDeep: '#070f1d',
    panel: '#0f1d33',
    // Accents
    primary: '#2f6fb0',
    jade: '#39c5bb', // 玉青
    cyan: '#4cc9f0',
    gold: '#d4af37', // 金
    violet: '#7c6cf0',
    // Text
    text: '#e8eef7',
    textSecondary: '#9fb2cc',
    textTertiary: '#66789a',
    // Lines
    border: 'rgba(120, 160, 220, 0.16)',
    borderStrong: 'rgba(140, 180, 240, 0.28)',
  },

  // Aurora / mesh gradient stops (the living background)
  aurora: {
    c1: 'rgba(47, 111, 176, 0.55)',
    c2: 'rgba(57, 197, 187, 0.40)',
    c3: 'rgba(124, 108, 240, 0.38)',
    c4: 'rgba(76, 201, 240, 0.30)',
  },

  // Frosted glass surface
  glass: {
    bg: 'rgba(18, 32, 56, 0.55)',
    bgStrong: 'rgba(22, 38, 66, 0.72)',
    border: 'rgba(150, 190, 255, 0.18)',
    blur: '16px',
    blurStrong: '26px',
    // soft inner top highlight to fake a lit edge
    innerGlow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
  },

  // Elevation — glow-first, not heavy drop shadows (reads as "tech")
  shadow: {
    card: '0 8px 30px rgba(0, 0, 0, 0.35)',
    cardHover: '0 14px 44px rgba(47, 111, 176, 0.35)',
    glow: '0 0 0 1px rgba(120,170,240,0.12), 0 10px 40px rgba(20, 60, 120, 0.45)',
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    pill: 999,
  },

  motion: {
    fast: '180ms',
    base: '320ms',
    slow: '520ms',
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    // background drift loop
    drift: '28s',
  },

  layout: {
    headerH: 56,
    sidebarW: 220,
    sidebarWCollapsed: 64,
    contentPad: 20,
  },
} as const

export type Tokens = typeof tokens
