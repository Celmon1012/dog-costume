import { DogCard } from "@/components/dogs/dog-card";
import { PageBanner } from "@/components/layout/page-banner";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ContestPage() {
  const supabase = await createClient();

  const [{ data: rounds }, { data: allDogs }] = await Promise.all([
    supabase
      .from("rounds")
      .select("round_number, status")
      .order("round_number", { ascending: true }),
    supabase
      .from("dogs")
      .select(
        "id, unique_id, dog_name, costume_description, photo_url, round_number, display_order",
      )
      .order("round_number", { ascending: true })
      .order("display_order", { ascending: true }),
  ]);

  const dogsByRound = new Map<number, NonNullable<typeof allDogs>>();
  for (const dog of allDogs ?? []) {
    const list = dogsByRound.get(dog.round_number) ?? [];
    list.push(dog);
    dogsByRound.set(dog.round_number, list);
  }

  const roundNumbers = [
    ...new Set([
      ...(rounds ?? []).map((round) => round.round_number as number),
      ...dogsByRound.keys(),
    ]),
  ].sort((a, b) => a - b);

  const sections = roundNumbers.map((roundNumber) => {
    const row = (rounds ?? []).find((round) => round.round_number === roundNumber);
    return {
      roundNumber,
      status: (row?.status as string) ?? "CLOSED",
      dogs: dogsByRound.get(roundNumber) ?? [],
    };
  });

  const visibleSections = sections.filter(
    (section) => section.status === "OPEN" || section.status === "COMPLETED",
  );
  const liveRound = visibleSections.find((section) => section.status === "OPEN");

  return (
    <div className="bg-[#f6f1ea] pb-12">
      <PageBanner title="Contestants">
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          {liveRound
            ? `Round ${liveRound.roundNumber} is on stage now. Photos stay here so you can look back — voting opens after the last group.`
            : "Browse photos from each group. There is no voting on this page. Prize voting opens on Vote after every group has been introduced."}
        </p>
      </PageBanner>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        {!visibleSections.length ? (
          <p className="rounded-lg border border-dashed border-orange-200 bg-white/70 p-8 text-center text-slate-600">
            Photos appear here after the emcee opens each round. Check back when
            the first group is on stage.
          </p>
        ) : (
          visibleSections.map((section) => (
            <section key={section.roundNumber} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Round {section.roundNumber}
                  {section.status === "OPEN"
                    ? " · on stage"
                    : section.status === "COMPLETED"
                      ? " · introduced"
                      : ""}
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.dogs.map((dog) => (
                    <DogCard
                      key={dog.id}
                      uniqueId={dog.unique_id}
                      dogName={dog.dog_name}
                      costumeDescription={dog.costume_description}
                      photoUrl={dog.photo_url}
                      showRound
                      roundNumber={dog.round_number}
                      displayOrder={dog.display_order}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
