"use client";

import { useState } from "react";
import Link from "next/link";
import { closeVotingAction, startAudienceVoting } from "@/actions/rounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StartVotingCard({
  votingOpen,
  dogCount,
  finalistCount,
}: {
  votingOpen: boolean;
  dogCount: number;
  finalistCount: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const result = await startAudienceVoting();
    setBusy(false);
    if (result.ok) {
      setMessage("Voting is live. Share /vote with the audience.");
    } else {
      setError(result.error);
    }
  }

  async function stop() {
    setBusy(true);
    setError(null);
    const result = await closeVotingAction();
    setBusy(false);
    if (result && "ok" in result && !result.ok) {
      setError(result.error);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Audience voting</CardTitle>
        <Badge variant={votingOpen ? "success" : "secondary"}>
          {votingOpen ? "Open" : "Closed"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>
            Dogs registered: <strong>{dogCount}</strong>
          </li>
          <li>
            Finalists selected: <strong>{finalistCount}</strong>
            {finalistCount === 0 && dogCount > 0
              ? " — Start voting will use every registered dog."
              : null}{" "}
            <Link href="/admin/finalists" className="text-orange-700 underline">
              Pick finalists
            </Link>
          </li>
          <li>Click Start voting, then send people to /vote</li>
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={start} disabled={busy}>
            {busy ? "Starting..." : "Start voting"}
          </Button>
          <Button type="button" variant="outline" onClick={stop} disabled={busy}>
            Close voting
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href="/vote">Open vote page</Link>
          </Button>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
