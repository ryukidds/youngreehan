import { NextRequest, NextResponse } from "next/server";
import { cafe24Fetch } from "@/lib/cafe24";

/**
 * POST /api/cafe24/customers/register
 * Creates a new customer via Cafe24 Admin API
 * 
 * Body: {
 *   member_id: string,
 *   name: string,
 *   email: string,
 *   password: string,
 *   phone?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { member_id, name, email, password, phone } = body;

    // Validate required fields
    if (!member_id || !name || !email || !password) {
      return NextResponse.json(
        { error: "member_id, name, email, password는 필수입니다." },
        { status: 400 }
      );
    }

    // Create customer via Admin API
    const customerPayload = {
      request: {
        member_id,
        name,
        email,
        password,
        ...(phone && { cellphone: phone }),
      },
    };

    const result = await cafe24Fetch("/customers", {
      method: "POST",
      body: JSON.stringify(customerPayload),
    });

    return NextResponse.json({
      success: true,
      customer: result?.customer || result,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[Customer Register] Error:", errorMessage);

    // Check for duplicate member_id
    if (errorMessage.includes("422") || errorMessage.includes("duplicate")) {
      return NextResponse.json(
        { error: "이미 등록된 회원 ID입니다." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
