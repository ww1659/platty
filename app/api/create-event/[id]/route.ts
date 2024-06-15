import { supaGetCommunityById, supaPostEvent } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const communityId = params.id;

  if (!communityId) {
    return Response.json(
      { error: "Community ID is required" },
      { status: 400 }
    );
  }

  if (communityId === "all") {
    return NextResponse.json({
      id: "all",
      name: "platty-all",
      description: "All members in your Organisation",
    });
  }

  try {
    const res = await supaGetCommunityById(communityId);

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventData = await request.json();
  const communityId = params.id;

  if (!communityId) {
    return Response.json(
      { error: "Community ID is required" },
      { status: 400 }
    );
  }

  try {
    const res = await supaPostEvent(eventData, communityId);
    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
