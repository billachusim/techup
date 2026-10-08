import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "@/lib/router-compat";
import { useIsStaff } from "@/hooks/useIsStaff";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/students", label: "Students" },
  { to: "/admin/talent", label: "Talent" },
  { to: "/admin/certificates", label: "Certificates", adminOnly: true },
];

/** Shared admin navigation, so every admin page is one tap from the dashboard and the others. */
export default function AdminNav() {
  const { pathname } = useLocation();
  const { isStaff, isAdmin } = useIsStaff();
  if (!isStaff) return null;
  const current = pathname.replace(/\/+$/, "") || "/";
  const items = ITEMS.filter((i) => !i.adminOnly || isAdmin);

  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-2">
      {current !== "/admin" && (
        <Link
          to="/admin"
          className="mr-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>
      )}
      <ul className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = current === item.to;
          return (
            <li key={item.to} className="shrink-0">
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
