import Image from "next/image";
import Link from "next/link";
import {
  Ghost,
  Laugh,
  PawPrint,
  Sparkles,
  Trophy,
  Tv,
  ClipboardList,
  Users,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const awards = [
  { icon: Ghost, title: "Fur-right Night Award", blurb: "Spookiest Costume" },
  { icon: Sparkles, title: "The Best Furiends Award", blurb: "Best Duo or Group" },
  { icon: Laugh, title: "Paws-itively Hilarious", blurb: "Most Hilarious Costume" },
  { icon: Tv, title: "Pup Culture Award", blurb: "Best TV, Film, Music, Celebrity" },
  { icon: Trophy, title: "Best in Show", blurb: "Overall Winner" },
];

const steps = [
  {
    icon: ClipboardList,
    title: "1. Sign up your dog",
    blurb:
      "Walk-ins are welcome. Fill in your dog’s name, costume, and a recommended photo. You will get a number like DOG-001, and your dog is placed in a small group of ten.",
  },
  {
    icon: Users,
    title: "2. Watch the introductions",
    blurb:
      "The MC brings dogs out in those small groups. Browse photos anytime on Contestants so you can remember who you loved. There is no voting during the introductions.",
  },
  {
    icon: Vote,
    title: "3. Vote after the last group",
    blurb:
      "When every group has been on stage, voting opens. Pick one dog for each of the five prizes. One vote per prize, per phone. Winners are announced at the end.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#f6f1ea] pb-20">
      <div className="relative h-72 w-full overflow-hidden sm:h-[28rem]">
        <Image
          src="/images/hero-dogs.webp"
          alt="Dogs in costumes at the contest"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg sm:h-20 sm:w-20">
            <PawPrint className="h-9 w-9 text-orange-500 sm:h-10 sm:w-10" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
            Live event · groups of 10
          </p>
          <h1 className="mt-2 max-w-4xl text-4xl font-bold drop-shadow sm:text-6xl">
            Dog Costume Contest
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
            Sign up your dog, then enjoy the introductions. Dogs come out in
            small groups of ten while the MC tells each story. Photos stay on
            this site so you can look back. After the last group, voting opens
            for five prizes — one winner for each prize.
          </p>
          <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 flex-1 rounded-full text-base">
              <Link href="/register">Dog Contest Signup</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 flex-1 rounded-full border-white/40 bg-white/15 text-base text-white hover:bg-white hover:text-orange-900"
            >
              <Link href="/contest">See contestants</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-orange-100 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            How today works
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
            This page is only the costume contest. Tickets stay on
            montclair-dog.com. Use your phone here to sign up, look at the dogs,
            and vote when the emcee says voting is open. You do not vote after
            every group — wait until all the dogs have been introduced, then
            choose one winner for each prize.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, blurb }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-orange-100"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{blurb}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <Link
            href="/register"
            className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-orange-100"
          >
            <div className="relative h-56 sm:h-72">
              <Image
                src="/images/signup-dog.webp"
                alt="Sign up your dog"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="text-sm font-medium text-orange-200">Walk-ins welcome</p>
                <h3 className="text-2xl font-bold">Sign up your dog</h3>
                <p className="mt-1 max-w-xl text-sm text-white/85">
                  Name, costume, recommended photo — get your contestant number
                  instantly. After the last group is introduced, use Vote to
                  pick one dog for each prize.
                </p>
              </div>
            </div>
          </Link>
        </section>

        <section className="mt-12">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Prize categories</h2>
            <p className="mt-2 text-slate-600">
              One vote per prize. You can vote in all five. One winner for each
              prize.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {awards.map(({ icon: Icon, title, blurb }) => (
              <li
                key={title}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{blurb}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
