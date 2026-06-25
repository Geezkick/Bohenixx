import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User' 
      } 
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
