import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { service, budget, timeline, details, email } = body;

    // Map Service Request to Contacts table structure
    const name = `Service Request: ${service}`;
    const message = `Budget: ${budget}\nTimeline: ${timeline}\nDetails: ${details}`;

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        { name, email, message }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, request: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
