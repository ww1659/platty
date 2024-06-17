"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HoldingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  console.log(userId);

  useEffect(() => {
    if (!userId) {
      router.push("/signup");
    }
  }, [userId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="my-5">Thank you for signing up!</h1>
      <p className="my-5">Your account has been created successfully.</p>
      {/* <p className="my-3">Please check your email for further instructions.</p> */}
      <Button onClick={() => router.push("/")}>Go to Home Page</Button>
    </div>
  );
}
