'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Building,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Phone,
  FileText,
} from 'lucide-react';

const DEALER_SERVICES = [
  {
    title: 'Housing Society Plot Sales & Acquisitions',
    desc: 'Authorized dealer representation for buying and selling residential and commercial plots in MPCHS Multi Gardens B-17, Faisal Town, Faisal Hills, DHA, and Bahria Town with verified maps and demarcation.',
    points: [
      'Physical on-ground plot verification and street inspection',
      'Direct society title scrutiny and dues clearance verification',
      'Accurate market valuation based on active sector transactions',
    ],
    icon: Compass,
  },
  {
    title: 'Direct Developer File Transfers & Bookings',
    desc: 'Official facilitation for installment files, pre-launch bookings, and balloting files with ZEDEM International, MPCHS, and Bahria Town transfer offices with zero ambiguity.',
    points: [
      'Official computerized transfer processing at head offices',
      'Clear payment ledger and statement of accounts verification',
      'Balloting timelines and sector allocation updates',
    ],
    icon: FileText,
  },
  {
    title: 'Commercial Plots & High-Yield Investment',
    desc: 'Strategic acquisition of commercial avenue plots and corporate plaza spaces in prime society markaz areas designed for high capital growth and long-term rental income.',
    points: [
      'Commercial plaza multi-storey approval guidance',
      'High footfall boulevard location selection',
      'Rental yield projections and tenant demand analysis',
    ],
    icon: Building,
  },
  {
    title: 'Overseas Expat Property Desk',
    desc: 'Dedicated concierge desk for overseas Pakistanis in GCC, UK, Europe, and North America to manage property investments in Islamabad, Rawalpindi, and Karachi seamlessly.',
    points: [
      'End-to-end remote file booking and biometric guidance',
      'Power of attorney (POA) and embassy attestation support',
      'Video walkthroughs and development progress reporting',
    ],
    icon: Award,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-8 space-y-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
            Dealer Advisory Services
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-slate-950 leading-tight">
            Comprehensive Housing Society Brokerage
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            From direct developer file transfers to verified on-ground plots and commercial holdings, we provide transparent guidance across Pakistan's premier societies.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEALER_SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-[#F8FAFC] border border-slate-300 p-8 space-y-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-[#0B1320] text-white flex items-center justify-center">
                <service.icon className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold tracking-[-0.02em] text-slate-950">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                {service.points.map((pt) => (
                  <div key={pt} className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Banner */}
        <div className="architectural-grid bg-[#0B1320] text-white p-8 sm:p-12 text-center space-y-4 border border-slate-800">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
            Looking to Buy or Sell in MPCHS, Faisal Town, or DHA?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-medium">
            Connect directly with our senior society advisory desk for verified rates, available files, and transfer assistance.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs px-8 py-3.5 inline-block transition shadow-lg"
            >
              Connect with Advisory Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
