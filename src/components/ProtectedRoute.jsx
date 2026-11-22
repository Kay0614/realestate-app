import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログインが必要なページを保護する。未ログインならログイン画面へリダイレクト
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="status">読み込み中...</p>
  if (!session) return <Navigate to="/login" replace />

  return children
}

// ログイン・会員登録画面用。ログイン済みなら物件一覧へリダイレクト
export function GuestRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="status">読み込み中...</p>
  if (session) return <Navigate to="/properties" replace />

  return children
}
