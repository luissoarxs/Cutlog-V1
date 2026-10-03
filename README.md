# Cutlog — painel de edição de vídeos

1. Supabase: crie o projeto, rode `supabase/migrations/0001_init.sql` no SQL Editor.
2. Authentication → Providers → Email: **desative "Allow new users to sign up"**. Crie seu usuário em Authentication → Users (marque "Auto confirm").
3. `cp .env.example .env.local` e preencha URL e anon key (Settings → API).
4. `npm install && npm run dev` → http://localhost:3000
5. Deploy: importe o repositório na Vercel e repita as 2 variáveis de ambiente.

Marca (nome, logo, cor): `src/config/brand.ts`.
