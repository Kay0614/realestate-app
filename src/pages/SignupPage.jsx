import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 会員登録画面
export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(`会員登録に失敗しました：${error.message}`)
      return
    }

    // Supabaseで「メール確認」が有効な場合はセッションが返らないため、案内を表示する
    if (!data.session) {
      setNotice('確認メールを送信しました。メール内のリンクを開いてから、ログインしてください。')
      return
    }
    // メール確認が無効な場合はそのままログイン状態になるので物件一覧へ
    navigate('/properties', { replace: true })
  }

  return (
    <main className="auth">
      <h1>会員登録</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">パスワード（6文字以上）</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="message error" role="alert">{error}</p>}
        {notice && <p className="message notice" role="status">{notice}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>
      </form>
      <p className="auth-link">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </main>
  )
}
