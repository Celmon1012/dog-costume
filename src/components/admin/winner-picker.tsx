"use client";

import { useState } from "react";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearCategoryWinner, setCategoryWinner } from "@/actions/winners";
import { rankLabel, rankTone } from "@/lib/ranking";
import { cn } from "@/lib/utils";

export type RankedDog = {
  id: string;
  uniqueId: string;
  dogName: string;
  photoUrl: string;
  costumeDescription: string;
  votes: number;
};

export type CategoryResult = {
  id: string;
  name: string;
  subcategory: string;
  winnerDogId: string | null;
  totalVotes: number;
  tallies: RankedDog[];
};

export function WinnerPicker({ categories }: { categories: CategoryResult[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chosenCount = categories.filter((category) => category.winnerDogId).length;

  async function choose(categoryId: string, dogId: string) {
    setBusy(`${categoryId}-${dogId}`);
    setError(null);
    const result = await setCategoryWinner(categoryId, dogId);
    if (!result.ok) setError(result.error);
    setBusy(null);
  }

  async function clear(categoryId: string) {
    setBusy(`${categoryId}-clear`);
    setError(null);
    const result = await clearCategoryWinner(categoryId);
    if (!result.ok) setError(result.error);
    setBusy(null);
  }

  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-950">
        Ranked by audience votes. Pick one winner per prize. When all five are
        chosen, guests see the congratulations page.
        <span className="mt-1 block font-semibold">
          {chosenCount} of {categories.length} winners chosen
          {chosenCount === categories.length && categories.length > 0
            ? " — congratulations page is live."
            : "."}
        </span>
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {categories.map((category) => (
        <section key={category.id} className="rounded-xl border bg-white p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-sm text-slate-600">{category.subcategory}</p>
            </div>
            <p className="text-sm text-slate-500">{category.totalVotes} total votes</p>
          </div>
          {category.tallies.length === 0 ? (
            <p className="text-sm text-slate-400">No finalists yet.</p>
          ) : (
            <div className="space-y-2">
              {category.tallies.map((row, index) => {
                const isWinner = category.winnerDogId === row.id;
                return (
                  <div
                    key={row.id}
                    className={cn(
                      "flex flex-wrap items-center gap-3 rounded-lg border p-2",
                      isWinner
                        ? "border-orange-400 bg-orange-50"
                        : "border-slate-100",
                    )}
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
                        src={row.photoUrl}
                        alt={row.dogName}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        <span className="mr-2 text-orange-800">{row.uniqueId}</span>
                        {row.dogName}
                        {isWinner ? (
                          <Badge className="ml-2" variant="secondary">
                            Winner
                          </Badge>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {row.costumeDescription}
                      </p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block text-2xl font-bold leading-none">
                        {row.votes}
                      </span>
                      <span className="text-xs text-slate-500">votes</span>
                    </p>
                    {isWinner ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        loading={busy === `${category.id}-clear`}
                        onClick={() => clear(category.id)}
                      >
                        Unset
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        loading={busy === `${category.id}-${row.id}`}
                        onClick={() => choose(category.id, row.id)}
                      >
                        Choose winner
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
