import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 家賃を「¥128,000」の形式に整形する
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面（ログイン必須）
export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
        <h1>物件一覧</h1>
        <ul className="property-list">
          {properties.map((property) => (
            <li key={property.id} className="property-card">
              <h2 className="property-name">{property.name}</h2>
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
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
