import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/en_US'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#7c3aed' } }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </BrowserRouter>
)
