'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BinIshaqLogo from '@/components/common/BinIshaqLogo';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Award,
  Clock,
} from 'lucide-react';
import { SiteContent } from '@/types/siteContent';

const TRUST_ICONS = [ShieldCheck, Award, Clock];

export default function Footer() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data) setContent(d.data);
      })
      .catch(() => {});
  }, []);

  const phone = content?.company?.phone || '+92 300 5195000';
  const whatsapp = content?.company?.whatsapp || '923005195000';
  const email = content?.company?.email || 'info@binishaqproperties.com';
  const address = content?.company?.address || 'Head Office: Faisal Town / MPCHS B-17 Commercial Hub, Islamabad';

  const brandDescription =
    content?.footer?.brandDescription ||
    'Bin Ishaq Properties — Authorized property dealer & advisory for Pakistan’s leading housing societies. Delivering verified plots, transparent developer transfers, and high-growth investment guidance in Islamabad and Rawalpindi.';

  const trustBadges = content?.footer?.trustBadges || [
    {
      id: 'tb-1',
      title: 'Official Society Transfers',
      description: 'Direct verification with MPCHS, ZEDEM, and Bahria Town offices.',
    },
    {
      id: 'tb-2',
      title: 'On-Ground Physical Verification',
      description: 'Accurate sector location, demarcation, and development status.',
    },
    {
      id: 'tb-3',
      title: 'Overseas Expat Desk',
      description: 'Seamless remote file processing and investment advisory.',
    },
  ];

  const exploreLinks = content?.footer?.exploreLinks || [
    { label: 'Browse All Inventory', href: '/properties' },
    { label: 'Residential Plots for Sale', href: '/properties?category=plot' },
    { label: 'Commercial Plots & Shops', href: '/properties?category=commercial' },
    { label: 'Plot Files & Bookings', href: '/properties?category=file' },
    { label: 'Houses & Villas', href: '/properties?category=house' },
    { label: 'Apartments & Penthouses', href: '/properties?category=apartment' },
  ];

  const primeLocationLinks = content?.footer?.primeLocationLinks || [
    { label: 'MPCHS Multi Gardens B-17', href: '/properties?society=MPCHS' },
    { label: 'Faisal Town Islamabad', href: '/properties?society=Faisal+Town' },
    { label: 'Faisal Town Phase 2', href: '/properties?society=Faisal+Town+Phase+2' },
    { label: 'Faisal Hills Islamabad', href: '/properties?society=Faisal+Hills' },
    { label: 'Bahria Town (ISB/RWP)', href: '/properties?society=Bahria' },
  ];

  const copyrightText =
    content?.footer?.copyrightText ||
    'Bin Ishaq Real Estate & Advisory. All rights reserved.';

  const legalLinks = content?.footer?.legalLinks || [
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Brokerage', href: '/about' },
    { label: 'Office Locator', href: '/contact' },
  ];

  return (
    <footer className="architectural-grid bg-[#0B1320] border-t border-slate-800 text-slate-400 pt-16 pb-24 sm:pb-16 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800">
          {trustBadges.map((badge, idx) => {
            const Icon = TRUST_ICONS[idx % TRUST_ICONS.length] || ShieldCheck;
            return (
              <div key={badge.id || idx} className="flex items-center gap-4 bg-[#141E30] border border-slate-800 p-4">
                <div className="p-3 bg-white text-[#0B1320] font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{badge.title}</h4>
                  <p className="text-xs text-slate-400">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <BinIshaqLogo size="lg" variant="light" />

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {brandDescription}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 border border-emerald-600/40 px-4 py-2 text-xs font-bold transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 bg-[#141E30] hover:bg-[#1E2B45] text-slate-200 border border-slate-700 px-4 py-2 text-xs font-bold transition"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Explore Portfolio
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {exploreLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Prime Areas */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              {primeLocationLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              Office Concierge
            </h4>
            <ul className="space-y-3 text-xs leading-relaxed font-semibold">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {copyrightText}</p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:text-white transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
