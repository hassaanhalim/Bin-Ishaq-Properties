export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'cancelled'
  | 'completed';

export type ViewingMode = 'in_person' | 'video_call';

export interface Appointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string; // e.g. "11:00 AM - 12:00 PM"
  viewingMode: ViewingMode;
  notes?: string;
  status: AppointmentStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
