import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, saveTokens } from "@/lib/cafe24";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("[OAuth Callback] Cafe24 auth error:", error, errorDescription);
    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("auth_error", `${error}: ${errorDescription || ""}`);
    return NextResponse.redirect(adminUrl.toString());
  }

  if (!code) {
    console.error("[OAuth Callback] No code provided in callback query");
    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("auth_error", "No authorization code returned");
    return NextResponse.redirect(adminUrl.toString());
  }

  try {
    console.log("[OAuth Callback] Exchanging authorization code for access token...");
    const tokenData = await exchangeCodeForToken(code);
    
    // Save tokens locally in the JSON file and to Supabase
    await saveTokens(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn, tokenData.mallId);
    console.log("[OAuth Callback] Admin authentication token successfully saved!");

    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("auth_success", "true");
    return NextResponse.redirect(adminUrl.toString());
  } catch (err: any) {
    console.error("[OAuth Callback] Failed to exchange code or save tokens:", err);
    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("auth_error", err.message || "Token exchange failed");
    return NextResponse.redirect(adminUrl.toString());
  }
}
