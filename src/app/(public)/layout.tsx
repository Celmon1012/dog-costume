import { SiteHeader } from "@/components/layout/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <footer className="border-t border-orange-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Dog Costume Contest · event-day signup, lineup, and voting</p>
          <p>Tickets stay on montclair-dog.com</p>
        </div>
      </footer>
    </>
  );
}
