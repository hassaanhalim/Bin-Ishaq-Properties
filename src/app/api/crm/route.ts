import { NextResponse } from 'next/server';
import { getLeads, createLead, updateLeadStatus, addLeadActivity } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Lead } from '@/types/crm';

export async function GET() {
  try {
    const { data: dbLeads, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbLeads && dbLeads.length > 0) {
      const mapped: Lead[] = dbLeads.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email || '',
        interestedPropertyId: row.property_id,
        interestedPropertyTitle: row.property_title,
        budgetMax: Number(row.budget) || undefined,
        interestedArea: row.society || undefined,
        status: row.status || 'new',
        source: row.source || 'website_inquiry',
        notes: row.notes || '',
        activities: row.activity || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      return NextResponse.json({ success: true, count: mapped.length, data: mapped });
    }
  } catch (err) {
    console.warn('Supabase leads fetch error:', err);
  }

  const leads = getLeads();
  return NextResponse.json({ success: true, count: leads.length, data: leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'add_activity') {
      const updated = addLeadActivity(body.leadId, body.message, body.type, body.author);
      try {
        if (updated) {
          await supabaseAdmin
            .from('leads')
            .update({ activity: updated.activities, updated_at: new Date().toISOString() })
            .eq('id', body.leadId);
        }
      } catch {}
      return NextResponse.json({ success: true, data: updated });
    }

    const newLead = createLead(body);
    try {
      await supabaseAdmin.from('leads').insert({
        id: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        property_id: newLead.interestedPropertyId,
        property_title: newLead.interestedPropertyTitle,
        budget: newLead.budgetMax,
        society: newLead.interestedArea,
        status: newLead.status,
        source: newLead.source,
        notes: newLead.notes,
        activity: newLead.activities,
        created_at: newLead.createdAt,
        updated_at: newLead.updatedAt,
      });
    } catch {}

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid lead payload' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, author } = body;
    const updated = updateLeadStatus(id, status, author);
    try {
      if (updated) {
        await supabaseAdmin
          .from('leads')
          .update({ status, activity: updated.activities, updated_at: new Date().toISOString() })
          .eq('id', id);
      }
    } catch {}
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 400 });
  }
}
