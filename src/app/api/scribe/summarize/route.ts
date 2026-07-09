import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { transcript } = body;

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        subjective: {
          type: SchemaType.STRING,
          description: "Subjective section: Patient's chief complaints, history of present illness, symptoms."
        },
        objective: {
          type: SchemaType.STRING,
          description: "Objective section: Vitals, physical exam findings, or measurable data mentioned."
        },
        assessment: {
          type: SchemaType.STRING,
          description: "Assessment section: Diagnoses or analysis of the problem."
        },
        plan: {
          type: SchemaType.STRING,
          description: "Plan section: Treatment, medications, follow-up, or action items."
        }
      },
      required: ["subjective", "objective", "assessment", "plan"]
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `
      You are an expert medical or business scribe.
      Analyze the following transcription of a conversation/consultation.
      Generate a professional SOAP note (Subjective, Objective, Assessment, Plan) based on the transcript.
      If there is not enough information for a section, provide a reasonable guess or state 'Not mentioned'.
      
      Transcript:
      "${transcript}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const soapNote = JSON.parse(responseText);

    return NextResponse.json({ soapNote });

  } catch (error) {
    console.error("Error generating Scribe note with Gemini:", error);
    return NextResponse.json({ error: "Failed to generate note" }, { status: 500 });
  }
}
