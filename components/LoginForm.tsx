"use client";
import { supaLogin } from "@/lib/serverActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { useAuth } from "@/context/UserContext";
import { Icons } from "./Icons";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<{
    status: number | null | undefined;
    msg: string | null;
  }>({ status: null, msg: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.log(authError.message);
        setLoading(false);
        setLoginError({ status: authError.status, msg: authError.message });
        return;
      } else {
        setLoading(false);
        setLoginError({ status: null, msg: null });
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      router.push("/error");
      setLoading(false);
    }
  }

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar",
        },
      });

      if (error) {
        console.error("Google sign in error:", error);
        setLoading(false);
        return;
      }
      setLoading(false);
      console.log(data, "DATA");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid gap-3">
      {loginError.status !== null && (
        <p className="text-destructive text-sm font-bold">
          Login Error: {loginError.msg}
        </p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {session === null ? (
          <Button
            variant="secondary"
            className="w-full"
            disabled={loading}
            onClick={() => googleSignIn()}
          >
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        ) : null}
      </div>
    </div>
  );
}
