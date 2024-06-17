import { supaGetCommunityAdminId } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const communityId = params.id;

  const res = await supaGetCommunityAdminId(communityId);
  const data = res;
  return Response.json(data);
}
