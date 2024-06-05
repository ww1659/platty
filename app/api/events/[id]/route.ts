import { supaAddUserEvent, supaGetEventById } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  let res = await supaGetEventById(eventId);
  let data = res;
  return Response.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  const { userId } = await request.json();
  let res = await supaAddUserEvent(eventId, userId);
  let data = res;
  return Response.json(data);
}
