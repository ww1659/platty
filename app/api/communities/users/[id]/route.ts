import { supaGetCommunitiesByUserId } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const res = await supaGetCommunitiesByUserId(userId);
  const data = res;
  return Response.json(data);
}
