'use client';

import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatDate } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  Calendar,
  Clock,
  Video,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const { showToast } = useStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (data.data) setAppointments(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast(`Appointment status updated to ${status}`);
        fetchAppointments();
      }
    } catch {
      showToast('Error updating appointment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Viewing & Visit Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Client Visit Appointments ({appointments.length})
          </h1>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-[#0B1320] border border-slate-800 p-5 space-y-4"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : apt.status === 'pending'
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}
                >
                  {apt.status}
                </span>

                <span className="flex items-center gap-1 text-slate-400">
                  {apt.viewingMode === 'in_person' ? (
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <Video className="w-3.5 h-3.5 text-slate-300" />
                  )}
                  <span>{apt.viewingMode === 'in_person' ? 'In-Person VIP Tour' : 'Video Tour'}</span>
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                {formatDate(apt.createdAt)}
              </span>
            </div>

            {/* Main Info */}
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-bold text-white">{apt.customerName}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {apt.customerPhone}
                  </span>
                  {apt.customerEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {apt.customerEmail}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#141E30] border border-slate-800 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Requested Property
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {apt.propertyTitle}
                </p>
                <p className="text-[11px] text-slate-400">{apt.propertyLocation}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-300 font-medium py-1">
                <span className="flex items-center gap-1.5 text-white">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {apt.preferredDate}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {apt.preferredTimeSlot}
                </span>
              </div>

              {apt.notes && (
                <p className="text-xs text-slate-400 italic bg-[#141E30] p-2 border border-slate-800">
                  "{apt.notes}"
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              {apt.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                    className="flex items-center gap-1.5 bg-[#141E30] hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 px-3 py-1.5 text-xs font-medium transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-200 text-[#0B1320] px-4 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Visit</span>
                  </button>
                </>
              )}

              {apt.status === 'confirmed' && (
                <button
                  onClick={() => handleUpdateStatus(apt.id, 'completed')}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-200 text-[#0B1320] px-4 py-1.5 text-xs font-bold transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Conducted</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
