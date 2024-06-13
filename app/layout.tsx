"use client";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/theme-provider";
import Navbar from "@/components/Navbar";
import { UserProvider, useAuth } from "@/context/UserContext";
import { createClient } from "@/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// const AuthGate = ({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) => {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   const allowedUnauthenticatedRoutes = ["/login", "/signup"];

//   useEffect(() => {
//     if (
//       !isLoading &&
//       !user &&
//       !allowedUnauthenticatedRoutes.includes(pathname)
//     ) {
//       router.push("/login");
//     }
//   }, [isLoading, user, router, pathname]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isLoading && !user && allowedUnauthenticatedRoutes.includes(pathname)) {
//     return <>{children}</>;
//   }

//   if (!isLoading && user) {
//     return <>{children}</>;
//   }

//   return null;
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <UserProvider>
          {/* <AuthGate> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
          {/* </AuthGate> */}
        </UserProvider>
      </body>
    </html>
  );
}
