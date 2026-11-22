import { supabase } from './supabaseClient'

// 物件テーブルへのCRUD操作をまとめたモジュール
// ※ 自分の物件だけに絞り込む処理は、Supabase側のRLSポリシーが行う

const TABLE = 'properties'
// 画面で使う列だけを取得する
const COLUMNS = 'id, name, rent, area, layout, created_at, updated_at'

// Supabaseのエラーを、画面に出せる日本語のメッセージに変換する
function toError(error, action) {
  // テーブルが存在しない（SQLが未実行）
  if (error.code === 'PGRST205' || error.code === '42P01') {
    return new Error(
      '物件テーブルが見つかりません。Supabaseの SQL Editor で supabase/schema.sql を実行してください。'
    )
  }
  // 対象の行が無い（存在しない、またはRLSで他人の物件として弾かれた）
  if (error.code === 'PGRST116') {
    return new Error(`${action}対象の物件が見つからないか、操作する権限がありません。`)
  }
  return new Error(`${action}に失敗しました：${error.message}`)
}

// 一覧取得（SELECT）：新しく登録した順
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw toError(error, '物件の取得')
  return data
}

// 新規登録（INSERT）：user_id はDB側の既定値（auth.uid()）で自動設定される
export async function createProperty(values) {
  const { data, error } = await supabase.from(TABLE).insert(values).select(COLUMNS).single()

  if (error) throw toError(error, '物件の登録')
  return data
}

// 更新（UPDATE）
export async function updateProperty(id, values) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(values)
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw toError(error, '物件の更新')
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  // 削除した行を返してもらい、実際に消えたかを確認する
  const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select('id')

  if (error) throw toError(error, '物件の削除')
  if (data.length === 0) {
    throw new Error('削除対象の物件が見つからないか、操作する権限がありません。')
  }
}
