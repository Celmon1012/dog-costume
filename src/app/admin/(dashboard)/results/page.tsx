import { WinnerPicker } from "@/components/admin/winner-picker";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: votes }, { data: dogs }] =
    await Promise.all([
      supabase
        .from("prize_categories")
        .select("id, name, subcategory, sort_order, winner_dog_id")
        .order("sort_order", { ascending: true }),
      supabase.from("votes").select("dog_id, prize_category_id"),
      supabase
        .from("dogs")
        .select("id, unique_id, dog_name, photo_url, costume_description, is_finalist")
        .eq("is_finalist", true)
        .order("unique_id", { ascending: true }),
    ]);

  const results = (categories ?? []).map((category) => {
    const tallies = (dogs ?? [])
      .map((dog) => {
        const voteCount = (votes ?? []).filter(
          (vote) =>
            vote.prize_category_id === category.id && vote.dog_id === dog.id,
        ).length;
        return {
          id: dog.id as string,
          uniqueId: dog.unique_id as string,
          dogName: dog.dog_name as string,
          photoUrl: (dog.photo_url as string) ?? "",
          costumeDescription: dog.costume_description as string,
          votes: voteCount,
        };
      })
      .sort((a, b) => b.votes - a.votes || a.uniqueId.localeCompare(b.uniqueId));
    return {
      id: category.id as string,
      name: category.name as string,
      subcategory: category.subcategory as string,
      winnerDogId: (category.winner_dog_id as string | null) ?? null,
      tallies,
      totalVotes: tallies.reduce((sum, row) => sum + row.votes, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-slate-600">
          Finalists ranked by prize votes. Choose the winner of each category —
          the guest congratulations page goes live after all five are set.
        </p>
      </div>
      <WinnerPicker categories={results} />
    </div>
  );
}
