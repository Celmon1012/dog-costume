import { DogTable } from "@/components/admin/dog-table";
import { mapDog, type DogRecord } from "@/lib/supabase/map-dog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dogs")
    .select(
      "id, unique_id, dog_name, owner_name, owner_email, owner_phone, photo_url, costume_description, round_number, display_order, is_finalist",
    )
    .order("round_number", { ascending: true })
    .order("display_order", { ascending: true });

  const dogs = ((data ?? []) as DogRecord[]).map(mapDog);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dog management</h1>
        <p className="text-slate-600">Edit, delete, or mark finalists inline.</p>
      </div>
      <DogTable dogs={dogs} />
    </div>
  );
}
