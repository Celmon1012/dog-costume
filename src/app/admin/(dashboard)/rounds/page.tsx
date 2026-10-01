import { RoundControls } from "@/components/admin/round-controls";
import { RoundRankings } from "@/components/admin/round-rankings";
import type { RoundStatus } from "@/actions/rounds";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminRoundsPage() {
  const supabase = await createClient();

  const [{ data: roundRows }, { data: settings }, { data: dogs }, { data: roundVotes }] =
    await Promise.all([
      supabase.from("rounds").select("round_number, status"),
      supabase
        .from("site_settings")
        .select("voting_open")
        .eq("id", "default")
        .maybeSingle(),
      supabase
        .from("dogs")
        .select("id, unique_id, dog_name, photo_url, costume_description, round_number"),
      supabase.from("round_votes").select("dog_id, round_number"),
    ]);

  const voteCounts = new Map<string, number>();
  for (const vote of roundVotes ?? []) {
    voteCounts.set(vote.dog_id as string, (voteCounts.get(vote.dog_id as string) ?? 0) + 1);
  }

  const countByRound = new Map<number, number>();
  const dogsByRound = new Map<number, typeof dogs>();
  for (const dog of dogs ?? []) {
    const n = dog.round_number as number;
    countByRound.set(n, (countByRound.get(n) ?? 0) + 1);
    const list = dogsByRound.get(n) ?? [];
    list.push(dog);
    dogsByRound.set(n, list);
  }

  const maxRoundFromDogs = [...countByRound.keys()].reduce(
    (max, n) => Math.max(max, n),
    1,
  );
  const maxRoundFromTable = (roundRows ?? []).reduce(
    (max, r) => Math.max(max, r.round_number as number),
    0,
  );
  const maxRound = Math.max(maxRoundFromDogs, maxRoundFromTable, 1);

  const rounds = Array.from({ length: maxRound }, (_, i) => {
    const roundNumber = i + 1;
    const row = (roundRows ?? []).find((r) => r.round_number === roundNumber);
    return {
      roundNumber,
      status: (row?.status as RoundStatus) ?? "CLOSED",
      dogCount: countByRound.get(roundNumber) ?? 0,
    };
  });

  const rankedRounds = rounds.map((round) => ({
    roundNumber: round.roundNumber,
    status: round.status,
    dogs: [...(dogsByRound.get(round.roundNumber) ?? [])]
      .map((dog) => ({
        id: dog.id as string,
        uniqueId: dog.unique_id as string,
        dogName: dog.dog_name as string,
        photoUrl: (dog.photo_url as string) ?? "",
        costumeDescription: dog.costume_description as string,
        votes: voteCounts.get(dog.id as string) ?? 0,
      }))
      .sort((a, b) => b.votes - a.votes || a.uniqueId.localeCompare(b.uniqueId)),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Round management</h1>
        <p className="text-slate-600">
          Open one round at a time. Rankings below show introduction votes so
          you can pick finalists easily.
        </p>
      </div>
      <RoundControls
        rounds={rounds}
        votingOpen={settings?.voting_open ?? false}
      />
      <RoundRankings rounds={rankedRounds} />
    </div>
  );
}
