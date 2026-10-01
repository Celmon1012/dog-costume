import { DogPhoto } from "@/components/dogs/dog-photo";
import { Badge } from "@/components/ui/badge";
import { mapDog, DOG_SELECT, type DogRecord } from "@/lib/supabase/map-dog";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function McScriptPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dogs")
    .select(DOG_SELECT)
    .order("round_number", { ascending: true })
    .order("display_order", { ascending: true });

  const dogs = ((data ?? []) as DogRecord[]).map(mapDog);
  const rounds = [...new Set(dogs.map((dog) => dog.roundNumber))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">MC script</h1>
        <p className="text-slate-600">
          Introduce each dog from this view. Details come from signup — no
          copy-paste.
        </p>
      </div>
      {!dogs.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-slate-600">
          No contestants yet.
        </p>
      ) : (
        rounds.map((roundNumber) => (
          <section key={roundNumber} className="space-y-4">
            <h2 className="text-2xl font-semibold">Round {roundNumber}</h2>
            <div className="space-y-4">
              {dogs
                .filter((dog) => dog.roundNumber === roundNumber)
                .map((dog) => (
                  <article
                    key={dog.id}
                    className="grid gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr]"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-orange-50">
                      <DogPhoto
                        src={dog.photoUrl}
                        alt={dog.dogName}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{dog.uniqueId}</Badge>
                        <span className="text-sm text-slate-500">
                          #{dog.displayOrder} in round
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{dog.dogName}</h3>
                      {dog.breed ? (
                        <p className="text-slate-700">
                          <span className="font-medium">Breed:</span> {dog.breed}
                        </p>
                      ) : null}
                      <p className="text-lg text-slate-800">
                        Dressed as: {dog.costumeDescription}
                      </p>
                      {dog.inspiration ? (
                        <p className="text-slate-700">
                          <span className="font-medium">Inspiration:</span>{" "}
                          {dog.inspiration}
                        </p>
                      ) : null}
                      {dog.funnyFact ? (
                        <p className="text-slate-700">
                          <span className="font-medium">Fun fact:</span>{" "}
                          {dog.funnyFact}
                        </p>
                      ) : null}
                      <p className="text-sm text-slate-500">
                        Handler: {dog.ownerName}
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
