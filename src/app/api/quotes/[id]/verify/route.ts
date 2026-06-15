import { NextRequest, NextResponse } from "next/server";
import { getQuoteById } from "@/lib/db";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "비밀번호를 입력해 주세요." },
        { status: 400 }
      );
    }

    const quote = await getQuoteById(id);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "견적 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (!quote.password) {
      return NextResponse.json(
        { success: false, error: "비밀번호가 설정되지 않은 글입니다." },
        { status: 400 }
      );
    }

    // Hash the input password using SHA-256
    const inputHash = crypto.createHash("sha256").update(password).digest("hex");

    // Support both hashed (new) and plain text (existing old data) for compatibility
    const isCorrect = inputHash === quote.password || password === quote.password;

    if (isCorrect) {
      // Set authorization cookie for this specific quote (2 hours expiry)
      const cookieStore = await cookies();
      cookieStore.set({
        name: `authorized_quote_${id}`,
        value: "true",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error(`Error in POST /api/quotes/[id]/verify:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify password" },
      { status: 500 }
    );
  }
}
