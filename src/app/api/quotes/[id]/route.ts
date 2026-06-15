import { NextRequest, NextResponse } from "next/server";
import { updateQuote, getQuoteById } from "@/lib/db";
import { createPersonalPaymentLink } from "@/lib/cafe24";
import { getCurrentUser, isAdminUser } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = await getQuoteById(id);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "견적 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Security Gate Check
    const admin = await isAdminUser();
    const currentUser = await getCurrentUser();
    const isOwner = currentUser && quote.userId && currentUser.toLowerCase() === quote.userId.toLowerCase();
    
    const cookieStore = await cookies();
    const isAuthorizedByCookie = cookieStore.get(`authorized_quote_${id}`)?.value === "true";

    const hasPassword = !!quote.password;

    if (hasPassword && !admin && !isOwner && !isAuthorizedByCookie) {
      return NextResponse.json(
        { success: false, error: "비인가된 접근입니다. 비밀번호 확인이 필요합니다." },
        { status: 403 }
      );
    }

    // Strip password from the response
    const { password: _, ...quoteWithoutPassword } = quote;

    return NextResponse.json({ success: true, quote: quoteWithoutPassword });
  } catch (error: any) {
    console.error(`Error in GET /api/quotes/[id]:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = await getQuoteById(id);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "견적 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Security Gate Check
    const admin = await isAdminUser();
    const currentUser = await getCurrentUser();
    const isOwner = currentUser && quote.userId && currentUser.toLowerCase() === quote.userId.toLowerCase();
    
    const cookieStore = await cookies();
    const isAuthorizedByCookie = cookieStore.get(`authorized_quote_${id}`)?.value === "true";

    const hasPassword = !!quote.password;

    if (hasPassword && !admin && !isOwner && !isAuthorizedByCookie) {
      return NextResponse.json(
        { success: false, error: "비인가된 접근입니다. 비밀번호 확인이 필요합니다." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { totalPrice, action } = body;

    // 1. Comment Action
    if (action === "add_comment") {
      const { comment } = body;
      if (!comment || !comment.message) {
        return NextResponse.json({ success: false, error: "댓글 내용이 비어있습니다." }, { status: 400 });
      }

      // If non-admin is sending comment, force sender badge to "USER" and ensure correct senderId
      let sender = comment.sender;
      let senderId = comment.senderId;

      if (!admin) {
        sender = "USER";
        senderId = currentUser || comment.senderId || "비회원";
      }

      const newComment = {
        id: `C-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender,
        senderId,
        message: comment.message,
        createdAt: new Date().toISOString(),
      };

      const updatedComments = quote.comments ? [...quote.comments, newComment] : [newComment];
      const updated = await updateQuote(id, { comments: updatedComments });
      
      // Strip password from returned quote
      if (updated) {
        delete updated.password;
      }
      return NextResponse.json({ success: true, quote: updated });
    }

    // 2. Approve Action (Admin Only)
    if (action === "approve") {
      if (!admin) {
        return NextResponse.json({ success: false, error: "관리자만 승인할 수 있습니다." }, { status: 403 });
      }
      const result = await createPersonalPaymentLink(id, totalPrice, "단체티 커스텀 의류");
      
      const updated = await updateQuote(id, {
        status: "APPROVED",
        totalPrice,
        paymentUrl: result.paymentUrl,
        productNo: result.productNo,
      });

      if (updated) {
        delete updated.password;
      }
      return NextResponse.json({ success: true, quote: updated });
    }

    // 3. Reject Action (Admin Only)
    if (action === "reject") {
      if (!admin) {
        return NextResponse.json({ success: false, error: "관리자만 반려할 수 있습니다." }, { status: 403 });
      }
      const updated = await updateQuote(id, {
        status: "REJECTED",
      });
      if (updated) {
        delete updated.password;
      }
      return NextResponse.json({ success: true, quote: updated });
    }

    // 4. Default update (e.g. mock payment updating status to PAID)
    if (!admin) {
      // Must be owner or authorized by cookie
      if (!isOwner && !isAuthorizedByCookie) {
        return NextResponse.json(
          { success: false, error: "권한이 없습니다." },
          { status: 403 }
        );
      }

      // Check if trying to update fields other than status, or setting status to anything other than PAID
      const keys = Object.keys(body);
      if (keys.length !== 1 || keys[0] !== "status" || body.status !== "PAID") {
        return NextResponse.json(
          { success: false, error: "허용되지 않는 수정 항목 또는 값입니다." },
          { status: 400 }
        );
      }

      // Check if current status is APPROVED
      if (quote.status !== "APPROVED") {
        return NextResponse.json(
          { success: false, error: "승인된 견적만 결제할 수 있습니다." },
          { status: 400 }
        );
      }

      const updated = await updateQuote(id, { status: "PAID" });
      if (updated) {
        delete updated.password;
      }
      return NextResponse.json({ success: true, quote: updated });
    }

    // Default admin update
    const updated = await updateQuote(id, body);
    if (updated) {
      delete updated.password;
    }
    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    console.error(`Error in PATCH /api/quotes/[id]:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update quote" },
      { status: 500 }
    );
  }
}


