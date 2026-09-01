import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';
import { SiteContent } from '@/types/siteContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('id', 'current')
      .single();

    if (!error && data) {
      const defaultContent = getSiteContent();
      const rawCompany = data.company || data.content?.company || defaultContent.company;

      // Self-healing sanitizer for legacy placeholder phone/email
      const company = {
        ...defaultContent.company,
        ...rawCompany,
        phone:
          !rawCompany.phone || rawCompany.phone.includes('5195000')
            ? '+92 315 5735785'
            : rawCompany.phone,
        whatsapp:
          !rawCompany.whatsapp || rawCompany.whatsapp.includes('5195000')
            ? '923155735785'
            : rawCompany.whatsapp,
        email:
          !rawCompany.email || rawCompany.email.includes('info@binishaq')
            ? 'farhanullah3333@gmail.com'
            : rawCompany.email,
      };

      const content: SiteContent = {
        ...defaultContent,
        company,
        hero: data.hero || data.content?.hero || defaultContent.hero,
        searchFilter:
          data.search_filter ||
          data.searchFilter ||
          data.content?.searchFilter ||
          defaultContent.searchFilter,
        footer: data.footer || data.content?.footer || defaultContent.footer,
        offices: data.advisory?.offices || data.offices || defaultContent.offices,
        whyChoose:
          data.advisory?.whyChoose ||
          data.why_choose ||
          data.whyChoose ||
          defaultContent.whyChoose,
        about: data.advisory?.about || data.about || defaultContent.about,
        updatedAt: data.updated_at || defaultContent.updatedAt,
      };

      return NextResponse.json(
        { success: true, data: content },
        { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
      );
    }
  } catch (err) {
    console.warn('Supabase site content fetch error:', err);
  }

  const content = getSiteContent();
  return NextResponse.json(
    { success: true, data: content },
    { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
  );
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateSiteContent(body);

    let savedToSupabase = false;
    let dbError: string | null = null;

    try {
      const { error } = await supabaseAdmin.from('site_content').upsert({
        id: 'current',
        company: updated.company,
        hero: updated.hero,
        search_filter: updated.searchFilter,
        footer: updated.footer,
        advisory: {
          about: updated.about,
          offices: updated.offices,
          whyChoose: updated.whyChoose,
        },
        updated_at: new Date().toISOString(),
      });

      if (error) {
        dbError = error.message;
        console.warn('Supabase site content upsert error:', error.message);
      } else {
        savedToSupabase = true;
      }
    } catch (err: any) {
      dbError = err?.message || 'Database error';
      console.warn('Supabase site content upsert exception:', err);
    }

    return NextResponse.json(
      {
        success: true,
        message: savedToSupabase
          ? 'Site content updated successfully in database'
          : 'Site content updated in memory (ensure Supabase table "site_content" exists)',
        savedToDb: savedToSupabase,
        dbError,
        data: updated,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
