import { Suspense, lazy } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useUser } from "@/contexts/UserContext";

const WelcomeChooser = lazy(() => import("@/components/WelcomeChooser"));

/** Loads the new-account welcome only for signed-in visitors, once their profile has loaded. */
export function WelcomeChooserGate() {
  const { user, userData, facultyId } = useUser();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (!user || !userData || !user.created_at) return null;
  const firstName = (userData.name ?? "").trim().split(/\s+/)[0] ?? "";
  return (
    <Suspense fallback={null}>
      <WelcomeChooser
        userId={user.id}
        createdAt={user.created_at}
        firstName={firstName}
        hasFacultyId={!!facultyId}
        path={path}
      />
    </Suspense>
  );
}
