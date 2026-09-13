import { Link, useLocation } from "react-router-dom";
import { useIsStaff } from "@/hooks/useIsStaff";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string };

/**
 * Shared marketplace navigation. Keeps every talent page one tap away from
 * the others so people never get stranded on the dashboard or a role page.
 */
const TalentNav = () => {
  const { pathname } = useLocation();
  const { isLoggedIn } = useUser();
  const { isStaff } = useIsStaff();

  const items: NavItem[] = [
    { to: "/careers", label: "Open roles" },
    { to: "/talent/pool", label: "Talent directory" },
    { to: "/hire", label: "Hire talent" },
    isLoggedIn
      ? { to: "/talent/dashboard", label: "My dashboard" }
      : { to: "/login?next=/talent/profile", label: "Join as talent" },
  ];
  if (isLoggedIn) items.push({ to: "/talent/profile", label: "My profile" });
  if (isStaff) items.push({ to: "/admin/talent", label: "Admin" });

  return (
    <nav aria-label="Talent marketplace" className="border-b border-border bg-card/40">
      <div className="container mx-auto max-w-6xl px-4">
        <ul className="-mx-1 flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const active = pathname === item.to.split("?")[0];
            return (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
      </div>
    </nav>
  );
};

export default TalentNav;
