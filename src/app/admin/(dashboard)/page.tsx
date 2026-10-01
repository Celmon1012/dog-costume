import { StartVotingCard } from "@/components/admin/start-voting-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { data: dogRows },
    { count: voteCount },
    { data: activeRound },
    { data: settings },
  ] = await Promise.all([
    supabase.from("dogs").select("id, is_finalist"),
    supabase.from("votes").select("id", { count: "exact", head: true }),
    supabase
      .from("rounds")
      .select("round_number")
      .eq("status", "OPEN")
      .order("round_number", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("voting_open")
      .eq("id", "default")
      .maybeSingle(),
  ]);

  const dogCount = dogRows?.length ?? 0;
  const finalistCount = dogRows?.filter((dog) => dog.is_finalist).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Event-day control center</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total dogs", value: dogCount ?? 0 },
          {
            label: "Current round",
            value: activeRound ? `Round ${activeRound.round_number}` : "None open",
          },
          { label: "Total votes", value: voteCount ?? 0 },
          { label: "Finalists", value: finalistCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>
      <StartVotingCard
        votingOpen={settings?.voting_open ?? false}
        dogCount={dogCount ?? 0}
        finalistCount={finalistCount}
      />
      <Card>
        <CardHeader>
          <CardTitle>Event-day walkthrough</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Share <strong>/register</strong> for signup and walk-ins. Each dog
              gets DOG-001, DOG-002… and lands in a round of 10.
            </li>
            <li>
              MC uses <strong>MC script</strong>. Staff opens one round at a
              time. Guests vote for one favorite on <strong>Contestants</strong>{" "}
              during the live round.
            </li>
            <li>
              After rounds, open <strong>Finalists</strong>, pick dogs using
              round vote counts, then <strong>Start prize voting</strong>.
            </li>
            <li>
              Guests use <strong>/vote</strong> for the five prizes. On{" "}
              <strong>Results</strong>, rank by votes and choose each winner.
              After all five are set, guests see <strong>/winners</strong>.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
