import { NextResponse } from 'next/server';
import { deleteMap, getMapById } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mapItem = getMapById(id);
  if (!mapItem) {
    return NextResponse.json({ success: false, error: 'Map not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: mapItem });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteMap(id);

  try {
    await supabaseAdmin.from('maps').delete().eq('id', id);
  } catch {}

  return NextResponse.json({ success });
}
