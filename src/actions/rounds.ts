"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type RoundStatus = "CLOSED" | "OPEN" | "COMPLETED";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function setRoundStatus(
  roundNumber: number,
  status: RoundStatus,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("rounds")
    .select("id")
    .eq("round_number", roundNumber)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("rounds")
      .update({ status, updated_at: now })
      .eq("round_number", roundNumber);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("rounds").insert({
      id: crypto.randomUUID(),
      round_number: roundNumber,
      status,
      created_at: now,
      updated_at: now,
    });
    if (error) return { ok: false, error: error.message };
  }

  if (status === "OPEN") {
    const { error } = await supabase
      .from("rounds")
      .update({ status: "COMPLETED", updated_at: now })
      .neq("round_number", roundNumber)
      .eq("status", "OPEN");
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/contest");
  revalidatePath("/admin/rounds");
  return { ok: true };
}

export async function setVotingOpen(open: boolean): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    voting_open: open,
    updated_at: now,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/vote");
  revalidatePath("/admin");
  return { ok: true };
}

export async function startAudienceVoting(): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { count: categoryCount } = await supabase
    .from("prize_categories")
    .select("*", { count: "exact", head: true });

  if (!categoryCount) {
    const awards = [
      {
        id: crypto.randomUUID(),
        name: "Fur-right Night Award",
        subcategory: "Spookiest Costume",
        sort_order: 1,
      },
      {
        id: crypto.randomUUID(),
        name: "The Best Furiends Award",
        subcategory: "Best Duo or Group",
        sort_order: 2,
      },
      {
        id: crypto.randomUUID(),
        name: "Paws-itively Hilarious",
        subcategory: "Most Hilarious Costume",
        sort_order: 3,
      },
      {
        id: crypto.randomUUID(),
        name: "Pup Culture Award",
        subcategory: "Best TV, Film, Music, Celebrity Costume",
        sort_order: 4,
      },
      {
        id: crypto.randomUUID(),
        name: "Best in Show",
        subcategory: "Overall Winner",
        sort_order: 5,
      },
    ];
    const { error } = await supabase.from("prize_categories").insert(awards);
    if (error) {
      return {
        ok: false,
        error:
          "Prize categories are missing. Run supabase/seed.sql and supabase/fix_admin.sql in the SQL editor.",
      };
    }
  }

  const { count: dogCount } = await supabase
    .from("dogs")
    .select("*", { count: "exact", head: true });
  if (!dogCount) {
    return {
      ok: false,
      error: "Register at least one dog before opening voting.",
    };
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    voting_open: true,
    updated_at: now,
  });
  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("row-level security")
          ? "Could not open voting. Run supabase/fix_admin.sql in the SQL editor."
          : error.message,
    };
  }

  revalidatePath("/vote");
  revalidatePath("/admin");
  revalidatePath("/admin/finalists");
  return { ok: true };
}

export async function openVotingAction() {
  return startAudienceVoting();
}

export async function closeVotingAction(): Promise<ActionResult> {
  return setVotingOpen(false);
}
