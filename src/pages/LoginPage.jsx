import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン画面
export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } = await signIn(email, password)
    setSubmitting(false)

    if (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
      return
    }
    // 成功したら物件一覧へ遷移
    navigate('/properties', { replace: true })
  }

  return (
    <main className="auth">
      <h1>ログイン</h1>
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

        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="message error" role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      <p className="auth-link">
        アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
      </p>
    </main>
  )
}
