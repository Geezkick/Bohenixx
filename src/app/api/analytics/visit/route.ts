import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase admin client to bypass RLS for server-side analytics
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Prevent duplicate entries for the same IP within an hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentVisits, error: fetchError } = await supabase
      .from('site_visits')
      .select('id')
      .eq('ip_hash', ipHash)
      .gte('created_at', oneHourAgo)
      .limit(1);

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
    }

    if (!recentVisits || recentVisits.length === 0) {
      const { error: insertError } = await supabase
        .from('site_visits')
        .insert([{ ip_hash: ipHash, country, city }]);
        
      if (insertError) {
        console.error("Supabase insert error:", insertError);
      }
    }

    // Get total counts
    const { count: totalVisitors, error: countError } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true });

    // Approximate unique countries (Supabase doesn't have a simple DISTINCT count in the API)
    // We'll estimate based on a grouped query
    const { data: countriesData } = await supabase
      .from('site_visits')
      .select('country')
      .neq('country', 'Unknown');
      
    // Count unique countries in memory (fine for this scale)
    const uniqueCountries = new Set(countriesData?.map(d => d.country)).size || 0;

    return NextResponse.json({
      success: true,
      visitors: totalVisitors || 0,
      countries: uniqueCountries
    });
  } catch (error: any) {
    console.error("Analytics visit error:", error);
    // Fallback in case of DB error
    return NextResponse.json({
      success: false,
      visitors: 0,
      countries: 0,
      isFallback: true
    });
  }
}
