import { NextResponse } from 'next/server';
import { getAppointments, createAppointment, updateAppointmentStatus } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Appointment } from '@/types/appointment';

export async function GET() {
  try {
    const { data: dbRows, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbRows && dbRows.length > 0) {
      const mapped: Appointment[] = dbRows.map((row) => ({
        id: row.id,
        propertyId: row.property_id,
        propertyTitle: row.property_title,
        propertyLocation: row.property_location || '',
        customerName: row.client_name,
        customerPhone: row.client_phone,
        customerEmail: row.client_email || '',
        preferredDate: row.appointment_date,
        preferredTimeSlot: row.appointment_time,
        viewingMode: row.viewing_mode || 'in_person',
        status: row.status,
        notes: row.notes || '',
        adminNotes: row.admin_notes || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at || row.created_at,
      }));
      return NextResponse.json({ success: true, count: mapped.length, data: mapped });
    }
  } catch (err) {
    console.warn('Supabase appointments fetch error:', err);
  }

  const appointments = getAppointments();
  return NextResponse.json({ success: true, count: appointments.length, data: appointments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAppointment = createAppointment(body);

    try {
      await supabaseAdmin.from('appointments').insert({
        id: newAppointment.id,
        property_id: newAppointment.propertyId,
        property_title: newAppointment.propertyTitle,
        client_name: newAppointment.customerName,
        client_phone: newAppointment.customerPhone,
        client_email: newAppointment.customerEmail,
        appointment_date: newAppointment.preferredDate,
        appointment_time: newAppointment.preferredTimeSlot,
        status: newAppointment.status,
        notes: newAppointment.notes,
        created_at: newAppointment.createdAt,
      });
    } catch {}

    return NextResponse.json({ success: true, data: newAppointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid appointment payload' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;
    const updated = updateAppointmentStatus(id, status, adminNotes);

    try {
      if (updated) {
        await supabaseAdmin
          .from('appointments')
          .update({ status, notes: updated.adminNotes })
          .eq('id', id);
      }
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update appointment' }, { status: 400 });
  }
}
