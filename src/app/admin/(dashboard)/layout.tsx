import Link from "next/link";
import { AdminNav } from "@/components/layout/admin-nav";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="text-lg font-semibold text-orange-900">
              Contest Admin
            </Link>
            <p className="text-sm text-slate-500">Manage dogs, rounds, and results</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminNav />
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
