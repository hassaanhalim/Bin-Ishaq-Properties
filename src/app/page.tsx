'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
import PropertyCard from '@/components/properties/PropertyCard';
import { Property } from '@/types/property';
import { SiteContent } from '@/types/siteContent';
import {
  ShieldCheck,
  Building,
  ArrowRight,
  ChevronRight,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const HOUSING_SOCIETIES = [
  {
    id: 'mpchs-b17',
    name: 'MPCHS Multi Gardens B-17',
    city: 'Islamabad',
    developer: 'Multi Professional Cooperative Housing Society',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description:
      'A premier CDA-approved sector situated at the foot of Margalla Hills with direct access to GT Road and M-1 Motorway.',
    categories: ['Residential Plots', 'Commercial Avenue', 'Villas', 'Apartments'],
    sectors: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G (Multi Residencia)'],
  },
  {
    id: 'faisal-town',
    name: 'Faisal Town Islamabad',
    city: 'Rawalpindi / Islamabad',
    developer: 'ZEDEM International (Chaudhry Abdul Majeed)',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description:
      'Strategically located near the New Islamabad International Airport interchange, renowned for rapid development and high ROI.',
    categories: ['Residential Plots', 'Commercial Plazas', 'Installment Files'],
    sectors: ['Block A (Possession)', 'Block B (Executive)', 'Block C'],
  },
  {
    id: 'faisal-town-2',
    name: 'Faisal Town Phase 2',
    city: 'Chakri Road / M-2',
    developer: 'ZEDEM International',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description:
      'The flagship mega expansion project offering flexible 4.5-year installment plans right on the M-2 Thalian / Chakri interchange.',
    categories: ['5, 8, 10 Marla Plots', '1 & 2 Kanal Plots', 'Commercial Booking'],
    sectors: ['Overseas Enclave', 'General Block', 'Commercial Broadway'],
  },
  {
    id: 'faisal-hills',
    name: 'Faisal Hills Taxila / Islamabad',
    city: 'Taxila / N-5 GT Road',
    developer: 'ZEDEM International',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description:
      'A scenic master-planned community surrounded by Margalla viewpoints, featuring modern amenities and direct GT Road connectivity.',
    categories: ['Residential Plots', 'Executive Block', 'Park View Plots'],
    sectors: ['Executive Block', 'Block A', 'Block B', 'Block C', 'Block D'],
  },
  {
    id: 'bahria-town',
    name: 'Bahria Town Islamabad & Rawalpindi',
    city: 'Rawalpindi / Islamabad',
    developer: 'Bahria Town (Pvt) Ltd',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    description:
      'Pakistan’s benchmark master-planned gated community featuring underground utilities, luxury infrastructure, and commercial hubs.',
    categories: ['Luxury Houses', 'Commercial Hubs', 'Apartments', 'Plots'],
    sectors: ['Phase 1 to 8', 'Bahria Enclave Islamabad', 'Safari Valley'],
  },
  {
    id: 'faisal-margalla',
    name: 'Faisal Margalla City (FMC)',
    city: 'B-17 Adjacent / Islamabad',
    developer: 'ZEDEM International',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description:
      'An exclusive high-end enclave nestled directly against the Margalla Hills range, offering serene residential living with fast-track transfers.',
    categories: ['Residential Plots', 'Luxury Villa Demarcations'],
    sectors: ['Block A', 'Block B', 'Executive Enclave'],
  },
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSocieties, setExpandedSocieties] = useState<Record<string, boolean>>({});

  const toggleSociety = (id: string) => {
    setExpandedSocieties((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, contentRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/site-content'),
        ]);
        const propsData = await propsRes.json();
        const contentData = await contentRes.json();

        if (propsData.data) setProperties(propsData.data);
        if (contentData.data) setSiteContent(contentData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProperties = properties.filter((p) => p.isFeatured);

  const hero = siteContent?.hero || {
    title: 'Find Your Dream Property in',
    highlightText: 'Prime Locations',
    subtitle: '',
    bgImageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90',
  };

  const whyChoose = siteContent?.whyChoose || {
    eyebrow: 'Authorized Housing Society Dealer',
    heading: 'Why Clients Trust Bin Ishaq for Society Investments',
    description:
      'We provide direct dealer representation, verified title checks, transparent file transfers, and strategic guidance across Pakistan’s leading master-planned developments.',
    points: [
      {
        id: '1',
        title: 'Direct Society & Developer Transfers',
        description:
          'Direct submission and official verification with developer transfer offices (MPCHS, ZEDEM, Bahria, DHA).',
      },
      {
        id: '2',
        title: 'On-Ground Physical Verification',
        description:
          'Accurate on-ground sector location, plot demarcation, and real development progress reports.',
      },
      {
        id: '3',
        title: 'Strategic Capital Growth Advisory',
        description:
          'Actionable guidance on installment files, balloting dates, commercial avenues, and long-term ROI.',
      },
    ],
  };

  return (
    <div className="bg-[#071322] text-white min-h-screen font-sans">
      {/* 1. HERO SECTION (Full Viewport Dark Blue Architectural) */}
      <section className="relative z-20 architectural-grid text-white min-h-[calc(100vh-140px)] min-h-[calc(100svh-140px)] flex flex-col justify-center py-4 sm:py-16 px-4 sm:px-8">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={
              hero.bgImageUrl ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90'
            }
            alt="Housing Society Master Development"
            fill
            priority
            className="object-cover object-right sm:object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/85 to-[#071322]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071322] via-transparent to-[#071322]/60" />
          <div className="absolute inset-0 architectural-grid-overlay opacity-50 pointer-events-none" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full">
          {/* Top Hero Text */}
          <div className="max-w-4xl pb-3 sm:pb-6">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white leading-tight">
              {hero.title} <br className="hidden sm:inline" />
              <span className="text-slate-100">{hero.highlightText}</span>
            </h1>
          </div>

          {/* Sharp Search Console */}
          <div className="relative z-30">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. PRIME HOUSING SOCIETIES & DEVELOPERS */}
      <section className="py-16 sm:py-20 bg-[#0B1A2E]/50 border-y border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 bg-white/5 px-3.5 py-1 rounded-full border border-white/10 inline-block">
              Authorized Society Portfolios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
              Prime Housing Societies &amp; Sectors
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              We help clients find verified plots, developer files, and luxury homes in Pakistan's top housing societies.
            </p>
          </div>

          {/* Location Cards Grid (Compact & Expandable with Rounded Corners) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {HOUSING_SOCIETIES.slice(0, 6).map((society) => {
              const isExpanded = !!expandedSocieties[society.id];

              return (
                <div
                  key={society.id}
                  className="bg-[#0B1A2E] border border-white/10 rounded-2xl flex flex-col justify-between group overflow-hidden shadow-xl hover:border-white/25 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 rounded-t-2xl">
                    <Image
                      src={society.image}
                      alt={society.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/95 via-[#0B1A2E]/40 to-transparent" />

                    {/* City Badge */}
                    <div className="absolute top-3 left-3 bg-[#071322]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-white/20 shadow-md">
                      {society.city}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-[-0.02em] text-white group-hover:text-slate-100 transition">
                        {society.name}
                      </h3>

                      {/* Developer Info */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Developer: {society.developer}</span>
                      </div>

                      {/* Expand / Collapse Details Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSociety(society.id)}
                        className="w-full text-xs font-bold text-slate-300 hover:text-white py-1.5 flex items-center justify-between border-t border-white/10 transition cursor-pointer select-none"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isExpanded ? 'Hide Details' : 'Show Details & Categories'}</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="pt-2 space-y-3 border-t border-white/10 animate-in fade-in duration-200">
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            {society.description}
                          </p>

                          {/* Available Categories */}
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                              Available Categories:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {society.categories.map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="bg-white/10 border border-white/15 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Sectors */}
                          {society.sectors && society.sectors.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">
                                Prime Blocks / Sectors:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {society.sectors.map((sec, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-white/5 border border-white/10 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-md"
                                  >
                                    {sec}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA Action */}
                    <div className="pt-2 border-t border-white/10">
                      <Link
                        href={`/properties?society=${encodeURIComponent(society.name)}`}
                        className="w-full bg-white hover:bg-slate-100 text-[#071322] text-xs font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow"
                      >
                        <span>Explore Society Inventory</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#071322] font-black text-sm px-7 py-3.5 rounded-xl transition shadow-lg cursor-pointer"
            >
              <span>View All Societies &amp; Inventory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED INVENTORY PORTFOLIO */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
              Verified Dealer Listings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
              Featured Society Inventory
            </h2>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:text-slate-200 border border-white/20 bg-white/10 px-5 py-2.5 rounded-xl hover:bg-white/20 transition cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredProperties.length > 0 ? featuredProperties : properties)
            .slice(0, 4)
            .map((prop, idx) => (
              <PropertyCard key={prop.id} property={prop} priority={idx < 4} />
            ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
              {whyChoose.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
              {whyChoose.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              {whyChoose.description}
            </p>

            <div className="space-y-3.5 pt-2">
              {whyChoose.points.map((point) => (
                <div
                  key={point.id}
                  className="flex items-start gap-3.5 bg-[#0B1A2E] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-md"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {point.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Society Office & On-Ground Inspection Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Housing Society Development Verification"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-4 bg-[#071322]/90 backdrop-blur-md border border-white/15 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    On-Ground Inspection
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    MPCHS B-17 &amp; Faisal Town Direct Filings
                  </h4>
                </div>
                <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                  Verified Transfer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
