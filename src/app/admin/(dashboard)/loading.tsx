import { DogLoader } from "@/components/ui/dog-loader";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <DogLoader size="lg" label="Loading admin…" />
    </div>
  );
}
