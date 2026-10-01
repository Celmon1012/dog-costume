"use client";

import { useState } from "react";
import { DogCard } from "@/components/dogs/dog-card";
import { submitRoundVote } from "@/actions/votes";
import { Button } from "@/components/ui/button";

type RoundDog = {
  id: string;
  unique_id: string;
  dog_name: string;
  costume_description: string;
  photo_url: string;
  round_number: number;
  display_order: number;
};

export function RoundVoteGrid({
  dogs,
  roundNumber,
  votingOpen,
  votedDogId,
}: {
  dogs: RoundDog[];
  roundNumber: number;
  votingOpen: boolean;
  votedDogId: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(votedDogId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(votedDogId);

  async function vote(dogId: string) {
    if (!votingOpen || doneId || busy) return;
    setSelected(dogId);
    setBusy(true);
    setError(null);
    const result = await submitRoundVote(dogId, roundNumber);
    setBusy(false);
    if (result.ok) {
      setDoneId(dogId);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-3">
      {votingOpen && !doneId ? (
        <p className="text-sm font-medium text-orange-800">
          Pick your favorite from this round — one vote per phone.
        </p>
      ) : null}
      {doneId ? (
        <p className="text-sm font-medium text-emerald-700">
          Thanks — your round vote is in. Results stay with the admin.
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dogs.map((dog) => {
          const picked = (doneId ?? selected) === dog.id;
          return (
            <div key={dog.id} className="space-y-2">
              <DogCard
                uniqueId={dog.unique_id}
                dogName={dog.dog_name}
                costumeDescription={dog.costume_description}
                photoUrl={dog.photo_url}
                showRound
                roundNumber={dog.round_number}
                displayOrder={dog.display_order}
              />
              {votingOpen ? (
                <Button
                  className="w-full"
                  variant={picked ? "default" : "outline"}
                  disabled={busy || !!doneId}
                  onClick={() => vote(dog.id)}
                >
                  {doneId
                    ? picked
                      ? "Your pick"
                      : "Voted"
                    : picked
                      ? "Voting..."
                      : "Vote for this dog"}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
