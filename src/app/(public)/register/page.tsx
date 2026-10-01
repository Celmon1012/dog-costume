import Image from "next/image";
import { RegistrationForm } from "@/components/register/registration-form";

export default function RegisterPage() {
  return (
    <div className="bg-[#f6f1ea] pb-12">
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image
          src="/images/signup-dog.jpg"
          alt="Dog in costume"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-6xl text-white">
            <h1 className="text-3xl font-bold sm:text-4xl">Dog Contest Signup</h1>
            <p className="mt-1 text-sm text-white/90">
              We assign your contestant ID and round automatically.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
        <aside className="space-y-4 lg:pt-2">
          <h2 className="text-2xl font-bold text-slate-900">What happens next</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              You get a contestant ID like <strong>DOG-001</strong> on the next
              screen.
            </li>
            <li className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              Dogs are grouped automatically in rounds of 10, first come first
              served.
            </li>
            <li className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              Optional photo and fun facts help the MC introduce your dog.
            </li>
          </ul>
        </aside>
        <div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}
