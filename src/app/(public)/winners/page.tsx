import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DogPhoto } from "@/components/dogs/dog-photo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WinnersPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: categories }] = await Promise.all([
    supabase
      .from("site_settings")
      .select("winners_announced")
      .eq("id", "default")
      .maybeSingle(),
    supabase
      .from("prize_categories")
      .select("id, name, subcategory, sort_order, winner_dog_id")
      .order("sort_order", { ascending: true }),
  ]);

  const winnerIds = (categories ?? [])
    .map((category) => category.winner_dog_id as string | null)
    .filter((id): id is string => Boolean(id));

  const announced =
    Boolean(settings?.winners_announced) &&
    winnerIds.length > 0 &&
    winnerIds.length === (categories ?? []).length;

  const { data: dogs } = winnerIds.length
    ? await supabase
        .from("dogs")
        .select(
          "id, unique_id, dog_name, owner_name, photo_url, costume_description, breed, inspiration, funny_fact, round_number",
        )
        .in("id", winnerIds)
    : { data: [] };

  const dogById = new Map((dogs ?? []).map((dog) => [dog.id as string, dog]));

  if (!announced) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <Trophy className="mx-auto h-12 w-12 text-orange-400" />
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Winners</h1>
        <p className="mt-2 text-slate-600">
          The congratulations page opens after the emcee chooses a winner in
          every prize category.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f1ea] pb-20">
      <div className="bg-gradient-to-br from-orange-500 to-violet-700 px-4 py-14 text-center text-white sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">
          Dog Costume Contest
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-6xl">Congratulations!</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
          Here are this year’s prize winners — voted by the crowd, chosen by the
          emcee.
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        {(categories ?? []).map((category) => {
          const dog = dogById.get(category.winner_dog_id as string);
          if (!dog) return null;
          return (
            <article
              key={category.id as string}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100"
            >
              <div className="relative aspect-[4/3] bg-orange-50">
                <DogPhoto
                  src={(dog.photo_url as string) ?? ""}
                  alt={dog.dog_name as string}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{dog.unique_id as string}</Badge>
                  <Badge variant="outline">Round {dog.round_number as number}</Badge>
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
                  {category.name as string}
                </p>
                <p className="text-sm text-slate-500">{category.subcategory as string}</p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {dog.dog_name as string}
                </h2>
                <p className="text-sm text-slate-600">
                  Handler: {dog.owner_name as string}
                </p>
                {dog.breed ? (
                  <p className="text-sm text-slate-600">Breed: {dog.breed as string}</p>
                ) : null}
                <p className="text-sm leading-relaxed text-slate-700">
                  {dog.costume_description as string}
                </p>
                {dog.inspiration ? (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Inspiration: </span>
                    {dog.inspiration as string}
                  </p>
                ) : null}
                {dog.funny_fact ? (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Fun fact: </span>
                    {dog.funny_fact as string}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
