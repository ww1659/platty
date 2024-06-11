import { supaGetAllEvents } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let res = await supaGetAllEvents();
  let data = res;
  return Response.json(data);
}
