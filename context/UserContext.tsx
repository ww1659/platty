"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error("Error getting user:", userError);
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Error getting user profile:", profileError);
        setIsLoading(false);
        return;
      }

      setUser({
        id: userData.user.id,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
      });
      setIsLoading(false);
    };

    getUserProfile();
  }, []);

  const login = async () => {};

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
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
