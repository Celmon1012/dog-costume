import { StartVotingCard } from "@/components/admin/start-voting-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: dogCount },
    { count: voteCount },
    { count: finalistCount },
    { data: activeRound },
    { data: settings },
  ] = await Promise.all([
    supabase.from("dogs").select("*", { count: "exact", head: true }),
    supabase.from("votes").select("*", { count: "exact", head: true }),
    supabase
      .from("dogs")
      .select("*", { count: "exact", head: true })
      .eq("is_finalist", true),
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
          { label: "Finalists", value: finalistCount ?? 0 },
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
        finalistCount={finalistCount ?? 0}
      />
    </div>
  );
}
