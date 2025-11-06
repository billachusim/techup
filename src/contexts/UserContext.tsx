import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  facultyId: string | null;
  userData: any | null;
  setUserData: (data: any) => void;
  login: (id: string, data: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedFacultyId = localStorage.getItem("facultyId");
    const storedUserData = localStorage.getItem("userData");
    
    if (storedFacultyId && storedUserData) {
      setFacultyId(storedFacultyId);
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (id: string, data: any) => {
    setFacultyId(id);
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem("facultyId", id);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const logout = () => {
    setFacultyId(null);
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem("facultyId");
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, facultyId, userData, setUserData, login, logout }}>
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
