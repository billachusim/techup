import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import {
  getSupabase,
  isAuthStorageKey,
  isSupabaseLoaded,
  mightHaveSession,
  onSupabaseLoaded,
} from "@/integrations/supabase/lazy";

interface UserContextType {
  isLoggedIn: boolean;
  facultyId: string | null;
  userData: any | null;
  user: User | null;
  setUserData: (data: any) => void;
  login: (user: User, profile: any) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // The Supabase client loads only when this browser may have a session, or
  // once something else on the page loads it (a sign-in form, a dashboard).
  // Until then the visitor is treated as signed out, which they are.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const stopWaiting = onSupabaseLoaded((supabase) => {
      // Check for existing Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);

          // Fetch user profile
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                setFacultyId(profile.faculty_id);
                setUserData(profile);
              }
            });
        }
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);

          // Fetch user profile
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                setFacultyId(profile.faculty_id);
                setUserData(profile);
              }
            });
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setFacultyId(null);
          setUserData(null);
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    // A sign-in in another tab writes the token here too.
    const onStorage = (event: StorageEvent) => {
      if (isAuthStorageKey(event.key) && event.newValue) void getSupabase();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      stopWaiting();
      unsubscribe?.();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Checked again on navigation, so a session started by a page that imports
  // the client directly is picked up on the next page.
  useEffect(() => {
    if (!isSupabaseLoaded() && mightHaveSession()) void getSupabase();
  }, [pathname]);

  const login = (authUser: User, profile: any) => {
    setUser(authUser);
    setFacultyId(profile.faculty_id);
    setUserData(profile);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setFacultyId(null);
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, facultyId, userData, user, setUserData, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
