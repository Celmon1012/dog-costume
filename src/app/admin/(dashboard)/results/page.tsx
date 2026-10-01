import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("prize_categories")
    .select("id, name, subcategory, sort_order")
    .order("sort_order", { ascending: true });

  const { data: votes } = await supabase
    .from("votes")
    .select("dog_id, prize_category_id");
  const { data: dogs } = await supabase
    .from("dogs")
    .select("id, unique_id, dog_name");

  const dogById = new Map((dogs ?? []).map((d) => [d.id, d]));

  const results = (categories ?? []).map((category) => {
    const counts = new Map<string, number>();
    for (const vote of votes ?? []) {
      if (vote.prize_category_id !== category.id) continue;
      counts.set(vote.dog_id, (counts.get(vote.dog_id) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const winner = top ? dogById.get(top[0]) : null;
    return {
      category,
      winner: winner
        ? { uniqueId: winner.unique_id, dogName: winner.dog_name }
        : null,
      votes: top?.[1] ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="text-slate-600">Admin-only live tallies by award category.</p>
      </div>
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prize category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead className="text-right">Votes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map(({ category, winner, votes }) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.subcategory}</TableCell>
                <TableCell>
                  {winner ? (
                    <span>
                      <Badge variant="outline" className="mr-2">
                        {winner.uniqueId}
                      </Badge>
                      {winner.dogName}
                    </span>
                  ) : (
                    <span className="text-slate-400">No votes yet</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{votes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
