import { RoundVoteGrid } from "@/components/contest/round-vote-grid";
import { createClient } from "@/lib/supabase/server";
import { getVoterId } from "@/lib/voter";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ContestPage() {
  const supabase = await createClient();
  const voterId = await getVoterId();

  const [{ data: rounds }, { data: allDogs }] = await Promise.all([
    supabase
      .from("rounds")
      .select("round_number, status")
      .in("status", ["OPEN", "COMPLETED"])
      .order("round_number", { ascending: true }),
    supabase
      .from("dogs")
      .select(
        "id, unique_id, dog_name, costume_description, photo_url, round_number, display_order",
      )
      .order("round_number", { ascending: true })
      .order("display_order", { ascending: true }),
  ]);

  const liveRoundNumber = (rounds ?? []).find((round) => round.status === "OPEN")
    ?.round_number as number | undefined;

  let votedDogId: string | null = null;
  if (voterId && liveRoundNumber) {
    const { data } = await supabase.rpc("get_round_vote", {
      p_round: liveRoundNumber,
      p_voter: voterId,
    });
    if (typeof data === "string" && data) votedDogId = data;
  }

  const visibleRoundNumbers = new Set(
    (rounds ?? []).map((round) => round.round_number as number),
  );
  const dogsByRound = new Map<number, NonNullable<typeof allDogs>>();
  for (const dog of allDogs ?? []) {
    if (!visibleRoundNumbers.has(dog.round_number)) continue;
    const list = dogsByRound.get(dog.round_number) ?? [];
    list.push(dog);
    dogsByRound.set(dog.round_number, list);
  }

  const sections = (rounds ?? []).map((round) => ({
    roundNumber: round.round_number as number,
    status: round.status as string,
    dogs: dogsByRound.get(round.round_number as number) ?? [],
  }));

  const liveRound = sections.find((section) => section.status === "OPEN");

  return (
    <div className="bg-[#f6f1ea] pb-12">
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image
          src="/images/hero-dogs.jpg"
          alt="Costume contest dogs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-6xl text-white">
            <h1 className="text-3xl font-bold">Contestants</h1>
            <p className="mt-1 text-sm text-white/90">
              {liveRound
                ? `Round ${liveRound.roundNumber} is on stage. Vote for your favorite in this round.`
                : sections.length
                  ? "Completed rounds stay visible. Prize voting is on the Vote page after finalists are picked."
                  : "No round is open yet. Check back when the emcee starts Round 1."}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        {!sections.length ? (
          <p className="rounded-lg border border-dashed border-orange-200 bg-white/70 p-8 text-center text-slate-600">
            Contestants appear after the emcee opens a round.
          </p>
        ) : (
          sections.map((section) => (
            <section key={section.roundNumber} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Round {section.roundNumber}
                  {section.status === "OPEN" ? " · live" : " · completed"}
                </h2>
                <p className="text-sm text-slate-600">
                  {section.dogs.length}{" "}
                  {section.dogs.length === 1 ? "contestant" : "contestants"}
                </p>
              </div>
              {!section.dogs.length ? (
                <p className="rounded-lg border border-dashed border-orange-200 bg-white/70 p-6 text-center text-slate-600">
                  No dogs in this round yet.
                </p>
              ) : (
                <RoundVoteGrid
                  dogs={section.dogs}
                  roundNumber={section.roundNumber}
                  votingOpen={section.status === "OPEN"}
                  votedDogId={
                    section.status === "OPEN" ? votedDogId : null
                  }
                />
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
