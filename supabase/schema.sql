-- Language Ledger schema
-- Run this in the Supabase SQL editor for your project.
-- Replaces the earlier generic "learning_items" table with the Study Journal model:
-- daily study sessions + a vocabulary list.

drop table if exists public.learning_items cascade;

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  language text not null,
  subjects text[] not null default '{}',
  duration_minutes integer not null check (duration_minutes > 0),
  notes text,
  session_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists study_sessions_user_id_idx on public.study_sessions (user_id);
create index if not exists study_sessions_session_date_idx on public.study_sessions (session_date);

alter table public.study_sessions enable row level security;

create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own study sessions"
  on public.study_sessions for delete
  using (auth.uid() = user_id);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  language text not null,
  subject text not null,
  word text not null,
  reading text,
  myanmar_translation text,
  remembered boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists vocabulary_user_id_idx on public.vocabulary (user_id);

alter table public.vocabulary enable row level security;

create policy "Users can view their own vocabulary"
  on public.vocabulary for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vocabulary"
  on public.vocabulary for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vocabulary"
  on public.vocabulary for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own vocabulary"
  on public.vocabulary for delete
  using (auth.uid() = user_id);
