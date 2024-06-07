import { supaAddUserEvent, supaGetEventByEventId } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const eventId = params.id;

  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ status: 400, error: "Invalid eventId" });
  }

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ status: 400, error: "Invalid userId" });
  }

  try {
    const event = await supaGetEventByEventId(eventId, userId);

    if (!event) {
      return NextResponse.json({ status: 404, error: "Error not found" });
    } else return NextResponse.json({ status: 200, eventData: event });
  } catch (error) {
    console.error(error);
    NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  const { userId } = await request.json();
  const res = await supaAddUserEvent(eventId, userId);
  const data = res;
  return Response.json(data);
}
