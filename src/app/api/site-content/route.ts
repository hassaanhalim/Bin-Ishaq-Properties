import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';
import { SiteContent } from '@/types/siteContent';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!error && data) {
      const defaultContent = getSiteContent();
      const content: SiteContent = {
        ...defaultContent,
        company: data.company || defaultContent.company,
        hero: data.hero || defaultContent.hero,
        searchFilter: data.search_filter || defaultContent.searchFilter,
        footer: data.footer || defaultContent.footer,
        updatedAt: data.updated_at || defaultContent.updatedAt,
      };
      return NextResponse.json({ success: true, data: content });
    }
  } catch (err) {
    console.warn('Supabase site content fetch error:', err);
  }

  const content = getSiteContent();
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSiteContent(body);

    try {
      await supabaseAdmin.from('site_content').upsert({
        id: 'current',
        company: updated.company,
        hero: updated.hero,
        search_filter: updated.searchFilter,
        footer: updated.footer,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Supabase site content upsert error:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Site content updated successfully in database',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
