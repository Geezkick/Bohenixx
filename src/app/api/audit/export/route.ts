import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    // Fetch recent decision logs and activity logs
    const activities = await db.activityLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'json') {
      return new NextResponse(JSON.stringify(activities, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="bohenix-audit-export-${Date.now()}.json"`
        }
      });
    }

    // CSV formatting
    const csvHeaders = "ID,Timestamp,App/Component,Action,ColorTag\n";
    const csvRows = activities.map(a => 
      `"${a.id}","${a.createdAt.toISOString()}","${a.app.replace(/"/g, '""')}","${a.action.replace(/"/g, '""')}","${a.color}"`
    ).join("\n");

    const csvContent = csvHeaders + csvRows;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bohenix-audit-export-${Date.now()}.csv"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
