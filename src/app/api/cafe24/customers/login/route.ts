import { NextRequest, NextResponse } from "next/server";
import { cafe24Fetch } from "@/lib/cafe24";

/**
 * POST /api/cafe24/customers/login
 * Authenticates a customer via Cafe24 Admin API
 * 
 * Body: { member_id: string, password: string }
 * 
 * Note: Cafe24 Admin API does not have a direct "login" endpoint.
 * We verify the customer by looking them up by member_id.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { member_id } = body;

    if (!member_id) {
      return NextResponse.json(
        { error: "member_id is required" },
        { status: 400 }
      );
    }

    // Look up the customer by member_id
    const customerData = await cafe24Fetch(`/customers?member_id=${encodeURIComponent(member_id)}`);
    const customers = customerData?.customers || [];

    if (customers.length === 0) {
      return NextResponse.json(
        { error: "등록되지 않은 회원입니다." },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // Create a customer session cookie
    const customerSession = {
      member_id: customer.member_id,
      name: customer.name,
      email: customer.email,
      group_no: customer.group_no,
    };

    const response = NextResponse.json({
      success: true,
      customer: customerSession,
    });

    const isProd = process.env.NODE_ENV === "production";
    const secureFlag = isProd ? "; Secure" : "";

    // Set customer session cookie
    response.headers.append(
      "Set-Cookie",
      `cafe24_customer=${encodeURIComponent(JSON.stringify(customerSession))}; HttpOnly${secureFlag}; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    );

    // Set cafe24_user cookie for frontend UI context compatibility
    response.headers.append(
      "Set-Cookie",
      `cafe24_user=${encodeURIComponent(customer.member_id)}${secureFlag}; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    );

    return response;
  } catch (err) {
    console.error("[Customer Login] Error:", err);
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
