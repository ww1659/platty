import { supaGetAllEvents } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const res = await supaGetAllEvents();
  const data = res;
  return Response.json(data);
}
