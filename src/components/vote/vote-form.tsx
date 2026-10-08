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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!sortedCategories.length) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Awards not configured</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Prize categories have not been set up yet.
        </CardContent>
      </Card>
    );
  }

  if (!votingOpen) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Voting opens soon</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Voting opens after the last group has been introduced. Until then,
          browse photos on Contestants.
        </CardContent>
      </Card>
    );
  }

  if (dogs.length === 0) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>No contestants yet</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600">
          Dogs will appear here after they sign up.
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
          This device has submitted a vote in every prize. Results stay hidden
          until the emcee announces winners.
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

  const missing = sortedCategories.filter(
    (category) =>
      !existingCategoryIds.includes(category.id) && !selections[category.id],
  );

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
      .filter((vote) => vote.dogId);
    const result = await submitVotes({ votes, voterEmail });
    setSubmitting(false);
    if (result.ok) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <p className="text-center text-slate-600">
        One vote per prize. Pick one dog in each of the five categories, then
        submit once.
      </p>
      {sortedCategories.map((category) => {
        const locked = existingCategoryIds.includes(category.id);
        return (
          <section key={category.id} className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
              <p className="text-sm text-slate-600">{category.subcategory}</p>
              {locked ? (
                <p className="mt-1 text-sm text-violet-800">
                  You already voted in this prize on this device.
                </p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {dogs.map((dog) => {
                const selected = selections[category.id] === dog.id;
                return (
                  <button
                    key={`${category.id}-${dog.id}`}
                    type="button"
                    disabled={locked}
                    onClick={() =>
                      setSelections((prev) => ({ ...prev, [category.id]: dog.id }))
                    }
                    className={cn(
                      "overflow-hidden rounded-xl border-2 text-left transition-all",
                      selected
                        ? "border-orange-600 ring-2 ring-orange-200"
                        : "border-transparent bg-white shadow-sm hover:border-orange-200",
                      locked && "opacity-60",
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
          </section>
        );
      })}
      <div className="sticky bottom-0 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur">
        <Label htmlFor="voter-email">Your email</Label>
        <Input
          id="voter-email"
          type="email"
          required
          value={voterEmail}
          onChange={(event) => setVoterEmail(event.target.value)}
          placeholder="Used once per prize"
          className="mt-1"
        />
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <Button
          type="button"
          className="mt-3 w-full"
          loading={submitting}
          disabled={submitting || !voterEmail.trim() || missing.length > 0}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit votes"}
        </Button>
        {missing.length > 0 ? (
          <p className="mt-2 text-center text-xs text-slate-500">
            Pick one dog in every prize to submit.
          </p>
        ) : null}
      </div>
    </div>
  );
}
