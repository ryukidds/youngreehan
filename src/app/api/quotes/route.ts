import { NextRequest, NextResponse } from "next/server";
import { saveQuote } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract fields
    const userId = (formData.get("userId") as string) || "guest";
    const productId = (formData.get("productId") as string) || "";
    const productName = (formData.get("productName") as string) || "";
    const colorName = (formData.get("colorName") as string) || "";
    const quantitiesJson = (formData.get("quantities") as string) || "{}";
    const hasPrint = (formData.get("hasPrint") as string) === "true";
    
    const printMethodsJson = (formData.get("printMethods") as string) || "[]";
    const selectedPositionsJson = (formData.get("selectedPositions") as string) || "[]";
    const requests = (formData.get("requests") as string) || "";
    
    const subtotal = Number(formData.get("subtotal") || 0);
    const discountAmount = Number(formData.get("discountAmount") || 0);
    const printFee = Number(formData.get("printFee") || 0);
    const totalPrice = Number(formData.get("totalPrice") || 0);

    const quantities = JSON.parse(quantitiesJson);
    const printMethods = JSON.parse(printMethodsJson);
    const selectedPositions = JSON.parse(selectedPositionsJson);

    // File handling
    const file = formData.get("file") as File | null;
    let fileName = "";
    let fileUrl = "";

    if (file && file.size > 0) {
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

    const savedQuote = await saveQuote({
      userId,
      productId,
      productName,
      colorName,
      quantities,
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
