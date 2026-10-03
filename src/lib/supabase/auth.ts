import { redirect } from "next/navigation";
import { createClient } from "./server";
// Toda server action passa por aqui: exige usuário logado.
export async function requireDb() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  return db;
}
