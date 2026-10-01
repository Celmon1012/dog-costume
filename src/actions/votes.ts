"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getVoterId } from "@/lib/voter";
import { voteSubmissionSchema } from "@/lib/validations/vote";

export type VoteActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitVotes(
  input: unknown,
): Promise<VoteActionResult> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("voting_open")
    .eq("id", "default")
    .maybeSingle();

  if (!settings?.voting_open) {
    return { ok: false, error: "Voting is not open yet. Check back soon!" };
  }

  const parsed = voteSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please pick one dog in every category.",
    };
  }

  const categoryIds = parsed.data.votes.map((v) => v.prizeCategoryId);
  if (new Set(categoryIds).size !== categoryIds.length) {
    return { ok: false, error: "Duplicate category in submission." };
  }

  const voterIdentifier = await getVoterId();
  if (!voterIdentifier) {
    return { ok: false, error: "Could not identify this device. Refresh and try again." };
  }

  const voterEmail = parsed.data.voterEmail.trim().toLowerCase();

  const { data: contestants } = await supabase.from("dogs").select("id");
  const contestantSet = new Set((contestants ?? []).map((d) => d.id));

  for (const vote of parsed.data.votes) {
    if (!contestantSet.has(vote.dogId)) {
      return { ok: false, error: "Invalid contestant selected." };
    }
  }

  const { error } = await supabase.from("votes").insert(
    parsed.data.votes.map((vote) => ({
      id: crypto.randomUUID(),
      dog_id: vote.dogId,
      prize_category_id: vote.prizeCategoryId,
      voter_identifier: voterIdentifier,
      voter_email: voterEmail,
    })),
  );

  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("duplicate") || error.code === "23505"
          ? "This device or email already voted in one or more categories."
          : "Could not save votes. You may have already voted.",
    };
  }

  revalidatePath("/admin/results");
  return { ok: true, message: "Thanks! Your votes have been recorded." };
}
