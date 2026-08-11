import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/brand/Logo";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { buildCareerGraph } from "@/lib/graph-build";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — SkillGraph" },
      { name: "description", content: "Sign in to SkillGraph and explore graph-powered job and skill recommendations." },
      { property: "og:title", content: "Sign in — SkillGraph" },
      { property: "og:description", content: "Graph-powered career intelligence for engineers." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("mohana@skillgraph.dev");
  const [password, setPassword] = useState("skillgraph");
  const [loading, setLoading] = useState(false);
  const graph = buildCareerGraph({ skillLimit: 4, jobLimit: 3 });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back, Mohana");
      navigate({ to: "/dashboard" });
    }, 600);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to see the jobs, skills and companies connected to your profile.
          </p>

          <form className="mt-8 space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" autoComplete="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" autoComplete="current-password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => toast("Password reset link sent", { description: email })}
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"} <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to SkillGraph?{" "}
            <Link to="/dashboard" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border mesh-bg lg:block">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-x-0 top-16 z-10 px-14">
          <h2 className="max-w-md text-2xl font-bold leading-snug">
            Your career, modelled as a graph.
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Every recommendation is a traversal: <span className="font-medium text-foreground">User → Skill → Job → Company</span>. No black boxes — just relationships you can see.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-52">
          <GraphCanvas nodes={graph.nodes} edges={graph.edges} interactive={false} className="!bg-transparent" />
        </div>
      </div>
    </div>
  );
}
