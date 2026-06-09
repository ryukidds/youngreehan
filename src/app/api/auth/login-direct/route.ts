import { NextRequest, NextResponse } from "next/server";
import { loginDirect } from "@/lib/cafe24";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "아이디와 비밀번호를 모두 입력해 주세요." }, { status: 400 });
    }

    // Call Cafe24 login
    const tokenResponse = await loginDirect(username, password);

    // Set secure cookie
    const response = NextResponse.json({ success: true, userId: tokenResponse.user_id });
    response.cookies.set("cafe24_user", tokenResponse.user_id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Direct login API error:", error);
    return NextResponse.json({ success: false, error: error.message || "로그인 실패" }, { status: 401 });
  }
}
