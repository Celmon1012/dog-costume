import { DogLoader } from "@/components/ui/dog-loader";

export default function PublicLoading() {
  return (
    <div className="fixed inset-0 z-[80] flex h-dvh w-screen items-center justify-center bg-[#f6f1ea]/80 backdrop-blur-[2px]">
      <DogLoader size="lg" label="Loading contest…" />
    </div>
  );
}
