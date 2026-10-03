-- Incremental: não altera nem apaga dados existentes.
alter table public.videos add column if not exists property text;                       -- fazenda / imóvel / projeto
alter table public.videos add column if not exists views integer not null default 0 check (views >= 0); -- visualizações manuais
create index if not exists videos_created_idx on public.videos (created_at desc);
create index if not exists payments_client_idx on public.payments (client_id);
create index if not exists payments_video_idx on public.payments (video_id);
create index if not exists activity_created_idx on public.activity_log (created_at desc);
