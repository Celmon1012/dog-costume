import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DogCardProps = {
  uniqueId: string;
  dogName: string;
  costumeDescription: string;
  photoUrl: string;
  showRound?: boolean;
  roundNumber?: number;
  displayOrder?: number;
};

export function DogCard({
  uniqueId,
  dogName,
  costumeDescription,
  photoUrl,
  showRound,
  roundNumber,
  displayOrder,
}: DogCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square w-full bg-orange-50">
        <Image
          src={photoUrl}
          alt={`${dogName} costume`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{uniqueId}</Badge>
          {showRound && roundNumber != null && displayOrder != null ? (
            <span className="text-xs text-slate-500">
              Round {roundNumber} · #{displayOrder}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-lg">{dogName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{costumeDescription}</p>
      </CardContent>
    </Card>
  );
}
