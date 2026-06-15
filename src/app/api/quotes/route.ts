import { NextRequest, NextResponse } from "next/server";
import { saveQuote, getQuotes } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function GET() {
  try {
    const quotes = await getQuotes();
    return NextResponse.json({ success: true, quotes });
  } catch (error: any) {
    console.error("Error in GET /api/quotes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract fields
    const loggedInUser = await getCurrentUser();
    const userId = loggedInUser || "guest";
    const writerName = (formData.get("writerName") as string) || "";
    const password = (formData.get("password") as string) || "";
    const title = (formData.get("title") as string) || "";
    const productId = (formData.get("productId") as string) || "";
    const productName = (formData.get("productName") as string) || "";
    const colorName = (formData.get("colorName") as string) || "";
    const quantitiesJson = (formData.get("quantities") as string) || "{}";
    const colorQuantitiesJson = (formData.get("colorQuantities") as string) || "";
    const hasPrint = (formData.get("hasPrint") as string) === "true";
    
    const printMethodsJson = (formData.get("printMethods") as string) || "[]";
    const selectedPositionsJson = (formData.get("selectedPositions") as string) || "[]";
    const requests = (formData.get("requests") as string) || "";
    
    const subtotal = Number(formData.get("subtotal") || 0);
    const discountAmount = Number(formData.get("discountAmount") || 0);
    const printFee = Number(formData.get("printFee") || 0);
    const totalPrice = Number(formData.get("totalPrice") || 0);

    const quantities = JSON.parse(quantitiesJson);
    const colorQuantities = colorQuantitiesJson ? JSON.parse(colorQuantitiesJson) : undefined;
    const printMethods = JSON.parse(printMethodsJson);
    const selectedPositions = JSON.parse(selectedPositionsJson);

    // File handling
    const file = formData.get("file") as File | null;
    let fileName = "";
    let fileUrl = "";

    if (file && file.size > 0) {
      const allowedExtensions = [".ai", ".psd", ".pdf", ".png", ".jpg", ".jpeg", ".zip"];
      const ext = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          { success: false, error: "허용되지 않는 파일 형식입니다. (ai, psd, pdf, png, jpg, jpeg, zip만 허용)" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Ensure upload directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueName);
      await fs.writeFile(filePath, buffer);
      
      fileName = file.name;
      fileUrl = `/uploads/${uniqueName}`;
    }

    // Password hashing (SHA-256)
    let hashedPassword = "";
    if (password) {
      hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    }

    const savedQuote = await saveQuote({
      userId,
      writerName,
      password: hashedPassword,
      title,
      productId,
      productName,
      colorName,
      quantities,
      colorQuantities,
      hasPrint,
      printMethods,
      selectedPositions,
      fileName,
      fileUrl,
      requests,
      subtotal,
      discountAmount,
      printFee,
      totalPrice,
    });

    return NextResponse.json({ success: true, quote: savedQuote });
  } catch (error: any) {
    console.error("Error in POST /api/quotes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit quote" },
      { status: 500 }
    );
  }
}
