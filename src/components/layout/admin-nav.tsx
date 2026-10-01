"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/script", label: "MC script" },
  { href: "/admin/dogs", label: "Dogs" },
  { href: "/admin/rounds", label: "Rounds" },
  { href: "/admin/finalists", label: "Finalists" },
  { href: "/admin/results", label: "Results" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-900 hover:bg-orange-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
