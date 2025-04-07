import { FacebookConversionsAPI } from "@/lib/analytics/facebook";
import { NextRequest, NextResponse } from "next/server";

const facebookApi = new FacebookConversionsAPI(
  process.env.FACEBOOK_PIXEL_ID!,
  process.env.FACEBOOK_ACCESS_TOKEN!,
);

export async function POST(request: NextRequest) {
  try {
    const { eventName, url, userAgent } = await request.json();

    if (!eventName || !url || !userAgent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let response;
    switch (eventName) {
      case "ViewContent":
        response = await facebookApi.trackViewContent(url, userAgent);
        break;
      case "InitiateCheckout":
        response = await facebookApi.trackInitiateCheckout(url, userAgent);
        break;
      default:
        return NextResponse.json({ error: "Invalid event name" }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Facebook Conversions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
