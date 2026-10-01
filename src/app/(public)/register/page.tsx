import Image from "next/image";
import { RegistrationForm } from "@/components/register/registration-form";

export default function RegisterPage() {
  return (
    <div className="bg-[#f6f1ea] pb-12">
      <div className="relative h-40 w-full overflow-hidden sm:h-52">
        <Image
          src="/images/signup-dog.jpg"
          alt="Dog in costume"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end px-4 py-6">
          <div className="mx-auto w-full max-w-xl text-white">
            <h1 className="text-3xl font-bold">Dog Contest Signup</h1>
            <p className="mt-1 text-sm text-white/90">
              We assign your contestant ID and round automatically.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-xl px-4 py-8">
        <RegistrationForm />
      </div>
    </div>
  );
}
