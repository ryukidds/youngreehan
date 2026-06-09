import { NextRequest, NextResponse } from "next/server";
import { updateQuote } from "@/lib/db";
import { createPersonalPaymentLink } from "@/lib/cafe24";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { totalPrice, action } = body;

    if (action === "approve") {
      const paymentUrl = await createPersonalPaymentLink(id, totalPrice, "단체티 커스텀 의류");
      
      const updated = await updateQuote(id, {
        status: "APPROVED",
        totalPrice,
        paymentUrl,
      });

      return NextResponse.json({ success: true, quote: updated });
    }

    if (action === "reject") {
      const updated = await updateQuote(id, {
        status: "REJECTED",
      });
      return NextResponse.json({ success: true, quote: updated });
    }

    // Default update
    const updated = await updateQuote(id, body);
    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    console.error(`Error in PATCH /api/quotes/[id]:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update quote" },
      { status: 500 }
    );
  }
}
