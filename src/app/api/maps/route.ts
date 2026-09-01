import { NextResponse } from 'next/server';
import { getMaps, createMap } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';
import { MasterPlanMap } from '@/types/map';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const society = searchParams.get('society') || undefined;

  try {
    let query = supabaseAdmin.from('maps').select('*').order('created_at', { ascending: false });
    if (society && society !== 'all') {
      query = query.ilike('society', `%${society}%`);
    }

    const { data: dbMaps, error } = await query;
    const defaultMaps = getMaps(society);

    if (!error && dbMaps) {
      const dbMapped: MasterPlanMap[] = dbMaps.map((row) => ({
        id: row.id,
        title: row.title,
        society: row.society,
        sector: row.sector || '',
        thumbnailUrl: row.thumbnail_url,
        pdfUrl: row.pdf_url,
        fileSize: row.file_size || '3.5 MB',
        downloadsCount: row.downloads_count || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      // Filter out any stale mock IDs
      const realDbMaps = dbMapped.filter(
        (m) =>
          m.id === 'map-faisal-hills-2024' ||
          (!m.id.startsWith('map-mpchs') &&
            !m.id.startsWith('map-faisal-town-phase') &&
            !m.id.startsWith('map-bahria') &&
            !m.id.startsWith('map-other-societies'))
      );

      // Combine newly uploaded DB maps with default master plans
      const mapDict = new Map<string, MasterPlanMap>();
      defaultMaps.forEach((m) => mapDict.set(m.id, m));
      realDbMaps.forEach((m) => mapDict.set(m.id, m));

      // Ensure Faisal Hills (2024) is always at the very top (index 0)
      const combined = Array.from(mapDict.values());
      const faisal2024 = combined.find((m) => m.id === 'map-faisal-hills-2024' || m.title.includes('2024'));
      const rest = combined.filter((m) => m.id !== faisal2024?.id);
      const ordered = faisal2024 ? [faisal2024, ...rest] : combined;

      return NextResponse.json({ success: true, count: ordered.length, data: ordered });
    }
  } catch (err) {
    console.warn('Supabase maps query fallback:', err);
  }

  const maps = getMaps(society);
  return NextResponse.json({ success: true, count: maps.length, data: maps });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMap = createMap(body);

    try {
      await supabaseAdmin.from('maps').insert({
        id: newMap.id,
        title: newMap.title,
        society: newMap.society,
        sector: newMap.sector,
        thumbnail_url: newMap.thumbnailUrl,
        pdf_url: newMap.pdfUrl,
        file_size: newMap.fileSize,
        downloads_count: 0,
        created_at: newMap.createdAt,
        updated_at: newMap.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase map insert warning:', err);
    }

    return NextResponse.json({ success: true, data: newMap }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid map payload' }, { status: 400 });
  }
}
