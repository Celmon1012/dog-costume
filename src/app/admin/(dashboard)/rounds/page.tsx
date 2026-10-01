import { RoundControls } from "@/components/admin/round-controls";
import type { RoundStatus } from "@/actions/rounds";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminRoundsPage() {
  const supabase = await createClient();

  const [{ data: roundRows }, { data: settings }, { data: dogs }] =
    await Promise.all([
      supabase.from("rounds").select("round_number, status"),
      supabase
        .from("site_settings")
        .select("voting_open")
        .eq("id", "default")
        .maybeSingle(),
      supabase.from("dogs").select("round_number"),
    ]);

  const countByRound = new Map<number, number>();
  for (const dog of dogs ?? []) {
    const n = dog.round_number as number;
    countByRound.set(n, (countByRound.get(n) ?? 0) + 1);
  }

  const maxRoundFromDogs = [...countByRound.keys()].reduce(
    (max, n) => Math.max(max, n),
    1,
  );
  const maxRoundFromTable = (roundRows ?? []).reduce(
    (max, r) => Math.max(max, r.round_number as number),
    0,
  );
  const maxRound = Math.max(maxRoundFromDogs, maxRoundFromTable, 1);

  const rounds = Array.from({ length: maxRound }, (_, i) => {
    const roundNumber = i + 1;
    const row = (roundRows ?? []).find((r) => r.round_number === roundNumber);
    return {
      roundNumber,
      status: (row?.status as RoundStatus) ?? "CLOSED",
      dogCount: countByRound.get(roundNumber) ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Round management</h1>
        <p className="text-slate-600">
          Open one round at a time for the public contest page.
        </p>
      </div>
      <RoundControls
        rounds={rounds}
        votingOpen={settings?.voting_open ?? false}
      />
    </div>
  );
}
