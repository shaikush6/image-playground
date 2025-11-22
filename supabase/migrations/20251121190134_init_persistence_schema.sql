-- Enable required extensions for UUID generation
create extension if not exists "pgcrypto";

-- Sessions capture persisted UI state per browser/device
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text not null unique,
  mode text not null default 'color',
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Generated assets from any path (color, product, invitation, etc.)
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  session_key text references public.sessions(session_key) on delete set null,
  app_mode text not null default 'color',
  kind text not null,
  source text not null,
  url text,
  data_url text,
  prompt text,
  metadata jsonb default '{}'::jsonb,
  palette jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists assets_session_key_idx on public.assets (session_key);
create index if not exists assets_mode_idx on public.assets (app_mode);

-- Invitation/product templates that can be referenced as presets
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

-- Utility trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
before update on public.sessions
for each row
execute function public.handle_updated_at();
