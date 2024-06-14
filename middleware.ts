import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/login", "/sign-up"];

  const { pathname } = request.nextUrl;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
