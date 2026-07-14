import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ruyiTechBlue } from './theme'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <ConfigProvider theme={ruyiTechBlue} locale={zhCN}>
      <AntApp>
        <Dashboard />
      </AntApp>
    </ConfigProvider>
  )
}
