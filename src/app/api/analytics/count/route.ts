import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS for server-side analytics
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET endpoint just for polling the count without incrementing/creating records
export async function GET() {
  try {
    // Get total counts
    const { count: totalVisitors, error: countError } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Approximate unique countries
    const { data: countriesData } = await supabase
      .from('site_visits')
      .select('country')
      .neq('country', 'Unknown');
      
    const uniqueCountries = new Set(countriesData?.map(d => d.country)).size || 0;

    return NextResponse.json({
      success: true,
      visitors: totalVisitors || 0,
      countries: uniqueCountries
    });
  } catch (error: any) {
    console.error("Analytics count error:", error);
    return NextResponse.json({
      success: false,
      visitors: 0,
      countries: 0,
      isFallback: true
    });
  }
}
