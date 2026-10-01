import Image from "next/image";
import Link from "next/link";
import { VoteForm } from "@/components/vote/vote-form";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 10;

export default async function VotePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: categories }, { data: dogs }] =
    await Promise.all([
      supabase
        .from("site_settings")
        .select("voting_open, winners_announced")
        .eq("id", "default")
        .maybeSingle(),
      supabase
        .from("prize_categories")
        .select("id, name, subcategory, sort_order")
        .order("sort_order", { ascending: true }),
      supabase
        .from("dogs")
        .select(
          "id, unique_id, dog_name, photo_url, costume_description, round_number, display_order",
        )
        .eq("is_finalist", true)
        .order("unique_id", { ascending: true }),
    ]);

  return (
    <div className="bg-[#f6f1ea] pb-12">
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image
          src="/images/vote-dog.jpg"
          alt="Vote for your favorite costume"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-6xl text-white">
            <h1 className="text-3xl font-bold">Vote</h1>
            <p className="mt-1 text-sm text-white/90">
              Final prize voting — one dog per category, finalists only.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <VoteForm
          categories={(categories ?? []).map((category) => ({
            id: category.id,
            name: category.name,
            subcategory: category.subcategory,
            sortOrder: category.sort_order,
          }))}
          dogs={(dogs ?? []).map((dog) => ({
            id: dog.id,
            uniqueId: dog.unique_id,
            dogName: dog.dog_name,
            photoUrl: dog.photo_url,
            costumeDescription: dog.costume_description,
          }))}
          votingOpen={settings?.voting_open ?? false}
          existingCategoryIds={[]}
        />
        {settings?.winners_announced ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            Winners have been announced.{" "}
            <Link href="/winners" className="font-medium text-orange-700 underline">
              See congratulations
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
