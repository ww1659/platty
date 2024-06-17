"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/supabase/client";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { checkAdminStatus, getProfileInfo } from "@/lib/serverActions";
import { Profile } from "@/types/Profile";
import { useRouter } from "next/navigation";

type UserContextType = {
  user: User | null | undefined;
  profile: Profile | null;
  session: Session | null;
  providers: String[] | [];
  authError: AuthError | null;
  communityAdmin: boolean;
  isLoading: boolean;
  login: (formData: FormData) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  session: null,
  providers: [],
  authError: null,
  communityAdmin: false,
  isLoading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [communityAdmin, setCommunityAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [providers, setProviders] = useState<string[]>([]);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const setData = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          setAuthError(error);
        }
        setSession(session);
        setUser(session?.user);

        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (!userError) {
          const userProviders = userData.user.app_metadata.providers;
          setProviders(userProviders);
        }

        if (session?.user) {
          const isCommunityAdmin = await checkAdminStatus(session?.user.id);
          setCommunityAdmin(isCommunityAdmin);

          const { profileData } = await getProfileInfo(session?.user.id);
          if (profileData && profileData.length > 0) {
            const profileInfo = profileData[0];
            setProfile({
              firstName: profileInfo.first_name,
              lastName: profileInfo.last_name,
              memberSince: profileInfo.created_at,
              isSiteAdmin: profileInfo.site_admin,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          setData();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async () => {
    supabase.auth.getUser();
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log(error);
    if (!error) {
      router.push("/login");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        session,
        providers,
        communityAdmin,
        authError,
        isLoading,
        login,
        logout,
      }}
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
