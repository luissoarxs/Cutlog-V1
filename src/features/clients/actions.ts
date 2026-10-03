"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseClientForm } from "./schema";

export type FormState = { error?: string; fields?: Record<string, string> };

async function ctx() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}
const log = (s: Awaited<ReturnType<typeof ctx>>, message: string) => s.from("activity_log").insert({ message });

export async function createClientAction(_: FormState, fd: FormData): Promise<FormState> {
  const p = parseClientForm(fd);
  if (!p.ok) return { fields: p.fields };
  const s = await ctx();
  const { data, error } = await s.from("clients").insert(p.data).select("id").single();
  if (error || !data) return { error: "Não foi possível salvar. Tente de novo." };
  await log(s, `Você adicionou o cliente ${p.data.name}`);
  revalidatePath("/", "layout");
  redirect(`/clientes/${data.id}?ok=criado`);
}

export async function updateClientAction(id: string, _: FormState, fd: FormData): Promise<FormState> {
  const p = parseClientForm(fd);
  if (!p.ok) return { fields: p.fields };
  const s = await ctx();
  const { error } = await s.from("clients").update(p.data).eq("id", id);
  if (error) return { error: "Não foi possível salvar. Tente de novo." };
  await log(s, `Você editou o cliente ${p.data.name}`);
  revalidatePath("/", "layout");
  redirect(`/clientes/${id}?ok=atualizado`);
}

export async function setActiveAction(id: string, active: boolean) {
  const s = await ctx();
  const { data: c } = await s.from("clients").update({ active }).eq("id", id).select("name").single();
  await log(s, `Você ${active ? "reativou" : "inativou"} o cliente ${c?.name ?? ""}`);
  revalidatePath("/", "layout");
  redirect(`/clientes/${id}?ok=${active ? "reativado" : "inativado"}`);
}

export async function deleteClientAction(id: string) {
  const s = await ctx();
  const { count } = await s.from("videos").select("id", { count: "exact", head: true }).eq("client_id", id);
  if (count) redirect(`/clientes/${id}?ok=erro_excluir`);
  const { error } = await s.from("clients").delete().eq("id", id);
  if (error) redirect(`/clientes/${id}?ok=erro_excluir`);
  revalidatePath("/", "layout");
  redirect("/clientes?ok=excluido");
}
