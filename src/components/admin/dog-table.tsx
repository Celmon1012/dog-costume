"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { deleteDog, toggleFinalist, updateDog } from "@/actions/dogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import type { AdminDogRow } from "@/lib/supabase/map-dog";

export type { AdminDogRow };

export function DogTable({ dogs }: { dogs: AdminDogRow[] }) {
  const [editing, setEditing] = useState<AdminDogRow | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this dog?")) return;
    setBusy(id);
    await deleteDog(id);
    setBusy(null);
  }

  async function handleSave() {
    if (!editing) return;
    setBusy(editing.id);
    await updateDog(editing);
    setEditing(null);
    setBusy(null);
  }

  return (
    <>
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Costume</TableHead>
              <TableHead>Finalist</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dogs.map((dog) => (
              <TableRow key={dog.id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <DogPhoto
                      src={dog.photoUrl}
                      alt={dog.dogName}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{dog.uniqueId}</Badge>
                </TableCell>
                <TableCell className="font-medium">{dog.dogName}</TableCell>
                <TableCell>{dog.roundNumber}</TableCell>
                <TableCell>{dog.displayOrder}</TableCell>
                <TableCell className="max-w-[200px] truncate text-slate-600">
                  {dog.costumeDescription}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={dog.isFinalist}
                    disabled={busy === dog.id}
                    onCheckedChange={(checked) =>
                      toggleFinalist(dog.id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditing(dog)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={busy === dog.id}
                      onClick={() => handleDelete(dog.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editing?.uniqueId}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-3">
              <div>
                <Label>Dog name</Label>
                <Input
                  value={editing.dogName}
                  onChange={(e) =>
                    setEditing({ ...editing, dogName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Owner name</Label>
                <Input
                  value={editing.ownerName}
                  onChange={(e) =>
                    setEditing({ ...editing, ownerName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editing.ownerEmail}
                  onChange={(e) =>
                    setEditing({ ...editing, ownerEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editing.ownerPhone}
                  onChange={(e) =>
                    setEditing({ ...editing, ownerPhone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Breed</Label>
                <Input
                  value={editing.breed}
                  onChange={(e) =>
                    setEditing({ ...editing, breed: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Costume</Label>
                <Textarea
                  value={editing.costumeDescription}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      costumeDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Inspiration</Label>
                <Textarea
                  value={editing.inspiration}
                  onChange={(e) =>
                    setEditing({ ...editing, inspiration: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Fun fact</Label>
                <Textarea
                  value={editing.funnyFact}
                  onChange={(e) =>
                    setEditing({ ...editing, funnyFact: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSave} loading={busy === editing.id}>
                Save changes
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
