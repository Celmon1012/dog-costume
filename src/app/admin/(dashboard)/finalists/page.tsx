import { FinalistPicker } from "@/components/admin/finalist-picker";
import { mapDog, DOG_SELECT, type DogRecord } from "@/lib/supabase/map-dog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminFinalistsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dogs")
    .select(DOG_SELECT)
    .order("unique_id", { ascending: true });

  const dogs = ((data ?? []) as DogRecord[]).map(mapDog);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finalist management</h1>
        <p className="text-slate-600">
          Only selected dogs appear on the public vote page.
        </p>
      </div>
      <FinalistPicker dogs={dogs} />
    </div>
  );
}
