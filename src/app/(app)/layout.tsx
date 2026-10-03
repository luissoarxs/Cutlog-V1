import { Suspense } from "react";
import { Flash } from "@/components/ui/flash";
import { PaymentPrompt } from "@/features/payments/payment-prompt";
import { duePayments } from "@/features/payments/queries";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../(auth)/login/actions";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileChrome } from "@/components/layout/bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <>
      <Sidebar email={user.email ?? ""} logout={logout} />
      <MobileChrome />
      <Suspense><Flash /></Suspense>
      <PaymentPrompt items={await duePayments()} />
      <main className="mx-auto max-w-6xl px-5 pb-28 pt-6 md:ml-64 md:px-10 md:pb-12 md:pt-10">{children}</main>
    </>
  );
}
