"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/context/UserContext";

export default function LoginPage() {
  const supabase = createClient();
  const { session } = useAuth();

  const googleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar",
        },
      });

      if (error) {
        console.error("Google sign in error:", error);
        return;
      }
      console.log(data, "DATA");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-start justify-start">
      <div className="container mt-5">
        <div className="flex items-center justify-center mb-5">
          <h3 className="w-[400px]">Log in or sign up</h3>
        </div>
        <div className="flex items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex items-center justify-center mt-5">
          {session === null ? (
            <Button variant="secondary" onClick={() => googleSignIn()}>
              Sign in with Google
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
