import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';
import { sendEmail } from '@/lib/email';

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

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We expect a JSON response
    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        targetAudience: {
          type: SchemaType.STRING,
          description: "A description of the target audience for this campaign (e.g., 'Customers who haven't visited in 6 months (N=120)')"
        },
        trend: {
          type: SchemaType.STRING,
          description: "The business or epidemiological trend that triggered this campaign."
        },
        message: {
          type: SchemaType.STRING,
          description: "The actual SMS text message to send to the audience. Keep it under 160 characters if possible."
        },
        estimatedConversion: {
          type: SchemaType.STRING,
          description: "The estimated conversion rate percentage (e.g., '24%')."
        }
      },
      required: ["targetAudience", "trend", "message", "estimatedConversion"]
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `
      You are an expert business marketing strategist and preventative care AI. 
      Analyze current global or seasonal trends (like holidays, weather, or seasonal flu/allergies) and generate an outreach SMS campaign for a generic business or clinic.
      The campaign should aim to drive immediate bookings or sales.
      Make the data look highly analytical and realistic.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const campaignData = JSON.parse(responseText);

    // Dispatch automated email for the CRM campaign
    const userEmail = session?.user?.email;
    if (userEmail && campaignData) {
      await sendEmail({
        to: userEmail,
        subject: `BX Care CRM: New Campaign Generated`,
        text: `Your new outreach campaign has been generated.\n\nTarget Audience: ${campaignData.targetAudience}\nTrend: ${campaignData.trend}\nEstimated Conversion: ${campaignData.estimatedConversion}\n\nMessage:\n${campaignData.message}`,
        type: 'CRM_CAMPAIGN'
      });
    }

    return NextResponse.json({ campaign: campaignData });

  } catch (error) {
    console.error("Error generating CRM campaign with Gemini:", error);
    return NextResponse.json({ error: "Failed to generate campaign" }, { status: 500 });
  }
}
