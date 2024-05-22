import { getEventById } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const eventId = url.pathname.slice(-1);
  let res = await getEventById(eventId);
  let data = res;
  return Response.json(data);
}
