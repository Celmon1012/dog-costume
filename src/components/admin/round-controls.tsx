"use client";

import { useState } from "react";
import { setRoundStatus, setVotingOpen } from "@/actions/rounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoundStatus } from "@/actions/rounds";

type RoundRow = {
  roundNumber: number;
  status: RoundStatus;
  dogCount: number;
};

export function RoundControls({
  rounds,
  votingOpen,
}: {
  rounds: RoundRow[];
  votingOpen: boolean;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateRound(roundNumber: number, status: RoundStatus) {
    setBusy(`${roundNumber}-${status}`);
    setError(null);
    const result = await setRoundStatus(roundNumber, status);
    setBusy(null);
    if (!result.ok) setError(result.error);
  }

  async function toggleVoting(open: boolean) {
    setBusy(open ? "voting-open" : "voting-close");
    setError(null);
    const result = await setVotingOpen(open);
    setBusy(null);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience voting</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant={votingOpen ? "success" : "secondary"}>
            {votingOpen ? "Voting OPEN" : "Voting CLOSED"}
          </Badge>
          <Button
            variant="default"
            loading={busy === "voting-open"}
            disabled={busy != null}
            onClick={() => toggleVoting(true)}
          >
            Open voting
          </Button>
          <Button
            variant="outline"
            loading={busy === "voting-close"}
            disabled={busy != null}
            onClick={() => toggleVoting(false)}
          >
            Close voting
          </Button>
          {error ? (
            <p className="w-full text-sm text-red-600">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {rounds.map((round) => (
          <Card key={round.roundNumber}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Round {round.roundNumber}</CardTitle>
              <Badge
                variant={
                  round.status === "OPEN"
                    ? "success"
                    : round.status === "COMPLETED"
                      ? "default"
                      : "secondary"
                }
              >
                {round.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                {round.dogCount} contestant{round.dogCount === 1 ? "" : "s"}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  loading={busy === `${round.roundNumber}-OPEN`}
                  disabled={busy != null}
                  onClick={() => updateRound(round.roundNumber, "OPEN")}
                >
                  Open round
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  loading={busy === `${round.roundNumber}-CLOSED`}
                  disabled={busy != null}
                  onClick={() => updateRound(round.roundNumber, "CLOSED")}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={busy === `${round.roundNumber}-COMPLETED`}
                  disabled={busy != null}
                  onClick={() => updateRound(round.roundNumber, "COMPLETED")}
                >
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
