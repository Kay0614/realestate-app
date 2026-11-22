import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'

// 家賃を「¥128,000」の形式に整形する
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  // 新規登録フォームを開いているか
  const [isCreating, setIsCreating] = useState(false)
  // 編集中の物件ID（未編集なら null）
  const [editingId, setEditingId] = useState(null)
  // 削除処理中の物件ID（ボタンを二重に押せないようにする）
  const [deletingId, setDeletingId] = useState(null)
  // 削除に失敗したときのメッセージ
  const [actionError, setActionError] = useState('')

  // Supabaseから物件一覧を取得する（SELECT）
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      setProperties(await fetchProperties())
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // 画面表示時に一覧を読み込む
  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  // 新規登録（INSERT）：成功したら一覧の先頭に追加してフォームを閉じる
  // 失敗時はエラーを投げ、フォーム側でメッセージを表示する
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
    setIsCreating(false)
  }

  // 編集（UPDATE）：成功したら一覧の該当物件を置き換えて編集を終了する
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除（DELETE）：確認ダイアログでOKされたときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？この操作は取り消せません。`)) return

    setActionError('')
    setDeletingId(property.id)
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="header">
        <p className="header-title">不動産管理</p>
        <div className="header-user">
          <span className="header-email">{user?.email}</span>
          <button type="button" className="button-secondary" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="properties">
        <div className="page-heading">
          <h1>物件一覧</h1>
          {!isCreating && (
            <button type="button" onClick={() => setIsCreating(true)}>
              ＋ 物件を登録
            </button>
          )}
        </div>

        {/* 新規登録フォーム */}
        {isCreating && (
          <PropertyForm
            title="物件を登録"
            submitLabel="登録する"
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {actionError && <p className="message error banner" role="alert">{actionError}</p>}

        {/* 読み込み中・エラー・0件・一覧 の表示切り替え */}
        {loading ? (
          <p className="status">読み込み中...</p>
        ) : loadError ? (
          <div className="message error banner" role="alert">
            <p>{loadError}</p>
            <button type="button" className="button-secondary" onClick={loadProperties}>
              再読み込み
            </button>
          </div>
        ) : properties.length === 0 ? (
          <p className="empty">
            まだ物件が登録されていません。「＋ 物件を登録」から追加してください。
          </p>
        ) : (
          <ul className="property-list">
            {properties.map((property) => (
              <li key={property.id} className="property-card">
                {editingId === property.id ? (
                  // 編集フォーム（カードの中身を差し替える）
                  <PropertyForm
                    title="物件を編集"
                    submitLabel="更新する"
                    initialValues={property}
                    onSubmit={(values) => handleUpdate(property.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="property-card-header">
                      <h2 className="property-name">{property.name}</h2>
                      <span className="layout-badge">{property.layout}</span>
                    </div>
                    <dl className="property-info">
                      <div>
                        <dt>家賃</dt>
                        <dd className="property-rent">{formatRent(property.rent)}／月</dd>
                      </div>
                      <div>
                        <dt>エリア</dt>
                        <dd>{property.area}</dd>
                      </div>
                    </dl>
                    <div className="property-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => setEditingId(property.id)}
                        aria-label={`${property.name}を編集`}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() => handleDelete(property)}
                        disabled={deletingId === property.id}
                        aria-label={`${property.name}を削除`}
                      >
                        {deletingId === property.id ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
