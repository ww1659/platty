"use client";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/theme-provider";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { createClient } from "@/supabase/client";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

//only for server components....
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  // const [user, setUser] = useState<User>();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     if (error) {
  //       console.error("Error fetching user data:", error);
  //       setUser(undefined);
  //     } else {
  //       setUser(data?.user);
  //     }
  //     setLoading(false);
  //   };

  //   getUser();
  // }, [supabase.auth]);

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
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
