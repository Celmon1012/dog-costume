import Image from "next/image";
import Link from "next/link";
import { Ghost, Laugh, PawPrint, Sparkles, Trophy, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

const awards = [
  { icon: Ghost, title: "Fur-right Night Award", blurb: "Spookiest Costume" },
  { icon: Sparkles, title: "The Best Furiends Award", blurb: "Best Duo or Group" },
  { icon: Laugh, title: "Paws-itively Hilarious", blurb: "Most Hilarious Costume" },
  { icon: Tv, title: "Pup Culture Award", blurb: "Best TV, Film, Music, Celebrity" },
  { icon: Trophy, title: "Best in Show", blurb: "Overall Winner" },
];

export default function HomePage() {
  return (
    <div className="bg-[#f6f1ea] pb-16">
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image
          src="/images/hero-dogs.jpg"
          alt="Dogs in costumes at the contest"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
            <PawPrint className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold drop-shadow sm:text-5xl">
            Dog Costume Contest
          </h1>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-xl px-4">
        <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <p className="text-center text-base leading-relaxed text-slate-700">
            Welcome to the Dog Costume Contest! On event day, you can sign up
            your dog to join the fun or vote for your favorite contestant. Get
            ready for a tail-wagging good time!
          </p>
          <div className="mt-6 space-y-3">
            <Button asChild className="h-12 w-full rounded-full text-base">
              <Link href="/register">Dog Contest Signup</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full rounded-full text-base"
            >
              <Link href="/vote">Vote for a contestant</Link>
            </Button>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-3">
          <Link
            href="/register"
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100"
          >
            <div className="relative h-32">
              <Image
                src="/images/signup-dog.jpg"
                alt="Sign up your dog"
                fill
                className="object-cover"
              />
            </div>
            <p className="p-3 text-center text-sm font-semibold text-orange-800">
              Sign up your dog
            </p>
          </Link>
          <Link
            href="/vote"
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100"
          >
            <div className="relative h-32">
              <Image
                src="/images/vote-dog.jpg"
                alt="Vote for costumes"
                fill
                className="object-cover"
              />
            </div>
            <p className="p-3 text-center text-sm font-semibold text-orange-800">
              Cast your vote
            </p>
          </Link>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-center text-lg font-semibold text-slate-900">
            Prize categories
          </h2>
          <ul className="mt-4 space-y-3">
            {awards.map(({ icon: Icon, title, blurb }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-slate-900">{title}</p>
                  <p className="text-sm text-slate-600">{blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
