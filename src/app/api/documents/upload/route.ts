import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { OcrEngine } from "@/lib/documents/ocr-engine";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Parse formData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const agentId = formData.get("agentId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally to public/uploads/documents
    const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/documents");
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure dir exists (it should, but just in case)
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/documents/${fileName}`;

    // Process with OCR Engine
    const extractedData = await OcrEngine.extractDataFromImage(buffer, file.type);

    // Save to database
    const documentScan = await db.documentScan.create({
      data: {
        userId,
        agentId: agentId || null,
        fileUrl,
        documentType: extractedData.documentType,
        extractedData: JSON.stringify(extractedData),
        confidenceScore: extractedData.confidenceScore
      }
    });

    return NextResponse.json({
      success: true,
      documentScan,
      extractedData
    });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process document" },
      { status: 500 }
    );
  }
}
