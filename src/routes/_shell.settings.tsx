import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { currentUser } from "@/lib/graph-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SkillGraph" },
      { name: "description", content: "Manage your profile, notifications, preferences and account settings." },
      { property: "og:title", content: "Settings — SkillGraph" },
      { property: "og:description", content: "Profile, notification and account preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile, notifications and account.</p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <section className="surface space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue={currentUser.name} maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" type="email" defaultValue={currentUser.email} maxLength={120} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" defaultValue={currentUser.title} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} maxLength={500} defaultValue="Full-stack engineer who likes graphs, developer tooling and shipping fast." />
            </div>
            <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
          </section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <section className="surface divide-y divide-border">
            {[
              ["New job matches", "Get notified when a new role scores above 75%."],
              ["Skill recommendations", "Weekly digest of skills that unlock more roles."],
              ["Application updates", "Status changes on jobs you applied to."],
              ["Product updates", "Occasional news about SkillGraph."],
            ].map(([title, desc], i) => (
              <div key={title} className="flex items-center justify-between gap-6 p-5">
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch defaultChecked={i < 3} onCheckedChange={() => toast("Notification preference saved")} />
              </div>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <section className="surface space-y-4 p-6">
            <div className="space-y-2">
              <Label>Preferred role</Label>
              <Select defaultValue="fullstack">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                  <SelectItem value="frontend">Frontend Engineer</SelectItem>
                  <SelectItem value="platform">Platform Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-6 rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium">Show graph previews</p>
                <p className="text-sm text-muted-foreground">Render inline graph paths on job cards and details.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
          </section>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <section className="surface space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="pwd">New password</Label>
              <Input id="pwd" type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" onClick={() => toast.success("Password updated")}>Update password</Button>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">Delete account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This removes your user node and all of its relationships from the graph.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-3">Delete account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent and detaches every HAS_SKILL, APPLIED_TO and INTERESTED_IN edge.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.error("Account deletion is disabled in the demo")}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
