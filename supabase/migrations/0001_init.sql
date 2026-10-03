-- Rode no SQL Editor do Supabase. Todas as tabelas: RLS ativo, acesso só ao dono.
create extension if not exists pgcrypto;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null, brand text, phone text, email text,
  default_video_price numeric(12,2) not null default 0,
  payment_day smallint check (payment_day between 1 and 31),
  notes text, active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict, -- preserva histórico
  title text not null, location text, description text, notes text, drive_url text,
  status text not null default 'a_fazer' check (status in ('a_fazer','em_edicao','editado','pronto_para_postar','publicado')),
  published_at date,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  due_date date not null, paid_at timestamptz, -- "atrasado" é calculado: paid_at nulo e due_date < hoje
  created_at timestamptz not null default now()
);
create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  platform text not null check (platform in ('instagram','tiktok','youtube','facebook','outra')),
  url text, views integer not null default 0, likes integer not null default 0, shares integer not null default 0,
  posted_at date, created_at timestamptz not null default now()
);
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  message text not null, created_at timestamptz not null default now()
);

create index on public.videos (client_id);
create index on public.payments (due_date) where paid_at is null;
create index on public.social_posts (video_id);

do $$ declare t text; begin
  foreach t in array array['clients','videos','payments','social_posts','activity_log'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy owner_all on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;
