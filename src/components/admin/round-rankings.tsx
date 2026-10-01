import { DogPhoto } from "@/components/dogs/dog-photo";
import { rankLabel, rankTone } from "@/lib/ranking";
import { cn } from "@/lib/utils";

export type RoundRankRow = {
  id: string;
  uniqueId: string;
  dogName: string;
  photoUrl: string;
  costumeDescription: string;
  votes: number;
};

export function RoundRankings({
  rounds,
}: {
  rounds: Array<{
    roundNumber: number;
    status: string;
    dogs: RoundRankRow[];
  }>;
}) {
  return (
    <div className="space-y-6">
      {rounds.map((round) => (
        <section key={round.roundNumber} className="rounded-xl border bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Round {round.roundNumber} ranking</h2>
            <p className="text-sm text-slate-500">{round.status}</p>
          </div>
          {round.dogs.length === 0 ? (
            <p className="text-sm text-slate-400">No contestants in this round.</p>
          ) : (
            <div className="space-y-2">
              {round.dogs.map((dog, index) => (
                <div
                  key={dog.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 p-2"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      rankTone(index),
                    )}
                  >
                    {rankLabel(index)}
                  </span>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-orange-50">
                    <DogPhoto
                      src={dog.photoUrl}
                      alt={dog.dogName}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      <span className="mr-2 text-orange-800">{dog.uniqueId}</span>
                      {dog.dogName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {dog.costumeDescription}
                    </p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="block text-2xl font-bold leading-none">
                      {dog.votes}
                    </span>
                    <span className="text-xs text-slate-500">votes</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
