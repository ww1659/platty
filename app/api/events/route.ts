import { supaGetAllEvents } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const communityFilter = searchParams.get("community");
  const priceFilter = searchParams.get("price");
  const searchQuery = searchParams.get("search");
  const res = await supaGetAllEvents(communityFilter, priceFilter, searchQuery);
  const data = res;
  return Response.json(data);
}
