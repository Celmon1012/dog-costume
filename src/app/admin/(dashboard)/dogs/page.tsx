import { DogTable } from "@/components/admin/dog-table";
import { mapDog, DOG_SELECT, type DogRecord } from "@/lib/supabase/map-dog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dogs")
    .select(DOG_SELECT)
    .order("round_number", { ascending: true })
    .order("display_order", { ascending: true });

  const dogs = ((data ?? []) as DogRecord[]).map(mapDog);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dog management</h1>
        <p className="text-slate-600">Edit walk-ins or fix signup details.</p>
      </div>
      <DogTable dogs={dogs} />
    </div>
  );
}
