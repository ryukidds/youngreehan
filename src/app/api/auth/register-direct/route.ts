import { NextRequest, NextResponse } from "next/server";
import { registerDirect } from "@/lib/cafe24";

export async function POST(req: NextRequest) {
  try {
    const { username, name, email, password } = await req.json();

    if (!username || !name || !email || !password) {
      return NextResponse.json({ success: false, error: "모든 가입 필수 항목을 입력해 주세요." }, { status: 400 });
    }

    // Call Cafe24 customer create
    const customer = await registerDirect(username, name, email);

    // Auto log in on successful registration
    const response = NextResponse.json({ success: true, userId: customer.member_id });
    response.cookies.set("cafe24_user", customer.member_id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Direct register API error:", error);
    return NextResponse.json({ success: false, error: error.message || "회원가입 실패" }, { status: 500 });
  }
}
