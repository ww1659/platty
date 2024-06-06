import { supaGetEventsByUserId, supaUpdateCalendarStatus } from "@/lib/queries";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  let res = await supaGetEventsByUserId(userId);
  let data = res;
  return Response.json(data);
}

export async function POST(request: Request) {
  const { eventId, userId } = await request.json();
  let res = await supaUpdateCalendarStatus(eventId, userId);
  let data = res;
  return Response.json(data);
}
