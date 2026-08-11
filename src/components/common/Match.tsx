import { cn } from "@/lib/utils";

export function MatchRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 75 ? "text-success" : value >= 50 ? "text-primary" : "text-warning";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="5" className="stroke-muted" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          className={cn("stroke-current transition-[stroke-dashoffset] duration-700", tone)}
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold">{value}%</span>
    </div>
  );
}

export function MatchBadge({ value }: { value: number }) {
  const tone =
    value >= 75
      ? "bg-success/12 text-success"
      : value >= 50
        ? "bg-primary/12 text-primary"
        : "bg-warning/15 text-warning-foreground";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>{value}% Match</span>
  );
}
