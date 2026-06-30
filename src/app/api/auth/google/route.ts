import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get('next') || '/';
  return NextResponse.redirect(
    new URL(`/api/auth/signin/google?callbackUrl=${encodeURIComponent(next)}`, request.url)
  );
}
