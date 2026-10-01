import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DogPhoto } from "@/components/dogs/dog-photo";

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
        <DogPhoto
          src={photoUrl}
          alt={`${dogName} costume`}
          className="absolute inset-0 h-full w-full object-cover"
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
