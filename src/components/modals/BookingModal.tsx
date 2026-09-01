'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Video,
  User,
  Phone,
  Mail,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '10:00 AM - 11:30 AM',
  '12:00 PM - 01:30 PM',
  '03:00 PM - 04:30 PM',
  '05:00 PM - 06:30 PM',
  '07:00 PM - 08:30 PM',
];

export default function BookingModal() {
  const {
    activeBookingProperty,
    closeBookingModal,
    showToast,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[2]);
  const [viewingMode, setViewingMode] = useState<'in_person' | 'video_call'>('in_person');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activeBookingProperty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !preferredDate) {
      showToast('Please provide your name, phone and preferred date');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: activeBookingProperty.id,
          propertyTitle: activeBookingProperty.title,
          propertyLocation: `${activeBookingProperty.location.area}, ${activeBookingProperty.location.city}`,
          propertyImage: activeBookingProperty.featuredImage || activeBookingProperty.images[0],
          customerName,
          customerPhone,
          customerEmail: customerEmail || `${customerPhone.replace(/\D/g, '')}@lead.pk`,
          preferredDate,
          preferredTimeSlot,
          viewingMode,
          notes,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#0B1320', '#10b981'],
        });
        showToast('Viewing appointment requested successfully!');
      }
    } catch {
      showToast('Failed to schedule visit. Please call office directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeBookingModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0B1320] border border-slate-700 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-5 right-5 p-2 bg-[#141E30] text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-white text-[#0B1320] border border-slate-300 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-[-0.02em] text-white">
              Private Tour Requested
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{customerName}</strong>. Our senior luxury advisor will contact you on <strong className="text-white font-bold">{customerPhone}</strong> to confirm security clearance and gate access for{' '}
              <strong className="text-white">{preferredDate}</strong>.
            </p>

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  closeBookingModal();
                }}
                className="bg-white hover:bg-slate-200 text-[#0B1320] font-bold px-8 py-3 text-sm transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1">
                VIP Private Tour
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white">
                Request Property Viewing
              </h3>
            </div>

            {/* Property Preview Card */}
            <div className="flex items-center gap-3 bg-[#141E30] border border-slate-700 p-3">
              <div className="relative w-16 h-14 overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
                <Image
                  src={activeBookingProperty.featuredImage || activeBookingProperty.images[0]}
                  alt={activeBookingProperty.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">
                  {activeBookingProperty.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeBookingProperty.location.area}, {activeBookingProperty.location.city}
                </p>
                <p className="text-xs font-extrabold text-white">
                  {activeBookingProperty.priceDisplay || (activeBookingProperty.price ? formatPrice(activeBookingProperty.price, 'PKR', activeBookingProperty.purpose === 'rent') : 'Call for Rate')}
                </p>
              </div>
            </div>

            {/* Viewing Mode */}
            <div>
              <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 block mb-2">
                Viewing Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setViewingMode('in_person')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 border text-xs font-bold transition cursor-pointer ${
                    viewingMode === 'in_person'
                      ? 'bg-white text-[#0B1320] border-white'
                      : 'bg-[#141E30] text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>In-Person VIP Tour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingMode('video_call')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 border text-xs font-bold transition cursor-pointer ${
                    viewingMode === 'video_call'
                      ? 'bg-white text-[#0B1320] border-white'
                      : 'bg-[#141E30] text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Live Video Walkthrough</span>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#141E30] border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full bg-[#141E30] border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. Ahmed Raza"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#141E30] border border-slate-700 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    placeholder="+92 300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#141E30] border border-slate-700 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="name@domain.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#141E30] border border-slate-700 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-slate-300 block mb-1">
                  Specific Viewing Requirements
                </label>
                <textarea
                  rows={2}
                  name="notes"
                  placeholder="e.g. Bringing private architect, require gate security clearance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141E30] border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white hover:bg-slate-200 text-[#0B1320] font-extrabold text-sm py-3.5 flex items-center justify-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Calendar className="w-4 h-4 text-[#0B1320]" />
              <span>{submitting ? 'Scheduling VIP Visit...' : 'Confirm & Schedule VIP Visit'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
