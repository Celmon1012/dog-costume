import { DogLoader } from "@/components/ui/dog-loader";

export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-[80] flex h-dvh w-screen items-center justify-center bg-slate-50/80 backdrop-blur-[2px]">
      <DogLoader size="lg" label="Loading admin…" />
    </div>
  );
}
