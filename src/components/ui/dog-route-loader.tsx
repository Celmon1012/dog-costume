"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DogLoader } from "@/components/ui/dog-loader";

export function DogRouteLoader() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setPending(false), 8000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === "_blank") return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (href.startsWith("http") && !href.includes(window.location.host)) return;
      const nextPath = href.startsWith("http")
        ? new URL(href).pathname
        : href.split("?")[0];
      if (nextPath === pathname) return;
      setPending(true);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f6f1ea]/75 backdrop-blur-[2px]">
      <div className="rounded-3xl bg-white px-10 py-8 shadow-xl ring-1 ring-orange-100">
        <DogLoader size="lg" label="Fetching the good dogs…" />
      </div>
    </div>
  );
}
