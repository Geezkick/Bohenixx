import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
