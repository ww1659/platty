"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/context/UserContext";
// import { supaLogout } from "@/lib/actions";

export default function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // await supaLogout(); //server
    logout(); //client
    router.push("/login");
  };

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
            {user && (
              <Link
                href={`/events/users/${user.id}`}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === `/events/users/${user.id}`
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                My Events
              </Link>
            )}
          </nav>
        </div>
        <div className="flex ml-auto">
          {user ? (
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
