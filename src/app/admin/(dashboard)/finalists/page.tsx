import { FinalistPicker } from "@/components/admin/finalist-picker";
import { mapDog, DOG_SELECT, type DogRecord } from "@/lib/supabase/map-dog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminFinalistsPage() {
  const supabase = await createClient();
  const [{ data }, { data: roundVotes }] = await Promise.all([
    supabase
      .from("dogs")
      .select(DOG_SELECT)
      .order("round_number", { ascending: true })
      .order("display_order", { ascending: true }),
    supabase.from("round_votes").select("dog_id, round_number"),
  ]);

  const counts = new Map<string, number>();
  for (const vote of roundVotes ?? []) {
    counts.set(vote.dog_id, (counts.get(vote.dog_id) ?? 0) + 1);
  }

  const dogs = ((data ?? []) as DogRecord[])
    .map(mapDog)
    .map((dog) => ({
      ...dog,
      roundVoteCount: counts.get(dog.id) ?? 0,
    }))
    .sort((a, b) => b.roundVoteCount - a.roundVoteCount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finalist management</h1>
        <p className="text-slate-600">
          Sorted by introduction (round) votes. Check the dogs that should
          appear on the prize Vote page.
        </p>
      </div>
      <FinalistPicker dogs={dogs} />
    </div>
  );
}
