import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL("/login", req.url));
    // Set cookie to expire immediately
    response.cookies.set("cafe24_user", "", {
      path: "/",
      expires: new Date(0),
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    console.error("[Auth Logout API] Error during logout:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
