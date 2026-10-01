import { cn } from "@/lib/utils";

type DogLoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizes = {
  sm: { wrap: "gap-1", dog: "h-5 w-5", paw: "h-2 w-2", text: "text-xs" },
  md: { wrap: "gap-2", dog: "h-10 w-10", paw: "h-3.5 w-3.5", text: "text-sm" },
  lg: { wrap: "gap-3", dog: "h-16 w-16", paw: "h-5 w-5", text: "text-base" },
};

function DogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18 14c-4 0-7 4-6 8 1 3 4 5 7 5h2l-2 6c-4 1-7 5-7 10 0 7 7 13 18 13s18-6 18-13c0-5-3-9-7-10l-2-6h2c3 0 6-2 7-5 1-4-2-8-6-8-3 0-5 2-6 4h-12c-1-2-3-4-6-4z" />
      <circle cx="26" cy="22" r="2" fill="white" />
      <circle cx="38" cy="22" r="2" fill="white" />
      <path
        d="M28 30c2 2 6 2 8 0"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="12" cy="5.5" r="2.2" />
      <circle cx="17" cy="7" r="2.2" />
      <ellipse cx="12" cy="15" rx="5" ry="4.2" />
    </svg>
  );
}

export function DogLoader({ size = "md", label, className }: DogLoaderProps) {
  const s = sizes[size];
  if (size === "sm") {
    return (
      <span className={cn("inline-flex text-current", className)} role="status">
        <DogIcon className={cn("dog-hop", s.dog)} />
        <span className="sr-only">Loading</span>
      </span>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        s.wrap,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <DogIcon className={cn("dog-hop text-orange-500", s.dog)} />
      <div className="flex items-end gap-1 text-orange-400">
        <PawIcon className={cn("dog-paw", s.paw)} />
        <PawIcon className={cn("dog-paw dog-paw-delay-1", s.paw)} />
        <PawIcon className={cn("dog-paw dog-paw-delay-2", s.paw)} />
      </div>
      {label ? (
        <p className={cn("font-medium text-orange-800", s.text)}>{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
