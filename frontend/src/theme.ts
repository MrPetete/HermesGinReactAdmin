import type { ThemeConfig } from 'antd'

// Ruyi · Chinese-style Tech Blue
// Deep ink-blue canvas, jade/cyan accents, restrained gold for highlights.
export const ruyiTechBlue: ThemeConfig = {
  token: {
    colorPrimary: '#1f4e8c',          // ink blue
    colorInfo: '#1f4e8c',
    colorLink: '#2f6fb0',
    colorBgLayout: '#0e1b33',         // deep night-blue canvas
    colorBgContainer: '#13233f',      // panel
    colorBgElevated: '#16294a',
    colorBorder: '#24406b',
    colorBorderSecondary: '#1d3354',
    colorText: '#e8eef7',
    colorTextSecondary: '#a8b8d0',
    colorTextTertiary: '#7c8eaa',
    borderRadius: 8,
    fontSize: 14,
    fontFamily:
      '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#0b1730',
      siderBg: '#0b1730',
      bodyBg: '#0e1b33',
      headerHeight: 56,
      headerPadding: '0 20px',
    },
    Menu: {
      itemBg: 'transparent',
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: '#1f4e8c',
      darkItemSelectedColor: '#ffffff',
      darkItemColor: '#a8b8d0',
      darkItemHoverColor: '#ffffff',
      itemHeight: 44,
      iconSize: 16,
    },
    Card: {
      colorBgContainer: '#13233f',
      headerBg: 'transparent',
    },
    Statistic: {
      titleFontSize: 13,
    },
  },
}

// Accent helpers used across the app.
export const accent = {
  jade: '#39c5bb',     // 玉青 — jade cyan
  gold: '#d4af37',     // 金 — refined gold
  ink: '#0e1b33',      // 墨 — ink blue
  cloud: '#e8eef7',    // 云 — text
  cyan: '#4cc9f0',
}
