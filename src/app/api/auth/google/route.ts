import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Determine the correct origin dynamically (works in dev + production)
    const headersList = await headers();
    const host = headersList.get('host') || 'www.bohenix.africa';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const origin = `${protocol}://${host}`;

    // Support ?next= parameter so we can redirect back to /developers or any page
    const next = request.nextUrl.searchParams.get('next') || '/';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error.message)}`, origin)
      );
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(
      new URL('/?error=Failed to initialize Google Sign-In', origin)
    );
  } catch (error) {
    console.error('Unexpected Google OAuth error:', error);
    const headersList = await headers();
    const host = headersList.get('host') || 'www.bohenix.africa';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    return NextResponse.redirect(
      new URL('/?error=Something went wrong', `${protocol}://${host}`)
    );
  }
}
