import { NextRequest, NextResponse } from "next/server";
import { cafe24Fetch } from "@/lib/cafe24";

/**
 * GET /api/cafe24/categories
 * Fetches product categories from Cafe24 Admin API
 */
export async function GET(request: NextRequest) {
  try {
    const data = await cafe24Fetch("/categories");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Categories] API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories from Cafe24", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
