import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("cafe24_user");
    if (cookie && cookie.value) {
      return NextResponse.json({
        loggedIn: true,
        userId: decodeURIComponent(cookie.value),
      });
    }
    return NextResponse.json({
      loggedIn: false,
      userId: null,
    });
  } catch (error: any) {
    console.error("[Auth Me API] Error getting session:", error);
    return NextResponse.json({
      loggedIn: false,
      userId: null,
      error: error.message,
    });
  }
}
