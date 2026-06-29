import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://bohenix.africa/api/auth/callback',
        // For local testing, uncomment below:
        // redirectTo: 'http://localhost:3000/api/auth/callback',
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error.message)}`, 'https://bohenix.africa')
      );
    }

    // Redirect to Google's OAuth consent screen
    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(
      new URL('/?error=Failed to initialize Google Sign-In', 'https://bohenix.africa')
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.redirect(
      new URL('/?error=Something went wrong', 'https://bohenix.africa')
    );
  }
}
