'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { useStore } from '@/lib/store';
import { formatPrice, formatArea } from '@/lib/utils';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  ArrowUpRight,
  Building,
  Tag,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const { isPropertySaved, toggleSaveProperty, isUrdu } = useStore();
  const isSaved = isPropertySaved(property.id);

  const displayTitle =
    isUrdu && property.titleUrdu ? property.titleUrdu : property.title;

  const isSold = property.status === 'sold';
  const isRented = property.status === 'rented';

  const isResidentialStructure =
    (property.category === 'house' ||
      property.category === 'apartment' ||
      (property as any).type === 'villa' ||
      (property as any).type === 'house' ||
      (property as any).type === 'apartment') &&
    (property.specs?.bedrooms || 0) > 0;

  const displayPrice =
    property.priceDisplay ||
    (property.price && property.price > 0
      ? formatPrice(property.price, 'PKR', property.purpose === 'rent')
      : 'Call for Rate');

  return (
    <div
      className={`clean-card group flex flex-col justify-between bg-white border ${
        isSold ? 'border-black' : 'border-slate-300'
      } shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={property.featuredImage || property.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'}
          alt={displayTitle}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            isSold ? 'grayscale-[30%]' : ''
          }`}
        />

        {/* Subtle Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* SOLD / CATEGORY BADGE */}
        {isSold ? (
          <div className="absolute top-3 left-3 z-20 bg-black text-white font-black text-xs uppercase tracking-widest px-3.5 py-1.5 border border-white/50 shadow-md">
            SOLD
          </div>
        ) : isRented ? (
          <div className="absolute top-3 left-3 z-20 bg-[#141E30] text-white font-black text-xs uppercase tracking-widest px-3.5 py-1.5 border border-white/50 shadow-md">
            LEASED
          </div>
        ) : (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="bg-[#0B1320] text-white text-[11px] uppercase font-extrabold tracking-wider px-2.5 py-1 border border-white/20">
              {property.propertyType || property.category}
            </span>
          </div>
        )}

        {/* Heart Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveProperty(property.id);
          }}
          className={`absolute top-3 right-3 p-2 transition z-10 ${
            isSaved
              ? 'bg-black text-white'
              : 'bg-white text-slate-900 hover:bg-black hover:text-white'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Property Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Society & Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="truncate">
              {property.society || property.location?.society || property.location?.area},{' '}
              {property.city || property.location?.city}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/properties/${property.id}`}
            className="font-serif block text-base sm:text-lg font-bold tracking-[-0.02em] text-slate-950 group-hover:text-black transition-colors line-clamp-1 leading-snug"
          >
            {displayTitle}
          </Link>

          {/* Flexible Dealer Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-200 text-xs font-bold text-slate-800 my-3">
            {isResidentialStructure ? (
              <>
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{property.specs.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{property.specs.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>
                    {formatArea(property.specs.areaSize, property.specs.areaUnit)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 truncate col-span-2">
                  <Building className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">
                    {property.developer || 'Society Transfer'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>
                    {formatArea(property.specs.areaSize, property.specs.areaUnit)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
              {isSold ? 'Closed Deal' : 'Demand / Valuation'}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-base sm:text-lg font-black leading-tight ${
                  isSold ? 'line-through text-slate-400' : 'text-slate-950'
                }`}
              >
                {displayPrice}
              </span>
              {isSold && (
                <span className="bg-black text-white text-[10px] font-black uppercase px-1.5 py-0.5">
                  SOLD
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="bg-[#0B1320] hover:bg-black text-white text-xs sm:text-sm font-bold px-3.5 py-2 flex items-center gap-1.5 transition"
          >
            <span>{isSold ? 'Details' : 'Inquire'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
