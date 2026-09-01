import { NextRequest, NextResponse } from 'next/server';
import { getGeographicAnalytics, recordVisitorLog, getAnalytics } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const geoStats = getGeographicAnalytics();
    const portfolioAnalytics = getAnalytics();

    return NextResponse.json({
      success: true,
      geo: geoStats,
      portfolio: portfolioAnalytics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLog = recordVisitorLog({
      city: body.city || 'Karachi',
      country: body.country || 'Pakistan',
      countryCode: body.countryCode || 'PK',
      flag: body.flag || '🇵🇰',
      device: body.device || 'mobile',
      browser: body.browser || 'Safari / Mobile',
      pageVisited: body.pageVisited || '/',
      ip: body.ip || req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      data: newLog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
