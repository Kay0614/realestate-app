import { useId, useState } from 'react'

// 間取りの入力候補（候補以外も自由に入力できる）
const LAYOUT_OPTIONS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K', '3DK', '3LDK', '4LDK']

const EMPTY_VALUES = { name: '', rent: '', area: '', layout: '' }

// 物件の登録・編集で共通して使うフォーム
// onSubmit は保存に失敗したらエラーを投げる想定（フォーム内にメッセージを表示する）
export default function PropertyForm({ title, submitLabel, initialValues, onSubmit, onCancel }) {
  // ラベルと入力欄を結びつけるための一意なID
  const id = useId()
  const [values, setValues] = useState(() => ({
    ...EMPTY_VALUES,
    ...initialValues,
    // 数値の家賃も入力欄では文字列として扱う
    rent: initialValues?.rent != null ? String(initialValues.rent) : '',
  }))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 入力内容を状態に反映する
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  // 送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 前後の空白を取り除き、家賃は数値に変換する
    const rent = Number(values.rent)
    const payload = {
      name: values.name.trim(),
      rent,
      area: values.area.trim(),
      layout: values.layout.trim(),
    }

    if (!payload.name || !payload.area || !payload.layout || values.rent.trim() === '') {
      setError('すべての項目を入力してください。')
      return
    }
    if (!Number.isInteger(rent) || rent < 0) {
      setError('家賃は0以上の整数（円）で入力してください。')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="property-form-title">{title}</h2>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={`${id}-name`}>物件名</label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            maxLength={100}
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor={`${id}-rent`}>家賃（円）</label>
          <input
            id={`${id}-rent`}
            name="rent"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.rent}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor={`${id}-area`}>エリア名</label>
          <input
            id={`${id}-area`}
            name="area"
            type="text"
            maxLength={100}
            placeholder="例：東京都渋谷区"
            value={values.area}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor={`${id}-layout`}>間取り</label>
          <input
            id={`${id}-layout`}
            name="layout"
            type="text"
            maxLength={20}
            placeholder="例：1LDK"
            list={`${id}-layout-options`}
            value={values.layout}
            onChange={handleChange}
            required
          />
          <datalist id={`${id}-layout-options`}>
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
      </div>

      {error && <p className="message error" role="alert">{error}</p>}

      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
