import { NextRequest, NextResponse } from "next/server";
import { getCafe24AuthUrl } from "@/lib/cafe24";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUrl = getCafe24AuthUrl();
    console.log("[Admin OAuth Login] Redirecting to Cafe24 OAuth URL:", authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("[Admin OAuth Login] Error redirecting to Cafe24:", error);
    return NextResponse.json(
      { error: "Failed to initiate Cafe24 login flow", details: error.message },
      { status: 500 }
    );
  }
}
