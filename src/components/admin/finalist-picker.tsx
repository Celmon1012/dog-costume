"use client";

import { useState } from "react";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { setFinalists } from "@/actions/dogs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { AdminDogRow } from "@/components/admin/dog-table";
import { rankLabel, rankTone } from "@/lib/ranking";
import { cn } from "@/lib/utils";

export function FinalistPicker({
  dogs,
}: {
  dogs: Array<AdminDogRow & { roundVoteCount?: number }>;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(dogs.filter((d) => d.isFinalist).map((d) => d.id)),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    await setFinalists([...selected]);
    setSaving(false);
    setMessage("Finalists updated. Only these dogs appear on the vote page.");
  }

  const byRound = new Map<number, typeof dogs>();
  for (const dog of dogs) {
    const list = byRound.get(dog.roundNumber) ?? [];
    list.push(dog);
    byRound.set(dog.roundNumber, list);
  }
  const rounds = [...byRound.keys()].sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {rounds.map((roundNumber) => {
        const roundDogs = [...(byRound.get(roundNumber) ?? [])].sort(
          (a, b) => (b.roundVoteCount ?? 0) - (a.roundVoteCount ?? 0),
        );
        return (
          <section key={roundNumber} className="space-y-3">
            <h2 className="text-xl font-semibold">
              Round {roundNumber} votes
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roundDogs.map((dog, index) => (
                <Card
                  key={dog.id}
                  className="cursor-pointer overflow-hidden"
                  onClick={() => toggle(dog.id)}
                >
                  <div className="flex items-center gap-3 p-3">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        rankTone(index),
                      )}
                    >
                      {rankLabel(index)}
                    </span>
                    <Checkbox
                      checked={selected.has(dog.id)}
                      onCheckedChange={() => toggle(dog.id)}
                    />
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                      <DogPhoto
                        src={dog.photoUrl}
                        alt={dog.dogName}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-orange-800">
                        {dog.uniqueId}
                      </p>
                      <p className="font-medium">{dog.dogName}</p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block text-2xl font-bold leading-none">
                        {dog.roundVoteCount ?? 0}
                      </span>
                      <span className="text-xs text-slate-500">votes</span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
      <Button onClick={save} loading={saving}>
        {saving ? "Saving..." : "Save finalists"}
      </Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
