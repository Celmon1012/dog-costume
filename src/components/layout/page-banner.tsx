import Image from "next/image";

export function PageBanner({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="relative w-full overflow-hidden bg-black">
        <Image
          src="/images/page-banner.png"
          alt="Montclair Dog Events and Montclair Brewery Howl-O-Ween"
          width={1600}
          height={400}
          className="mx-auto h-auto w-full object-contain object-center"
          priority
        />
      </div>
      <div className="border-b border-orange-100 bg-[#f6f1ea] px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
          {children}
        </div>
      </div>
    </>
  );
}
