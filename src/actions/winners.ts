"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function refreshWinnerAnnouncement(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data: categories } = await supabase
    .from("prize_categories")
    .select("id, winner_dog_id");
  const allChosen =
    (categories ?? []).length > 0 &&
    (categories ?? []).every((category) => Boolean(category.winner_dog_id));

  const { data: settings } = await supabase
    .from("site_settings")
    .select("voting_open")
    .eq("id", "default")
    .maybeSingle();

  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    voting_open: allChosen ? false : Boolean(settings?.voting_open),
    winners_announced: allChosen,
    updated_at: new Date().toISOString(),
  });
  return { error, allChosen };
}

export async function setCategoryWinner(
  prizeCategoryId: string,
  dogId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("prize_categories")
    .update({ winner_dog_id: dogId })
    .eq("id", prizeCategoryId);
  if (error) return { ok: false, error: error.message };

  const announced = await refreshWinnerAnnouncement(supabase);
  if (announced.error) return { ok: false, error: announced.error.message };

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  revalidatePath("/winners");
  revalidatePath("/");
  revalidatePath("/vote");
  return { ok: true };
}

export async function clearCategoryWinner(
  prizeCategoryId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("prize_categories")
    .update({ winner_dog_id: null })
    .eq("id", prizeCategoryId);
  if (error) return { ok: false, error: error.message };

  const announced = await refreshWinnerAnnouncement(supabase);
  if (announced.error) return { ok: false, error: announced.error.message };

  revalidatePath("/admin/results");
  revalidatePath("/admin");
  revalidatePath("/winners");
  revalidatePath("/");
  revalidatePath("/vote");
  return { ok: true };
}
