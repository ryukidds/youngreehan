import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === "admin") {
      // Get expected password from environment variables, fallback to local default for development
      const expectedPassword = process.env.ADMIN_PASSWORD || "admin";
      
      if (password === expectedPassword) {
        // Generate secure signature dynamically derived from the SESSION_SECRET environment variable
        const sessionSecret = process.env.SESSION_SECRET || "fallback_local_secret";
        const secureSignature = crypto
          .createHash("sha256")
          .update(sessionSecret)
          .digest("hex");

        const cookieStore = await cookies();
        
        // Set secure httpOnly admin session cookie
        cookieStore.set({
          name: "admin_token",
          value: secureSignature,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 3600 * 24 * 7, // 7 days
        });

        // Set cafe24_user cookie for frontend UI context compatibility
        cookieStore.set({
          name: "cafe24_user",
          value: "admin",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 3600 * 24 * 7, // 7 days
        });

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          { success: false, error: "비밀번호가 올바르지 않습니다." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "잘못된 요청입니다." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json(
      { success: false, error: error.message || "로그인 처리 중 오류 발생" },
      { status: 500 }
    );
  }
}
