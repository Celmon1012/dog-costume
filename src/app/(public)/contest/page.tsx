import { DogCard } from "@/components/dogs/dog-card";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ContestPage() {
  const supabase = await createClient();

  const { data: activeRound } = await supabase
    .from("rounds")
    .select("round_number")
    .eq("status", "OPEN")
    .order("round_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: dogs } = activeRound
    ? await supabase
        .from("dogs")
        .select(
          "id, unique_id, dog_name, costume_description, photo_url, round_number, display_order",
        )
        .eq("round_number", activeRound.round_number)
        .order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div className="bg-[#f6f1ea] pb-12">
      <div className="relative h-40 w-full overflow-hidden sm:h-52">
        <Image
          src="/images/hero-dogs.jpg"
          alt="Costume contest dogs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end px-4 py-6">
          <div className="mx-auto w-full max-w-6xl text-white">
            <h1 className="text-3xl font-bold">Contestants</h1>
            <p className="mt-1 text-sm text-white/90">
              {activeRound
                ? `Now showing Round ${activeRound.round_number} — good luck to all the good dogs!`
                : "No round is open right now. Check back when the emcee opens the next round."}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {!dogs?.length ? (
        <p className="rounded-lg border border-dashed border-orange-200 bg-white/70 p-8 text-center text-slate-600">
          No dogs in this round yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dogs.map((dog) => (
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
      </div>
    </div>
  );
}
