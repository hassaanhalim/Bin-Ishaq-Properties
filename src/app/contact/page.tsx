'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { SiteContent, OfficeLocation } from '@/types/siteContent';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Building,
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

  const offices: OfficeLocation[] = siteContent?.offices || [
    {
      id: '1',
      city: 'Islamabad Head Office (B-17 & Faisal Town)',
      address: 'Commercial Avenue, Block B, MPCHS Multi Gardens B-17, Islamabad',
      phone: '+92 315 5735785',
      whatsapp: '923155735785',
      email: 'farhanullah3333@gmail.com',
    },
  ];

  const primaryPhone = siteContent?.company?.phone || '+92 315 5735785';
  const primaryWhatsapp = siteContent?.company?.whatsapp || '923155735785';
  const primaryOffice = offices[0] || {
    city: 'Islamabad Head Office (B-17 & Faisal Town)',
    address: 'Commercial Avenue, Block B, MPCHS Multi Gardens B-17, Islamabad',
    phone: '+92 315 5735785',
    email: 'farhanullah3333@gmail.com',
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
    <div className="min-h-screen bg-[#071322] text-white py-12 px-4 sm:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            Confidential Consultation &amp; Offices
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-white leading-tight">
            Connect with Our Advisory Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Whether you seek verified society acquisitions, transparent developer transfers, or plot demarcation, our partners are at your service.
          </p>
        </div>

        {/* 2-Column Form & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Form Container */}
          <div className="lg:col-span-7 bg-[#0B1A2E]/90 border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl backdrop-blur-md">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-white text-slate-950 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{name}</strong>. A dedicated Senior Principal Broker will review your requirements and reach out via phone or WhatsApp.
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
                    className="bg-white text-slate-950 font-black text-xs px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Send a Private Inquiry
                  </h3>
                  <p className="text-xs text-slate-400">
                    All client interactions remain strictly confidential under non-disclosure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mehmood"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#071322] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 315 5735785"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#071322] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#071322] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#071322] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/50"
                    >
                      <option value="Buying Luxury Residence">Buying Residential Property</option>
                      <option value="Society File Investment">Society File Investment &amp; Installments</option>
                      <option value="Commercial Plaza Demarcation">Commercial Plaza Demarcation</option>
                      <option value="Selling Property / Listing">Selling / Listing My Property</option>
                      <option value="Overseas Client Advisory">Overseas Client Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Your Requirements / Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Specify society of interest (MPCHS, Faisal Town, Faisal Hills, Bahria), plot size, budget, or general questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#071322] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/50 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Request...' : 'Submit Advisory Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* VIP Contact & Primary Office Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-[#0B1A2E]/90 border border-white/10 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-md">
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
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp ({primaryWhatsapp})</span>
                  </a>

                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="w-full bg-[#142338] hover:bg-[#1E3352] text-white border border-white/15 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-300" />
                    <span>Direct Hotline ({primaryPhone})</span>
                  </a>
                </div>
              </div>

              {/* Bottom: Principal Office Details */}
              <div className="pt-6 border-t border-white/10 space-y-3.5">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
                    Principal Transfer &amp; Advisory Office
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold tracking-[-0.02em] text-white">
                    {primaryOffice.city}
                  </h4>
                </div>

                <div className="bg-[#071322] border border-white/10 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
                  <p className="flex items-start gap-2.5 leading-relaxed">
                    <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span className="text-slate-200">{primaryOffice.address}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-white/10 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{primaryOffice.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{primaryOffice.email || 'farhanullah3333@gmail.com'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
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

        {/* Regional Offices Grid if more than 1 office */}
        {offices.length > 1 && (
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Network Branches
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Regional Office Locations ({offices.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offices.map((off, idx) => (
                <div
                  key={off.id || idx}
                  className="bg-[#0B1A2E]/90 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-white">
                        {off.city}
                      </h4>
                      <span className="text-[11px] text-slate-400">Authorized Branch</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{off.address}</span>
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${off.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 text-white font-bold hover:text-slate-300"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{off.phone}</span>
                    </a>

                    {off.whatsapp && (
                      <a
                        href={`https://wa.me/${off.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
