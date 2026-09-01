'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { useStore } from '@/lib/store';
import PropertyCard from '@/components/properties/PropertyCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function SavedPropertiesPage() {
  const { savedPropertyIds } = useStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.data) {
          setProperties(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const savedListings = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-amber-600">
              Personal Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-900 mt-1">
              Saved Residences & Estates ({savedListings.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your curated shortlist of luxury properties for future comparison and VIP viewings.
            </p>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 border border-slate-200 bg-white px-4 py-2 rounded-full transition shadow-xs"
          >
            <span>Explore More Properties</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          </Link>
        </div>

        {/* List of Saved Items */}
        {savedListings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 border border-rose-200 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              No Properties Saved Yet
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed px-4">
              Click the heart icon on any villa, penthouse, or plot across the website to save it to your private portfolio.
            </p>
            <div className="pt-2">
              <Link
                href="/properties"
                className="gold-gradient-button font-bold text-xs px-8 py-3 rounded-full shadow-md inline-block"
              >
                Browse Luxury Portfolio
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
