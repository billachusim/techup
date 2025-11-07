import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

  useEffect(() => {
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

    return () => subscription.unsubscribe();
  }, []);

  const login = (authUser: User, profile: any) => {
    setUser(authUser);
    setFacultyId(profile.faculty_id);
    setUserData(profile);
    setIsLoggedIn(true);
  };

  const logout = async () => {
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
