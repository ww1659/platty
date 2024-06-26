import { supaGetAllEvents, supaGetAllValidEvents } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const communityFilter = searchParams.get("community");
  const priceFilter = searchParams.get("price");
  const searchQuery = searchParams.get("search");
  const dateQuery = searchParams.get("month");
  const userId = searchParams.get("userId");
  const res = await supaGetAllValidEvents(
    communityFilter,
    priceFilter,
    searchQuery,
    dateQuery,
    userId
  );

  const data = res;
  return Response.json(data);
}
