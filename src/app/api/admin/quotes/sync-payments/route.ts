import { NextRequest, NextResponse } from "next/server";
import { getQuotes, updateQuote } from "@/lib/db";
import { cafe24Fetch, Cafe24AuthError } from "@/lib/cafe24";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const handleResponse = (data: any, status = 200) => {
    const acceptHeader = req.headers.get("accept") || "";
    const isFormSubmit = req.headers.get("content-type")?.includes("x-www-form-urlencoded") || acceptHeader.includes("text/html");
    
    if (isFormSubmit) {
      const referer = req.headers.get("referer") || "/admin";
      const redirectUrl = new URL(referer, req.url);
      if (data.success) {
        redirectUrl.searchParams.set("sync_success", "true");
        redirectUrl.searchParams.set("sync_count", String(data.updatedCount));
      } else {
        redirectUrl.searchParams.set("sync_error", data.message || "Unknown error");
      }
      return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
    }
    return NextResponse.json(data, { status });
  };

  try {
    // 1. Get all quotes from database
    const quotes = await getQuotes();
    
    // Filter quotes that are approved and have a Cafe24 product registered
    const approvedQuotes = quotes.filter(
      (q) => q.status === "APPROVED" && q.productNo
    );

    if (approvedQuotes.length === 0) {
      return handleResponse({
        success: true,
        updatedCount: 0,
        message: "동기화할 승인 대기 결제 건이 없습니다.",
      });
    }

    // 2. Fetch orders from Cafe24 for the last 60 days
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    const startDate = sixtyDaysAgo.toISOString().split("T")[0];
    const endDate = today.toISOString().split("T")[0];

    console.log(`[Sync Payments] Fetching Cafe24 orders from ${startDate} to ${endDate}...`);
    
    // We request embedded items to read product_no inside orders
    const ordersData = await cafe24Fetch(
      `/orders?start_date=${startDate}&end_date=${endDate}&limit=100&embed=items`
    );

    const orders = ordersData?.orders || [];
    console.log(`[Sync Payments] Fetched ${orders.length} orders from Cafe24.`);

    let updatedCount = 0;
    const updatedQuoteIds: string[] = [];

    // 3. Match orders to approved quotes
    for (const quote of approvedQuotes) {
      const targetProductNo = Number(quote.productNo);
      
      // Find an order that contains this product and is paid
      const matchingPaidOrder = orders.find((order: any) => {
        const hasProduct = order.items?.some(
          (item: any) => Number(item.product_no) === targetProductNo
        );

        if (!hasProduct) return false;

        // Check if paid: is_paid is 'T', or payment_status is 'paid', or order_status indicates payment was received
        const isPaid =
          order.is_paid === "T" ||
          order.payment_status === "paid" ||
          (order.order_status !== "N00" && !order.order_status.startsWith("C"));

        return isPaid;
      });

      if (matchingPaidOrder) {
        console.log(
          `[Sync Payments] Match found! Quote ${quote.id} corresponds to paid Cafe24 Order ${matchingPaidOrder.order_id}`
        );
        
        // Update quote status to PAID in the database
        await updateQuote(quote.id, {
          status: "PAID",
          updatedAt: new Date().toISOString(),
        });
        
        updatedCount++;
        updatedQuoteIds.push(quote.id);
      }
    }

    return handleResponse({
      success: true,
      updatedCount,
      updatedQuoteIds,
      message: `${updatedCount}개의 견적이 결제 완료 상태로 동기화되었습니다.`,
    });
  } catch (error: any) {
    console.error("[Sync Payments] Error syncing payment status:", error);
    
    if (error instanceof Cafe24AuthError || error.message?.includes("tokens")) {
      return handleResponse(
        {
          success: false,
          error: "AUTH_REQUIRED",
          message: "카페24 API 연동 인증이 필요합니다. 관리자 로그인 연동 버튼을 클릭하세요.",
        },
        401
      );
    }

    return handleResponse(
      {
        success: false,
        error: "SYNC_ERROR",
        message: "결제 상태 동기화 중 오류가 발생했습니다.",
        details: error.message,
      },
      500
    );
  }
}
