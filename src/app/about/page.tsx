'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SiteContent } from '@/types/siteContent';

const LEADERSHIP_TEAM = [
  {
    name: 'Kamran Ishaq',
    role: 'Managing Principal — MPCHS & ZEDEM Projects',
    bio: 'Over 18 years specializing in master-planned society acquisitions, balloting procedures, and developer transfers.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sara Ishaq',
    role: 'Head of Overseas Client Desks & File Transfers',
    bio: 'Dedicated advisory for overseas Pakistanis in UAE, UK, and North America managing remote society file transactions.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tariq Mehmood',
    role: 'Director of On-Ground Verification & Commercial Advisory',
    bio: 'Specialist in physical plot demarcation, commercial plaza ROI, and DHA & Bahria Town market intelligence.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
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
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-8 space-y-20 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            {about.eyebrow}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
            {about.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {about.storyP1}
          </p>
        </div>

        {/* Narrative & Image Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden border border-slate-200 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Housing Society Development"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Trusted Dealer Advisory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900">
              A Legacy of Transparent Transfers and Verified Titles
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {about.storyP2}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                <span className="text-xl font-extrabold text-[#0B1320] block">{about.stat1Value}</span>
                <p className="text-xs text-slate-600 font-bold mt-1">{about.stat1Label}</p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                <span className="text-xl font-extrabold text-[#0B1320] block">{about.stat2Value}</span>
                <p className="text-xs text-slate-600 font-bold mt-1">{about.stat2Label}</p>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                <span className="text-xl font-extrabold text-[#0B1320] block">{about.stat3Value}</span>
                <p className="text-xs text-slate-600 font-bold mt-1">{about.stat3Label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Dealer Leadership
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900">
              Meet the Senior Advisory Principals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-slate-200 overflow-hidden p-6 space-y-4 shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold tracking-[-0.02em] text-slate-900">
                    {member.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-600 block mb-2">
                    {member.role}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
