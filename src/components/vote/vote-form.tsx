"use client";

import { useMemo, useState } from "react";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { submitVotes } from "@/actions/votes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type VoteCategory = {
  id: string;
  name: string;
  subcategory: string;
  sortOrder: number;
};

export type VoteDog = {
  id: string;
  uniqueId: string;
  dogName: string;
  photoUrl: string;
  costumeDescription: string;
};

type VoteFormProps = {
  categories: VoteCategory[];
  dogs: VoteDog[];
  votingOpen: boolean;
  existingCategoryIds: string[];
};

export function VoteForm({
  categories,
  dogs,
  votingOpen,
  existingCategoryIds,
}: VoteFormProps) {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [voterEmail, setVoterEmail] = useState("");
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = sortedCategories[step];
  if (!current) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Awards not configured</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Prize categories have not been seeded yet. Ask an admin to run the
          database seed.
        </CardContent>
      </Card>
    );
  }

  const alreadyVoted = existingCategoryIds.includes(current.id);

  function selectDog(dogId: string) {
    if (!current || alreadyVoted) return;
    setSelections((prev) => ({ ...prev, [current.id]: dogId }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setMessage(null);
    const votes = sortedCategories
      .filter((cat) => !existingCategoryIds.includes(cat.id))
      .map((cat) => ({
        prizeCategoryId: cat.id,
        dogId: selections[cat.id],
      }))
      .filter((v) => v.dogId);
    const result = await submitVotes({ votes, voterEmail });
    setSubmitting(false);
    if (result.ok) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
  }

  if (!votingOpen) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Voting opens soon</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          The emcee will open prize voting after finalists are chosen. Round
          favorites are voted on Contestants.
        </CardContent>
      </Card>
    );
  }

  if (dogs.length === 0) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>No finalists yet</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Staff will pick finalists from the round votes, then this page opens.
        </CardContent>
      </Card>
    );
  }

  const alreadyVotedAll =
    sortedCategories.length > 0 &&
    sortedCategories.every((c) => existingCategoryIds.includes(c.id));

  if (alreadyVotedAll) {
    return (
      <Card className="mx-auto max-w-lg border-emerald-200 bg-emerald-50/50 text-center">
        <CardHeader>
          <CardTitle className="text-emerald-800">You already voted</CardTitle>
        </CardHeader>
        <CardContent className="text-emerald-700">
          This device has submitted a vote in every category. Results stay
          hidden until the emcee announces winners.
        </CardContent>
      </Card>
    );
  }

  if (message) {
    return (
      <Card className="mx-auto max-w-lg border-emerald-200 bg-emerald-50/50 text-center">
        <CardHeader>
          <CardTitle className="text-emerald-800">Votes submitted</CardTitle>
        </CardHeader>
        <CardContent className="text-emerald-700">{message}</CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Category {step + 1} of {sortedCategories.length}
        </span>
        <span className="font-medium text-orange-800">{current.subcategory}</span>
      </div>
      <p className="text-xs text-slate-500">{current.name}</p>
      {alreadyVoted ? (
        <p className="rounded-md bg-violet-50 px-3 py-2 text-sm text-violet-800">
          You already voted in this category on this device.
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dogs.map((dog) => {
          const selected = selections[current.id] === dog.id;
          return (
            <button
              key={dog.id}
              type="button"
              disabled={alreadyVoted}
              onClick={() => selectDog(dog.id)}
              className={cn(
                "overflow-hidden rounded-xl border-2 text-left transition-all",
                selected
                  ? "border-orange-600 ring-2 ring-orange-200"
                  : "border-transparent bg-white shadow-sm hover:border-orange-200",
                alreadyVoted && "opacity-60",
              )}
            >
              <div className="relative aspect-square w-full bg-orange-50">
                <DogPhoto
                  src={dog.photoUrl}
                  alt={dog.dogName}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="space-y-0.5 p-2">
                <p className="text-xs font-semibold text-orange-700">
                  {dog.uniqueId}
                </p>
                <p className="text-sm font-medium">{dog.dogName}</p>
                <p className="line-clamp-2 text-xs text-slate-500">
                  {dog.costumeDescription}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div>
        <Label htmlFor="voter-email">Your email</Label>
        <Input
          id="voter-email"
          type="email"
          required
          value={voterEmail}
          onChange={(event) => setVoterEmail(event.target.value)}
          placeholder="Used once per prize category"
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        {step < sortedCategories.length - 1 ? (
          <Button
            type="button"
            className="flex-1"
            disabled={!selections[current.id] && !alreadyVoted}
            onClick={() => setStep((s) => s + 1)}
          >
            Next category
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            loading={submitting}
            disabled={
              submitting ||
              !voterEmail.trim() ||
              sortedCategories
                .filter((c) => !existingCategoryIds.includes(c.id))
                .some((c) => !selections[c.id])
            }
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Submit all votes"}
          </Button>
        )}
      </div>
    </div>
  );
}
