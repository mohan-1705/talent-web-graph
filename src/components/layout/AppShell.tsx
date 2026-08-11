import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell, Briefcase, Building2, LayoutDashboard, Lightbulb, Menu, Search,
  Settings, Share2, Sparkles, User as UserIcon, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { currentUser } from "@/lib/graph-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Explore Jobs", icon: Briefcase },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/graph", label: "Graph Explorer", icon: Share2 },
  { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-sidebar-border bg-accent/40 p-4">
          <p className="text-xs font-semibold text-accent-foreground">Graph engine</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Live traversals on CognoDB Cloud via openCypher.
          </p>
          <Badge variant="secondary" className="mt-3 gap-1.5 text-[11px]">
            <span className="size-1.5 rounded-full bg-success" /> Connected
          </Badge>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search skills, jobs, companies…" className="pl-9" aria-label="Global search" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
            </Button>
            <Link to="/profile" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-muted">
              <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {currentUser.name[0]}
              </span>
              <span className="hidden text-sm font-medium sm:block">{currentUser.name}</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
