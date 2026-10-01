import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RegisterThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; name?: string }>;
}) {
  const params = await searchParams;
  const uniqueId = params.id ?? "DOG-???";
  const dogName = params.name ?? "your dog";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>You&apos;re in!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            {dogName}&apos;s contestant number is
          </p>
          <p className="text-4xl font-bold tracking-wide text-orange-700">
            {uniqueId}
          </p>
          <p className="text-sm text-slate-500">
            Show this to staff if they need it. You&apos;re grouped automatically
            in rounds of 10.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/register">Register another dog</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contest">See contestants</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
