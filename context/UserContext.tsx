"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { checkAdminStatus, getProfileInfo } from "@/lib/serverActions";
import { Profile } from "@/types/Profile";

type UserContextType = {
  user: User | null | undefined;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  login: (formData: FormData) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  session: null,
  isAdmin: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);

      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setIsAdmin(isAdmin);
        const { profileData } = await getProfileInfo(session?.user.id);

        if (profileData && profileData.length > 0) {
          const profileInfo = profileData[0];
          setProfile({
            firstName: profileInfo.first_name,
            lastName: profileInfo.last_name,
            memberSince: profileInfo.created_at,
          });
        }
      }
      setIsLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user);
        setIsLoading(false);
      }
    );

    setData();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async () => {
    supabase.auth.getUser();
  };

  const logout = async () => {
    supabase.auth.signOut();
  };

  return (
    <UserContext.Provider
      value={{ user, profile, session, isAdmin, login, logout }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
