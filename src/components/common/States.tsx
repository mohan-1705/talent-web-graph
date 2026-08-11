import { AlertTriangle, Inbox, RefreshCw, DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface space-y-3 p-5">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or search terms.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-5" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  message = "Unable to connect to the graph database.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const isDb = message.toLowerCase().includes("graph database");
  return (
    <div className="surface flex flex-col items-center gap-3 border-destructive/25 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        {isDb ? <DatabaseZap className="size-5" /> : <AlertTriangle className="size-5" />}
      </span>
      <h3 className="text-base font-semibold">{message}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        The backend could not reach CognoDB Cloud over Bolt. Your data is safe — retry in a moment.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-1 gap-2">
          <RefreshCw className="size-4" /> Try Again
        </Button>
      )}
    </div>
  );
}
