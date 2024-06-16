"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/context/UserContext";
import { CreateEventDialog } from "./CreateEventDialog";
import { Badge } from "./ui/badge";
import { DarkModeToggle } from "./DarkModeToggle";
import { useState } from "react";
import { Icons } from "./Icons";

export default function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user, isLoading, logout, communityAdmin, profile, session } =
    useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutLoading(true);
    setTimeout(() => {
      logout();
      router.push("/login");
      setLogoutLoading(false);
    }, 2000);
  };

  if (user === undefined || user === null || isLoading) {
    return null;
  }

  const siteAdmin = profile?.isSiteAdmin;
  const googleSignIn = session?.provider_token;

  return (
    <header className="sticky top-0 bg-background w-full z-50 border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href="/"
            className={cn("transition-colors hover:text-foreground/80")}
          >
            <h3 className="leading-loose">Platty</h3>
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
            {user && (
              <Link
                href={`/communities`}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === `/communities`
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Communities
              </Link>
            )}
            {user && (communityAdmin || siteAdmin) && (
              <CreateEventDialog userId={user.id} siteAdmin={siteAdmin} />
            )}
          </nav>
        </div>
        <div className="flex flex-row items-center gap-5 ml-auto">
          {googleSignIn && <Icons.google className="h-4 w-4" />}
          {user && <code>u/{profile?.firstName}</code>}
          <DarkModeToggle />
          <Button size="sm" onClick={handleLogout}>
            {logoutLoading ? (
              <div className="flex flex-row items-center opacity-70">
                <p>Logout</p>
                <Icons.spinner className="h-4 w-4 animate-spin ml-2" />
              </div>
            ) : (
              <p>Logout</p>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
