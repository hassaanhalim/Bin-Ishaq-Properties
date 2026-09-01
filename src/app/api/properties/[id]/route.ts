import { NextResponse } from 'next/server';
import { getPropertyById, updateProperty, deleteProperty, updatePropertyStatus, togglePropertyFeatured } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: row, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (!error && row) {
      return NextResponse.json({
        success: true,
        data: {
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          price: Number(row.price),
          purpose: row.purpose,
          type: row.property_type,
          category: row.category,
          society: row.society,
          developer: row.developer,
          city: row.city,
          location: row.location,
          specs: row.specs,
          images: row.images || [],
          featuredImage: row.featured_image,
          features: row.features || [],
          status: row.status,
          isFeatured: row.is_featured,
          isVerified: row.is_verified,
          viewsCount: row.views_count || 0,
          inquiriesCount: row.inquiries_count || 0,
          submittedBy: row.submitted_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      });
    }
  } catch {}

  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: property });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    if (body.action === 'toggle_featured') {
      const updated = togglePropertyFeatured(id);
      try {
        if (updated) {
          await supabaseAdmin
            .from('properties')
            .update({ is_featured: updated.isFeatured, updated_at: new Date().toISOString() })
            .eq('id', id);
        }
      } catch {}
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === 'update_status') {
      const updated = updatePropertyStatus(id, body.status, body.rejectionReason);
      try {
        await supabaseAdmin
          .from('properties')
          .update({ status: body.status, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch {}
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = updateProperty(id, body);
    try {
      await supabaseAdmin.from('properties').update(body).eq('id', id);
    } catch {}
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteProperty(id);
  try {
    await supabaseAdmin.from('properties').delete().eq('id', id);
  } catch {}
  return NextResponse.json({ success });
}
