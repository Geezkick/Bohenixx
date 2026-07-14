import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export type ExtractedDocumentData = {
  documentType: "receipt" | "invoice" | "contract" | "unknown";
  amount?: number;
  date?: string;
  merchantName?: string;
  items?: Array<{ description: string; price?: number }>;
  kraPin?: string;
  rawText?: string;
  confidenceScore: number;
};

export const OcrEngine = {
  /**
   * Process an image buffer and extract structured business data
   * Specifically tuned for Kenyan/African receipts and invoices
   */
  async extractDataFromImage(imageBuffer: Buffer, mimeType: string): Promise<ExtractedDocumentData> {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert AI document analyzer specializing in Kenyan and East African business documents.
      Please analyze this image and extract the following information in strict JSON format. 
      If a field is not found or unclear, omit it or set it to null.
      
      Extract:
      1. documentType: Categorize as "receipt", "invoice", "contract", or "unknown"
      2. amount: The total amount in the document (number only)
      3. date: The transaction or issue date in YYYY-MM-DD format
      4. merchantName: The name of the business or individual issuing the document
      5. items: Array of objects, each with "description" (string) and "price" (number)
      6. kraPin: Extract the Kenya Revenue Authority PIN if present (format usually P123456789X or A123456789X)
      7. rawText: A summary of the raw text visible
      
      Respond ONLY with the JSON object. No markdown formatting or backticks around the JSON.
    `;

    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType
        },
      },
    ];

    try {
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      let text = response.text().trim();
      
      // Clean up potential markdown formatting if Gemini included it despite instructions
      if (text.startsWith("\`\`\`json")) {
        text = text.substring(7);
      }
      if (text.startsWith("\`\`\`")) {
        text = text.substring(3);
      }
      if (text.endsWith("\`\`\`")) {
        text = text.substring(0, text.length - 3);
      }
      text = text.trim();

      const data = JSON.parse(text);
      
      // Calculate a pseudo-confidence score based on how many fields were successfully extracted
      let fieldsFound = 0;
      let totalFields = 6; // excluding rawText and confidenceScore
      
      if (data.documentType && data.documentType !== "unknown") fieldsFound++;
      if (data.amount) fieldsFound++;
      if (data.date) fieldsFound++;
      if (data.merchantName) fieldsFound++;
      if (data.items && data.items.length > 0) fieldsFound++;
      if (data.kraPin) fieldsFound++;

      return {
        ...data,
        confidenceScore: fieldsFound / totalFields
      };
    } catch (error: any) {
      console.error("OCR Extraction Error:", error);
      throw new Error(`Failed to extract data from document: ${error.message}`);
    }
  },

  /**
   * Validate a Kenya Revenue Authority (KRA) PIN format
   */
  isValidKraPin(pin: string): boolean {
    // Basic format: Starts with A or P, followed by 9 digits, ends with a letter
    const kraPinRegex = /^[AP][0-9]{9}[A-Z]$/i;
    return kraPinRegex.test(pin.trim());
  }
};
