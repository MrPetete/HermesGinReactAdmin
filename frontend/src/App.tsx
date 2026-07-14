import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ruyiTheme } from './theme/theme'
import AppRouter from './router'

export default function App() {
  return (
    <ConfigProvider theme={ruyiTheme} locale={zhCN}>
      <AntApp>
        <AppRouter />
      </AntApp>
    </ConfigProvider>
  )
}
