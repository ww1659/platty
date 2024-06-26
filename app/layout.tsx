"use client";

import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import { UserProvider, useAuth } from "@/context/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const urlValid = useMemo(() => {
    if (isLoading) {
      return false;
    }
    if (
      (pathname === "/login" ||
        pathname === "/sign-up" ||
        pathname === "/login-error") &&
      user
    ) {
      return false;
    }
    return true;
  }, [pathname, user, isLoading]);

  useEffect(() => {
    if (!isLoading && !urlValid && user) {
      router.push("/");
    }
  }, [isLoading, urlValid, user, router]);

  return (
    <>
      {user && pathname !== "/test" && <Navbar />}
      {urlValid && children}
    </>
  );
};

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
