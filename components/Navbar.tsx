"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { logout } from "@/utils/supabase/actions";

export default function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setLoading(false);
        console.log("No user:", error);
      } else {
        setLoading(false);
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    console.log("Logout Pressed");
    await logout();
    router.push("/");
  };

  console.log(user);

  return (
    <header className="sticky top-0 bg-background w-full z-50 border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href="/"
            className={cn("transition-colors hover:text-foreground/80")}
          >
            <h3> Platty</h3>
          </Link>

          <nav
            className={cn(
              "flex items-center gap-4 text-sm gap-6 ml-10",
              className
            )}
            {...props}
          >
            {" "}
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>
          </nav>
        </div>
        <div className="flex ml-auto">
          {user && !loading ? (
            <Button size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
