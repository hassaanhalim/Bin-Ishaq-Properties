'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SiteContent } from '@/types/siteContent';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const { showToast } = useStore();
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Buying Luxury Residence');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data) setSiteContent(d.data);
      })
      .catch(() => {});
  }, []);

  const offices = siteContent?.offices || [
    {
      id: '1',
      city: 'Islamabad Desk (B-17 & Faisal Town)',
      address: 'Commercial Avenue, Block B, MPCHS Multi Gardens B-17, Islamabad',
      phone: '+92 300 5195000',
      whatsapp: '923005195000',
      email: 'info@binishaqproperties.com',
    },
  ];

  const primaryPhone = siteContent?.company?.phone || '+92 300 5195000';
  const primaryWhatsapp = siteContent?.company?.whatsapp || '923005195000';
  const primaryOffice = offices[0] || {
    city: 'Islamabad Desk (B-17 & Faisal Town)',
    address: 'Commercial Avenue, Block B, MPCHS Multi Gardens B-17, Islamabad',
    phone: '+92 300 5195000',
    email: 'info@binishaqproperties.com',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('Please provide your name, phone, and inquiry details');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerEmail: email || `${phone.replace(/\D/g, '')}@lead.pk`,
          inquiryType: 'general',
          budget: 'Not specified',
          message: `Subject: ${subject} | Details: ${message}`,
          source: 'Website Contact Page',
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#000000', '#334155', '#10b981'],
        });
        showToast('Inquiry received. A senior advisor will contact you.');
      }
    } catch {
      showToast('Failed to send inquiry. Please reach out via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
            Confidential Consultation
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
            Connect with Our Advisory Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Whether you seek discreet acquisition assistance, property marketing, or institutional valuation, our partners are at your service.
          </p>
        </div>

        {/* 2-Column Form & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Form Container */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200 p-6 sm:p-10 flex flex-col justify-between shadow-xs">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-black text-white mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{name}</strong>. A dedicated Senior Principal Broker will review your requirements and reach out via phone or WhatsApp.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="bg-[#0B1320] text-white font-bold text-xs px-6 py-2.5 hover:bg-black transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Send a Private Inquiry
                  </h3>
                  <p className="text-xs text-slate-500">
                    All client interactions remain strictly confidential under non-disclosure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 321 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                    >
                      <option value="Buying Luxury Residence">Buying Luxury Residence</option>
                      <option value="Selling / Listing Property">Selling / Listing Property</option>
                      <option value="Executive Leasing">Executive Leasing</option>
                      <option value="Commercial & Plot Investment">Commercial & Plot Investment</option>
                      <option value="Other Advisory">Other Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Details of Your Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify preferred area (e.g. DHA Phase 6, Crescent Bay), approximate budget, bedroom requirements, etc."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0B1320] hover:bg-black text-white font-bold text-xs sm:text-sm py-3.5 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting...' : 'Submit Confidential Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Single Prominent VIP & Office Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="architectural-grid bg-[#0B1320] text-white p-6 sm:p-8 border border-slate-800 flex-1 flex flex-col justify-between space-y-6 shadow-sm">
              {/* Top: VIP WhatsApp & Hotline Support */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
                    Instant Brokerage Support
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white">
                    VIP WhatsApp Brokerage Desk
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    For immediate assistance regarding high-value acquisitions, plot demarcations, and verified developer transfers:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/${primaryWhatsapp.replace(/[^0-9]/g, '')}?text=Hello+Bin+Ishaq+Real+Estate`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3.5 px-4 flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp ({primaryWhatsapp})</span>
                  </a>

                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="w-full bg-[#141E30] hover:bg-[#1E2B45] text-white border border-slate-700 font-bold text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>Direct Hotline ({primaryPhone})</span>
                  </a>
                </div>
              </div>

              {/* Bottom: Prominent Single Principal Office Details */}
              <div className="pt-6 border-t border-slate-800 space-y-3.5">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
                    Principal Transfer &amp; Advisory Office
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold tracking-[-0.02em] text-white">
                    {primaryOffice.city}
                  </h4>
                </div>

                <div className="bg-[#141E30]/90 border border-slate-700/70 p-4 space-y-3 text-xs text-slate-300">
                  <p className="flex items-start gap-2.5 leading-relaxed">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">{primaryOffice.address}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-slate-700/60 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{primaryOffice.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{primaryOffice.email}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mon – Sat: 10:00 AM – 8:00 PM</span>
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Open for Consultations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
