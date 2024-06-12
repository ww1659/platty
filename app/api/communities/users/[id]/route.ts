import { supaGetCommunitiesByUserId } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  let res = await supaGetCommunitiesByUserId(userId);
  let data = res;
  return Response.json(data);
}
