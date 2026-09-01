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
  Building,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Viewing &amp; Visit Management
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Client Visit Appointments ({appointments.length})
          </h1>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {appointments.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#0B1320] border border-slate-800 rounded-3xl p-6 text-slate-400 text-xs">
            No viewing appointments booked yet.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md border ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>

                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      {apt.viewingMode === 'in_person' ? (
                        <User className="w-3.5 h-3.5 text-slate-300" />
                      ) : (
                        <Video className="w-3.5 h-3.5 text-slate-300" />
                      )}
                      <span>{apt.viewingMode === 'in_person' ? 'In-Person VIP Tour' : 'Video Tour'}</span>
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatDate(apt.createdAt)}
                  </span>
                </div>

                {/* Main Info */}
                <div>
                  <h4 className="text-sm font-bold text-white">{apt.customerName}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                    <a
                      href={`tel:${apt.customerPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1 hover:text-white font-bold text-slate-300"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.customerPhone}</span>
                    </a>
                    {apt.customerEmail && (
                      <a
                        href={`mailto:${apt.customerEmail}`}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.customerEmail}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Property Card */}
                <div className="bg-[#141E30] border border-slate-700/80 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Requested Property
                  </span>
                  <p className="text-xs font-bold text-white truncate">
                    {apt.propertyTitle}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{apt.propertyLocation}</p>
                </div>

                {/* Date & Time Slot */}
                <div className="flex items-center gap-4 text-xs text-slate-300 font-bold py-1">
                  <span className="flex items-center gap-1.5 text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.preferredDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.preferredTimeSlot}</span>
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Visit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                  className="min-h-[44px] px-4 flex items-center justify-center gap-1.5 bg-[#141E30] hover:bg-rose-950 text-rose-400 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
