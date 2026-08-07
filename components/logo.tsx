import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 group select-none", className)}>
      <div className="relative flex items-center justify-center w-6 h-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-accent transition-transform duration-700 ease-out group-hover:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
            fill="currentColor"
          />
          <circle
            cx="12"
            cy="11"
            r="1"
            fill="var(--background)"
            className="opacity-80"
          />
        </svg>
      </div>
      <span className="font-logo text-xl font-medium tracking-tighter text-foreground flex items-center">
        sodhruv<span className="text-accent ml-0.5">.</span>
      </span>
    </div>
  );
}
