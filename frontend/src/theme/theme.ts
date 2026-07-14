import type { ThemeConfig } from 'antd'
import { tokens } from './tokens'

export const ruyiTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.color.primary,
    colorInfo: tokens.color.primary,
    colorLink: tokens.color.cyan,
    colorBgLayout: 'transparent', // canvas painted by AuroraBackground
    colorBgContainer: tokens.glass.bg,
    colorBgElevated: tokens.glass.bgStrong,
    colorBorder: tokens.color.border,
    colorBorderSecondary: tokens.color.border,
    colorText: tokens.color.text,
    colorTextSecondary: tokens.color.textSecondary,
    colorTextTertiary: tokens.color.textTertiary,
    borderRadius: tokens.radius.md,
    fontSize: 14,
    fontFamily:
      '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      headerBg: 'rgba(10, 20, 38, 0.72)',
      siderBg: 'rgba(10, 20, 38, 0.72)',
      bodyBg: 'transparent',
      headerHeight: tokens.layout.headerH,
      headerPadding: `0 ${tokens.layout.contentPad}px`,
    },
    Menu: {
      itemBg: 'transparent',
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(47, 111, 176, 0.35)',
      darkItemSelectedColor: '#ffffff',
      darkItemColor: tokens.color.textSecondary,
      darkItemHoverColor: '#ffffff',
      darkItemHoverBg: 'rgba(120, 170, 240, 0.10)',
      itemHeight: 44,
      iconSize: 16,
    },
    Card: {
      colorBgContainer: tokens.glass.bg,
      headerBg: 'transparent',
    },
    Statistic: {
      titleFontSize: 13,
    },
  },
}
