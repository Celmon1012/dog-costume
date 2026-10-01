"use server";

import { revalidatePath } from "next/cache";
import {
  computeRoundAndOrder,
  formatUniqueDogId,
} from "@/lib/dog-numbering";
import { createClient } from "@/lib/supabase/server";
import { dogRegistrationSchema, dogUpdateSchema } from "@/lib/validations/dog";
import { requireAdmin } from "@/lib/auth";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "dog-photos";

export type ActionResult =
  | { ok: true; uniqueId?: string; message?: string }
  | { ok: false; error: string };

export async function registerDog(formData: FormData): Promise<ActionResult> {
  const parsed = dogRegistrationSchema.safeParse({
    dogName: formData.get("dogName"),
    ownerName: formData.get("ownerName"),
    ownerEmail: formData.get("ownerEmail"),
    ownerPhone: formData.get("ownerPhone"),
    breed: formData.get("breed") ?? "",
    costumeDescription: formData.get("costumeDescription"),
    inspiration: formData.get("inspiration") ?? "",
    funnyFact: formData.get("funnyFact") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid form" };
  }

  const photo = formData.get("photo");
  const hasPhoto = photo instanceof File && photo.size > 0;

  if (hasPhoto) {
    if (!photo.type.startsWith("image/")) {
      return { ok: false, error: "Photo must be an image file" };
    }
    if (photo.size > 5 * 1024 * 1024) {
      return { ok: false, error: "Photo must be under 5MB" };
    }
  }

  try {
    const supabase = await createClient();
    let photoUrl = "";

    if (hasPhoto && photo instanceof File) {
      const ext = photo.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await photo.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        return {
          ok: false,
          error: uploadError.message.toLowerCase().includes("bucket")
            ? "Photo bucket is missing. In Supabase Storage, create a public bucket named dog-photos."
            : `Photo upload failed: ${uploadError.message}`,
        };
      }

      const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
      photoUrl = publicUrl.publicUrl;
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "register_contestant",
      {
        p_dog_name: parsed.data.dogName,
        p_owner_name: parsed.data.ownerName,
        p_owner_email: parsed.data.ownerEmail,
        p_owner_phone: parsed.data.ownerPhone,
        p_photo_url: photoUrl,
        p_costume_description: parsed.data.costumeDescription,
        p_breed: parsed.data.breed ?? "",
        p_inspiration: parsed.data.inspiration ?? "",
        p_funny_fact: parsed.data.funnyFact ?? "",
      },
    );

    if (!rpcError && rpcData) {
      const result = rpcData as { unique_id?: string; dog_name?: string };
      revalidatePath("/contest");
      revalidatePath("/admin/dogs");
      revalidatePath("/admin/script");
      return {
        ok: true,
        uniqueId: result.unique_id,
        message: `${result.dog_name ?? parsed.data.dogName} registered as ${result.unique_id}`,
      };
    }

    const { count } = await supabase
      .from("dogs")
      .select("*", { count: "exact", head: true });
    const sequence = (count ?? 0) + 1;
    const uniqueId = formatUniqueDogId(sequence);
    const { roundNumber, displayOrder } = computeRoundAndOrder(sequence - 1);
    const now = new Date().toISOString();

    const { error: insertError } = await supabase.from("dogs").insert({
      id: crypto.randomUUID(),
      unique_id: uniqueId,
      dog_name: parsed.data.dogName,
      owner_name: parsed.data.ownerName,
      owner_email: parsed.data.ownerEmail,
      owner_phone: parsed.data.ownerPhone,
      photo_url: photoUrl,
      costume_description: parsed.data.costumeDescription,
      breed: parsed.data.breed ?? "",
      inspiration: parsed.data.inspiration ?? "",
      funny_fact: parsed.data.funnyFact ?? "",
      round_number: roundNumber,
      display_order: displayOrder,
      is_finalist: false,
      created_at: now,
      updated_at: now,
    });

    if (insertError) {
      return {
        ok: false,
        error: insertError.message.includes("row-level security")
          ? "Database blocked the insert. Run supabase/seed.sql in the SQL editor, then try again."
          : insertError.message,
      };
    }

    await supabase.from("rounds").upsert(
      {
        id: crypto.randomUUID(),
        round_number: roundNumber,
        status: roundNumber === 1 ? "OPEN" : "CLOSED",
        created_at: now,
        updated_at: now,
      },
      { onConflict: "round_number", ignoreDuplicates: true },
    );

    revalidatePath("/contest");
    revalidatePath("/admin/dogs");
    revalidatePath("/admin/script");
    return {
      ok: true,
      uniqueId,
      message: `${parsed.data.dogName} registered as ${uniqueId}`,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
    };
  }
}

export async function updateDog(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = dogUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid dog data" };
  }

  const { id, isFinalist, ...data } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("dogs")
    .update({
      dog_name: data.dogName,
      owner_name: data.ownerName,
      owner_email: data.ownerEmail,
      owner_phone: data.ownerPhone,
      costume_description: data.costumeDescription,
      breed: data.breed ?? "",
      inspiration: data.inspiration ?? "",
      funny_fact: data.funnyFact ?? "",
      ...(typeof isFinalist === "boolean" ? { is_finalist: isFinalist } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/dogs");
  revalidatePath("/admin/script");
  revalidatePath("/admin/finalists");
  revalidatePath("/vote");
  return { ok: true };
}

export async function deleteDog(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("dogs").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/dogs");
  revalidatePath("/admin/script");
  revalidatePath("/contest");
  return { ok: true };
}

export async function setFinalists(dogIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error: clearError } = await supabase
    .from("dogs")
    .update({ is_finalist: false, updated_at: new Date().toISOString() })
    .neq("id", "");
  if (clearError) return { ok: false, error: clearError.message };

  if (dogIds.length) {
    const { error } = await supabase
      .from("dogs")
      .update({ is_finalist: true, updated_at: new Date().toISOString() })
      .in("id", dogIds);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/finalists");
  revalidatePath("/vote");
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleFinalist(
  id: string,
  isFinalist: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("dogs")
    .update({ is_finalist: isFinalist, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/dogs");
  revalidatePath("/admin/finalists");
  revalidatePath("/vote");
  return { ok: true };
}
