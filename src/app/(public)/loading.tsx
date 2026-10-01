import { DogLoader } from "@/components/ui/dog-loader";

export default function PublicLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <DogLoader size="lg" label="Loading contest…" />
    </div>
  );
}
