-- =========================================================
-- 不動産管理アプリ：物件テーブルの作成
-- Supabaseダッシュボードの「SQL Editor」に貼り付けて実行する
-- （何度実行しても同じ状態になるように書いている）
-- =========================================================

-- ---------- 物件テーブル ----------
create table if not exists public.properties (
  -- 物件ID（自動採番のUUID）
  id uuid primary key default gen_random_uuid(),
  -- 登録したユーザー。未指定ならログイン中のユーザーIDが自動で入る
  -- ユーザーが削除されたら、そのユーザーの物件も削除する
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 物件名
  name text not null check (char_length(name) between 1 and 100),
  -- 家賃（円）
  rent integer not null check (rent >= 0),
  -- エリア名
  area text not null check (char_length(area) between 1 and 100),
  -- 間取り（例：1LDK）
  layout text not null check (char_length(layout) between 1 and 20),
  -- 作成日時・更新日時
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.properties is '物件情報';
comment on column public.properties.user_id is '登録したユーザーのID';
comment on column public.properties.name is '物件名';
comment on column public.properties.rent is '家賃（円）';
comment on column public.properties.area is 'エリア名';
comment on column public.properties.layout is '間取り（例：1LDK）';

-- ユーザーごとの絞り込み（RLS）を高速にするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- ---------- 更新日時の自動更新 ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------- RLS（行レベルセキュリティ） ----------
-- 有効にすると、ポリシーで許可した行以外は一切アクセスできなくなる
alter table public.properties enable row level security;

-- 再実行できるよう、既存のポリシーを削除してから作り直す
drop policy if exists "自分の物件のみ表示できる" on public.properties;
drop policy if exists "自分の物件のみ登録できる" on public.properties;
drop policy if exists "自分の物件のみ編集できる" on public.properties;
drop policy if exists "自分の物件のみ削除できる" on public.properties;

-- 表示（SELECT）：自分が登録した物件だけ
create policy "自分の物件のみ表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 登録（INSERT）：user_id が自分のIDの行だけ（他人になりすました登録を防ぐ）
create policy "自分の物件のみ登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 編集（UPDATE）：自分の物件だけ。編集後も自分の物件のまま（所有者の付け替えを防ぐ）
create policy "自分の物件のみ編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 削除（DELETE）：自分の物件だけ
create policy "自分の物件のみ削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
