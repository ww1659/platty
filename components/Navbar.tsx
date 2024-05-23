"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

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
            <Link
              href="/login"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/login" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
