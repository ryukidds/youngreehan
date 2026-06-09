import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const userId = await getCurrentUser();
    return NextResponse.json({ loggedIn: userId !== null, userId });
  } catch {
    return NextResponse.json({ loggedIn: false, userId: null });
  }
}
