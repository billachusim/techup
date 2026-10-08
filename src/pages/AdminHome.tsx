import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import { Award, BriefcaseBusiness, GraduationCap, Loader2, type LucideIcon } from "lucide-react";
import { useIsStaff } from "@/hooks/useIsStaff";
import { AdminMetrics } from "@/components/admin/AdminMetrics";

interface Section {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const SECTIONS: Section[] = [
  {
    to: "/admin/students",
    title: "Students",
    description: "Confirm WhatsApp, email and bank payments, and review weekly student work.",
    icon: GraduationCap,
  },
  {
    to: "/admin/talent",
    title: "Talent",
    description: "Roles, applications, matches, engagements and hiring requests.",
    icon: BriefcaseBusiness,
  },
  {
    to: "/admin/certificates",
    title: "Certificates",
    description: "Issue certificates to students who finish a programme.",
    icon: Award,
    adminOnly: true,
  },
];

/** Staff landing page: one place to reach every admin area this account can use. */
export default function AdminHome() {
  const { loading, isStaff, isAdmin } = useIsStaff();
  const sections = SECTIONS.filter((s) => !s.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-muted-foreground">Choose an area to manage.</p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isStaff ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This page is for Tech Faculty staff. Sign in with a staff account.</p>
            <Link to="/login?next=/admin">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map(({ to, title, description, icon: Icon }) => (
                <Link key={to} to={to} className="group">
                  <Card className="h-full transition-colors group-hover:border-primary/50">
                    <CardContent className="p-5 space-y-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {/* Business numbers are for admins; recruiters only see the areas above. */}
            {isAdmin && <AdminMetrics />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
