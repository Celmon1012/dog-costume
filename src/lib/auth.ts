import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.email) {
    redirect("/admin/login");
  }
  const allowed = getAdminEmails();
  if (!allowed.includes(user.email.toLowerCase())) {
    redirect("/admin/login?error=unauthorized");
  }
  return user;
}

export async function isAdminUser() {
  const user = await getSessionUser();
  if (!user?.email) return false;
  return getAdminEmails().includes(user.email.toLowerCase());
}
