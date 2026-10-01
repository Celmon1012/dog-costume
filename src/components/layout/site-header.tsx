import Link from "next/link";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/register", label: "Signup" },
  { href: "/contest", label: "Contestants" },
  { href: "/vote", label: "Vote" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <PawPrint className="h-6 w-6" />
          </span>
          <span className="hidden sm:inline">Dog Costume Contest</span>
          <span className="sm:hidden">Contest</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className="px-2 sm:px-4"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
