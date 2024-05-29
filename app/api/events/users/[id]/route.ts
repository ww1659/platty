import { supaGetEventsByUserId } from "@/lib/queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const splitUrl = url.pathname.split("/");
  const userId = splitUrl[splitUrl.length - 1];
  let res = await supaGetEventsByUserId(userId);
  let data = res;
  return Response.json(data);
}
