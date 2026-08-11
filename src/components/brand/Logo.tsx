import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="5" r="2.4" />
          <circle cx="5" cy="18" r="2.4" />
          <circle cx="19" cy="18" r="2.4" />
          <path d="M12 7.4 6.5 15.6M12 7.4l5.5 8.2M7.4 18h9.2" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight">
          Skill<span className="text-primary">Graph</span>
        </span>
      )}
    </span>
  );
}
