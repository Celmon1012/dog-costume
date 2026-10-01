import { Badge } from "@/components/ui/badge";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: votes }, { data: dogs }] =
    await Promise.all([
      supabase
        .from("prize_categories")
        .select("id, name, subcategory, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("votes").select("dog_id, prize_category_id"),
      supabase
        .from("dogs")
        .select("id, unique_id, dog_name, photo_url, costume_description")
        .order("unique_id", { ascending: true }),
    ]);

  const results = (categories ?? []).map((category) => {
    const tallies = (dogs ?? []).map((dog) => {
      const voteCount = (votes ?? []).filter(
        (vote) =>
          vote.prize_category_id === category.id && vote.dog_id === dog.id,
      ).length;
      return {
        uniqueId: dog.unique_id,
        dogName: dog.dog_name,
        photoUrl: dog.photo_url,
        costumeDescription: dog.costume_description,
        votes: voteCount,
      };
    }).sort((a, b) => b.votes - a.votes);
    const winner = tallies.find((row) => row.votes > 0) ?? null;
    return {
      category,
      winner,
      tallies,
      totalVotes: tallies.reduce((sum, row) => sum + row.votes, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-slate-600">
          Admin-only tallies. Winners are the dogs with the most votes in each
          prize category.
        </p>
      </div>
      {results.map(({ category, winner, tallies, totalVotes }) => (
        <section key={category.id} className="rounded-xl border bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-sm text-slate-600">{category.subcategory}</p>
            </div>
            <p className="text-sm text-slate-500">{totalVotes} total votes</p>
          </div>
          {winner ? (
            <p className="mb-4 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-900">
              Winner: <Badge variant="outline" className="mx-1">{winner.uniqueId}</Badge>
              <strong>{winner.dogName}</strong> · {winner.votes} vote
              {winner.votes === 1 ? "" : "s"}
            </p>
          ) : (
            <p className="mb-4 text-sm text-slate-400">No votes yet</p>
          )}
          <div className="space-y-2">
            {tallies.map((row) => (
              <div
                key={row.uniqueId}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-2"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-orange-50">
                  <DogPhoto
                    src={row.photoUrl}
                    alt={row.dogName}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    <span className="mr-2 text-orange-800">{row.uniqueId}</span>
                    {row.dogName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {row.costumeDescription}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{row.votes}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
