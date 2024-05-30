import { supaGetEventsByUserId, supaUpdateCalendarStatus } from "@/lib/queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const splitUrl = url.pathname.split("/");
  const userId = splitUrl[splitUrl.length - 1];
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
