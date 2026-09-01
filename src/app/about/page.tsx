'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteContent, DealerMember } from '@/types/siteContent';
import { ShieldCheck, Phone, Mail, Award, CheckCircle2, ArrowRight } from 'lucide-react';

const DEFAULT_LEADERSHIP: DealerMember[] = [
  {
    id: '1',
    name: 'Kamran Ishaq',
    role: 'Managing Principal — MPCHS & ZEDEM Projects',
    bio: 'Over 18 years specializing in master-planned society acquisitions, balloting procedures, and developer transfers.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+92 315 5735785',
    email: 'farhanullah3333@gmail.com',
  },
  {
    id: '2',
    name: 'Sara Ishaq',
    role: 'Head of Overseas Client Desks & File Transfers',
    bio: 'Dedicated advisory for overseas Pakistanis in UAE, UK, and North America managing remote society file transactions.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '+92 315 5735785',
    email: 'farhanullah3333@gmail.com',
  },
  {
    id: '3',
    name: 'Tariq Mehmood',
    role: 'Director of On-Ground Verification & Commercial Advisory',
    bio: 'Specialist in physical plot demarcation, commercial plaza ROI, and DHA & Bahria Town market intelligence.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+92 315 5735785',
    email: 'farhanullah3333@gmail.com',
  },
];

export default function AboutPage() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data) setSiteContent(d.data);
      })
      .catch(() => {});
  }, []);

  const about = siteContent?.about || {
    eyebrow: 'Bin Ishaq Property Advisory',
    heading: 'Authorized Dealer for Pakistan’s Premier Housing Societies',
    storyP1:
      'Bin Ishaq Real Estate is an authorized real estate dealership and property advisory specializing in MPCHS, ZEDEM International (Faisal Town, Faisal Hills, Faisal Margalla City), Bahria Town, and DHA.',
    storyP2:
      'We assist individual buyers, overseas Pakistanis, and institutional investors in acquiring verified residential plots, commercial investments, and luxury residences with seamless developer transfers and zero documentation ambiguity.',
    stat1Value: '100%',
    stat1Label: 'Official Society Verification',
    stat2Value: 'Direct',
    stat2Label: 'Developer Transfer Support',
    stat3Value: 'Zero',
    stat3Label: 'Hidden Surcharges',
    dealers: DEFAULT_LEADERSHIP,
  };

  const dealersList =
    about.dealers && about.dealers.length > 0 ? about.dealers : DEFAULT_LEADERSHIP;

  return (
    <div className="min-h-screen bg-[#071322] text-white py-12 px-4 sm:px-8 space-y-16 sm:space-y-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 inline-block">
            {about.eyebrow}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-white leading-tight">
            {about.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            {about.storyP1}
          </p>
        </div>

        {/* Narrative & Image Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-[#0B1A2E]/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Housing Society Development"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#071322]/90 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verified Society Master Plans
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-300">
                Official Catalog
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              Trusted Dealer Advisory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
              A Legacy of Transparent Transfers and Verified Titles
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {about.storyP2}
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="bg-[#142338] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {about.stat1Value}
                </span>
                <p className="text-[11px] text-slate-300 font-bold mt-1 leading-tight">
                  {about.stat1Label}
                </p>
              </div>

              <div className="bg-[#142338] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {about.stat2Value}
                </span>
                <p className="text-[11px] text-slate-300 font-bold mt-1 leading-tight">
                  {about.stat2Label}
                </p>
              </div>

              <div className="bg-[#142338] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {about.stat3Value}
                </span>
                <p className="text-[11px] text-slate-300 font-bold mt-1 leading-tight">
                  {about.stat3Label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Dealers & Leadership Team */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              Dealer Leadership &amp; Consultants
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
              Meet the Senior Advisory Principals
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct point of contact for society balloting, file transfers, and commercial acquisitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealersList.map((member) => (
              <div
                key={member.id || member.name}
                className="bg-[#0B1A2E]/90 border border-white/10 rounded-2xl overflow-hidden p-6 space-y-4 shadow-xl hover:border-white/25 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-900 border border-white/10">
                    <Image
                      src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold tracking-[-0.02em] text-white">
                      {member.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      {member.role}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Direct Contact Actions if available */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{member.phone}</span>
                    </a>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white"
                      title={member.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#0B1320] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Looking to Buy or Sell Verified Society Properties?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Contact our authorized dealer principals today for transparent valuations, on-ground verification, and direct society transfers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm py-3 px-6 rounded-xl transition shadow cursor-pointer"
            >
              Contact Advisory Desk
            </Link>
            <Link
              href="/submit-property"
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm py-3 px-6 rounded-xl border border-white/20 transition cursor-pointer"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
