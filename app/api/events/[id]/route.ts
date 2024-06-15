import {
  supaAddUserEvent,
  supaGetEventByEventId,
  supaGetProfileByUserId,
} from "@/lib/queries";
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
    } else {
      const adminId = event.eventData.admin;
      if (!adminId) {
        return NextResponse.json({ status: 400, error: "Admin ID is missing" });
      }

      const admin = await supaGetProfileByUserId(adminId);
      const profile = {
        firstName: admin.profileData[0].first_name,
        lastName: admin.profileData[0].last_name,
      };
      return NextResponse.json({
        status: 200,
        eventData: event,
        adminData: profile,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
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
