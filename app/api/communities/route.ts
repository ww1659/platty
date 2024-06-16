import { supaGetAllCommunities } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const res = await supaGetAllCommunities(userId);

  const data = res;
  return NextResponse.json(data);
}
