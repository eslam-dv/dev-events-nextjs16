import { NextRequest, NextResponse } from "next/server";
import { Event, IEvent } from "@/database/event.model"; // Adjust import path as needed
import { connectDB } from "@/lib/mongodb";

// API response types
type ErrorResponse = { message: string };
type SuccessResponse = IEvent;

// GET /api/events/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string }> },
) {
  try {
    // Validate slug parameter
    const { slug } = await params;
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json<ErrorResponse>(
        { message: "Missing or invalid slug parameter." },
        { status: 400 },
      );
    }

    await connectDB();

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase();

    // Find event by slug
    const event: IEvent | null = await Event.findOne({
      slug: sanitizedSlug,
    }).lean<IEvent>();

    if (!event) {
      return NextResponse.json<ErrorResponse>(
        { message: `Event not found for slug: ${sanitizedSlug}` },
        { status: 404 },
      );
    }

    // Success: return event data
    return NextResponse.json<SuccessResponse>(event, { status: 200 });
  } catch (error) {
    // Log error for debugging (avoid leaking sensitive info)
    console.error("GET /api/events/[slug] error:", error);
    return NextResponse.json<ErrorResponse>(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
