import { supaGetEventById } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  let res = await supaGetEventById(eventId);
  let data = res;
  return Response.json(data);
}
