'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { SiteContent } from '@/types/siteContent';
import PropertyCard from '@/components/properties/PropertyCard';
import HeroSearch from '@/components/home/HeroSearch';
import { HOUSING_SOCIETIES } from '@/data/locations';
import {
  ChevronRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, contentRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/site-content'),
        ]);

        const propsData = await propsRes.json();
        const contentData = await contentRes.json();

        if (propsData.data) {
          setProperties(
            propsData.data.filter(
              (p: Property) =>
                p.status === 'published' ||
                p.status === 'sold' ||
                p.status === 'rented'
            )
          );
        }
        if (contentData.data) {
          setSiteContent(contentData.data);
        }
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
    subtitle:
      'Explore premier residential plots, luxury houses, modern apartments, and commercial properties across top housing societies in Islamabad & Rawalpindi.',
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
    <div className="bg-white text-slate-950 min-h-screen font-sans">
      {/* 1. HERO SECTION (Full Viewport Dark Blue) */}
      <section className="relative z-20 architectural-grid text-white min-h-[calc(100vh-64px)] min-h-[calc(100svh-64px)] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-8">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1320] via-[#0B1320]/85 to-[#0B1320]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-[#0B1320]/60" />
          <div className="absolute inset-0 architectural-grid-overlay opacity-50 pointer-events-none" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full">
          {/* Top Hero Text */}
          <div className="max-w-4xl space-y-2.5 sm:space-y-3 pb-6 sm:pb-8">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-white leading-[1.12]">
              {hero.title} <br />
              <span className="text-slate-100">{hero.highlightText}</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          {/* Sharp Search Console */}
          <div className="relative z-30 pt-1">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. PRIME HOUSING SOCIETIES & DEVELOPERS */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-y border-slate-300 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
              Authorized Society Portfolios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950">
              Prime Housing Societies & Sectors
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              We help clients find verified plots, developer files, and luxury homes in Pakistan's top housing societies.
            </p>
          </div>

          {/* Location Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOUSING_SOCIETIES.slice(0, 6).map((society) => (
              <div
                key={society.id}
                className="bg-white border border-slate-300 flex flex-col justify-between group overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image
                    src={society.image}
                    alt={society.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320]/90 via-[#0B1320]/30 to-transparent" />

                  {/* City Badge */}
                  <div className="absolute top-3 left-3 bg-[#0B1320] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 border border-white/30">
                    {society.city}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-[-0.02em] text-slate-950 group-hover:text-black transition">
                      {society.name}
                    </h3>

                    {/* Developer Info */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 p-2 border border-slate-200">
                      <Building className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="truncate">Developer: {society.developer}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {society.description}
                    </p>

                    {/* Available Categories */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 tracking-wider">
                        Available Categories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {society.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-200/80 text-slate-800 text-[11px] font-bold px-2 py-0.5"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <Link
                      href={`/properties?society=${encodeURIComponent(society.name)}`}
                      className="w-full bg-[#0B1320] hover:bg-black text-white text-xs font-bold py-2.5 px-4 flex items-center justify-center gap-2 transition"
                    >
                      <span>Explore Society Inventory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 border border-slate-400 font-bold text-sm px-6 py-3 transition"
            >
              <span>View All Societies & Inventory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED INVENTORY PORTFOLIO */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 border-b border-slate-300 pb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600 block mb-1">
              Verified Dealer Listings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950">
              Featured Society Inventory
            </h2>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-bold text-slate-950 hover:text-black border border-slate-400 bg-white px-5 py-2.5 hover:bg-slate-100 transition"
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
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
              {whyChoose.eyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 leading-tight">
              {whyChoose.heading}
            </h2>
            <p className="text-base text-slate-700 font-medium leading-relaxed">
              {whyChoose.description}
            </p>

            <div className="space-y-4 pt-2">
              {whyChoose.points.map((point) => (
                <div
                  key={point.id}
                  className="flex items-start gap-3.5 bg-[#F8FAFC] p-4 border border-slate-300"
                >
                  <ShieldCheck className="w-5 h-5 text-[#0B1320] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-950">
                      {point.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Society Office & On-Ground Inspection Image */}
          <div className="relative aspect-[4/3] overflow-hidden border border-slate-300 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Housing Society Development Verification"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600">
                    On-Ground Inspection
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                    MPCHS B-17 & Faisal Town Direct Filings
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 border border-slate-300">
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
