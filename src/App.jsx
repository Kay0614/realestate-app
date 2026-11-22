import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PropertiesPage from './pages/PropertiesPage'

// ルーティング定義
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 未ログイン向けの画面 */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

          {/* ログインが必要な画面 */}
          <Route
            path="/properties"
            element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>}
          />

          {/* それ以外のURLは物件一覧へ（未ログインならログイン画面へ転送される） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
