import { NextRequest, NextResponse } from "next/server";
import { fetchMappedProducts } from "@/lib/cafe24";

/**
 * GET /api/cafe24/products
 * Fetches products from Cafe24 Admin API and maps them to standard Product interface
 */
export async function GET(request: NextRequest) {
  try {
    const mappedProducts = await fetchMappedProducts();
    return NextResponse.json({ products: mappedProducts });
  } catch (err) {
    console.error("[Products] API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products from Cafe24", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
