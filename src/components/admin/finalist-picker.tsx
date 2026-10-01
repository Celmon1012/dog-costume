"use client";

import { useState } from "react";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { setFinalists } from "@/actions/dogs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { AdminDogRow } from "@/components/admin/dog-table";

export function FinalistPicker({ dogs }: { dogs: AdminDogRow[] }) {
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

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dogs.map((dog) => (
          <Card
            key={dog.id}
            className="cursor-pointer overflow-hidden"
            onClick={() => toggle(dog.id)}
          >
            <div className="flex items-center gap-3 p-3">
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
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  {dog.uniqueId}
                </p>
                <p className="font-medium">{dog.dogName}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save finalists"}
      </Button>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
