import { SchemaType } from "@google/generative-ai";
import { ToolDefinition } from "../tool-registry";
import { OcrEngine } from "@/lib/documents/ocr-engine";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

const prisma = db as any;

export const verifyKraPinTool: ToolDefinition = {
  name: "verify_kra_pin",
  description: "Verify if a string matches the standard Kenya Revenue Authority (KRA) PIN format.",
  declaration: {
    name: "verify_kra_pin",
    description: "Verifies the format of a KRA PIN.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        pin: { type: SchemaType.STRING, description: "The KRA PIN to verify" }
      },
      required: ["pin"],
    },
  },
  execute: async (args, context) => {
    try {
      const isValid = OcrEngine.isValidKraPin(args.pin);
      return { success: true, data: { isValid, pin: args.pin } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const scanDocumentTool: ToolDefinition = {
  name: "scan_document",
  description: "Scan an uploaded document to extract structured data (receipts, invoices). Pass the fileUrl.",
  permissionsRequired: ["can_scan_documents"],
  declaration: {
    name: "scan_document",
    description: "Scans a document and extracts data via OCR.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        fileUrl: { type: SchemaType.STRING, description: "The URL or path to the uploaded document" }
      },
      required: ["fileUrl"],
    },
  },
  execute: async (args, context) => {
    try {
      let buffer: Buffer;
      let mimeType = "image/jpeg";

      if (args.fileUrl.startsWith("http")) {
        const response = await fetch(args.fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        mimeType = response.headers.get("content-type") || "image/jpeg";
      } else {
        const localPath = path.join(process.cwd(), "public", args.fileUrl);
        buffer = await fs.readFile(localPath);
        if (args.fileUrl.endsWith(".png")) mimeType = "image/png";
        if (args.fileUrl.endsWith(".webp")) mimeType = "image/webp";
      }

      const extractedData = await OcrEngine.extractDataFromImage(buffer, mimeType);

      const documentScan = await prisma.documentScan.create({
        data: {
          userId: context.userId,
          agentId: context.agentId,
          fileUrl: args.fileUrl,
          documentType: extractedData.documentType,
          extractedData: JSON.stringify(extractedData),
          confidenceScore: extractedData.confidenceScore
        }
      });

      return { success: true, data: { scanId: documentScan.id, ...extractedData } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
