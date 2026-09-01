'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { useStore } from '@/lib/store';
import { formatPrice, formatArea } from '@/lib/utils';
import GalleryLightbox from './GalleryLightbox';
import PropertyCard from './PropertyCard';
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  Calendar,
  Sparkles,
  MapPin,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Eye,
  User,
  ExternalLink,
  Tag,
  Building,
} from 'lucide-react';

interface PropertyDetailViewProps {
  property: Property;
  relatedProperties: Property[];
}

export default function PropertyDetailView({
  property,
  relatedProperties,
}: PropertyDetailViewProps) {
  const {
    isPropertySaved,
    toggleSaveProperty,
    openBookingModal,
    openInquiryModal,
    showToast,
    isUrdu,
  } = useStore();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isSaved = isPropertySaved(property.id);
  const formattedPrice =
    property.priceDisplay ||
    (property.price
      ? formatPrice(property.price, 'PKR', property.purpose === 'rent')
      : 'Call for Rate');
  const formattedArea = formatArea(property.specs.areaSize, property.specs.areaUnit);

  const displayTitle = isUrdu && property.titleUrdu ? property.titleUrdu : property.title;
  const displayDesc = isUrdu && property.descriptionUrdu ? property.descriptionUrdu : property.description;

  const isSold = property.status === 'sold';
  const isRented = property.status === 'rented';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Fullscreen Lightbox Modal */}
      <GalleryLightbox
        images={property.images}
        videoUrl={property.videoTourUrl}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* SOLD / RENTED TOP NOTIFICATION BANNER */}
      {isSold && (
        <div className="bg-black text-white px-4 py-3.5 border-b border-slate-800 text-center font-bold text-xs sm:text-sm tracking-wide">
          <span className="bg-white text-black text-xs font-black uppercase px-2 py-0.5 mr-2.5">
            SOLD
          </span>
          <span>
            This exclusive residence has been successfully acquired & closed by Bin Ishaq Real Estate.
          </span>
        </div>
      )}

      {isRented && (
        <div className="bg-[#0B1320] text-white px-4 py-3.5 border-b border-slate-800 text-center font-bold text-xs sm:text-sm tracking-wide">
          <span className="bg-slate-200 text-[#0B1320] text-xs font-black uppercase px-2 py-0.5 mr-2.5">
            RENTED
          </span>
          <span>
            This property has been successfully leased through Bin Ishaq Real Estate.
          </span>
        </div>
      )}

      {/* Top Breadcrumbs */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-black transition">
              Properties
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate">{property.location.area}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-black transition font-medium cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={`flex items-center gap-1.5 transition font-medium cursor-pointer ${
                isSaved ? 'text-black font-semibold' : 'hover:text-black'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 overflow-hidden mb-8 max-h-[520px]">
          {/* Main Hero Photo */}
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-full cursor-pointer group bg-slate-900 overflow-hidden border border-slate-200"
          >
            <Image
              src={property.images[0]}
              alt={displayTitle}
              fill
              priority
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${isSold ? 'grayscale-[25%]' : ''}`}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {isSold ? (
                <span className="bg-black text-white font-black text-xs uppercase tracking-widest px-3 py-1 border border-white/50 shadow-md">
                  SOLD
                </span>
              ) : isRented ? (
                <span className="bg-[#0B1320] text-white font-black text-xs uppercase tracking-widest px-3 py-1 border border-white/50 shadow-md">
                  RENTED
                </span>
              ) : (
                <span className="bg-[#0B1320] text-white text-xs font-bold uppercase px-3 py-1 shadow-md">
                  {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                </span>
              )}

              {property.isVerified && (
                <span className="flex items-center gap-1 bg-white text-slate-900 border border-slate-300 text-xs px-2.5 py-1 font-bold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                  <span>Verified Title</span>
                </span>
              )}
            </div>
          </div>

          {/* Secondary 2 Images */}
          <div className="hidden md:grid grid-cols-1 gap-3 md:col-span-1">
            {property.images.slice(1, 3).map((img, idx) => (
              <div
                key={img + idx}
                onClick={() => {
                  setLightboxIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="relative h-full min-h-[250px] cursor-pointer group bg-slate-900 overflow-hidden border border-slate-200"
              >
                <Image
                  src={img}
                  alt={`Gallery view ${idx + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            ))}
          </div>

          {/* Third Column with View All Overlay */}
          <div className="hidden md:grid grid-cols-1 gap-3 md:col-span-1">
            {property.images.slice(3, 5).map((img, idx) => (
              <div
                key={img + idx}
                onClick={() => {
                  setLightboxIndex(idx + 3);
                  setLightboxOpen(true);
                }}
                className="relative h-full min-h-[250px] cursor-pointer group bg-slate-900 overflow-hidden border border-slate-200"
              >
                <Image
                  src={img}
                  alt={`Gallery view ${idx + 4}`}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                {idx === 1 && (
                  <div className="absolute inset-0 bg-[#0B1320]/80 flex flex-col items-center justify-center text-white hover:bg-[#0B1320]/70 transition">
                    <Sparkles className="w-6 h-6 text-white mb-1" />
                    <span className="text-sm font-bold">
                      View All {property.images.length} Photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Details Left */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Price Header */}
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>{property.propertyType || property.category || (property as any).type}</span>
                <span>•</span>
                <span>REF: {property.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Eye className="w-3.5 h-3.5" />
                  {property.viewsCount || 0} Views
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
                {displayTitle}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{property.location.address}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-baseline gap-4">
                <span className={`text-3xl sm:text-4xl font-bold ${isSold ? 'line-through text-slate-400' : 'text-[#0B1320]'}`}>
                  {formattedPrice}
                </span>
                {isSold && (
                  <span className="bg-black text-white text-xs uppercase font-black px-2.5 py-1">
                    SOLD
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-600 bg-[#F8FAFC] border border-slate-200 px-3 py-1">
                  {formattedArea} Total Area
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Society & Property Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                    <Building className="w-4 h-4 text-slate-600" />
                    Society / Sector
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate block">
                    {property.society || property.location.society || property.location.area}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                    Developer
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate block">
                    {property.developer || 'Authorized Society'}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                    <Tag className="w-4 h-4 text-slate-600" />
                    Category
                  </span>
                  <span className="text-sm font-bold text-slate-900 capitalize block">
                    {property.propertyType || property.category}
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                  <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                    <Maximize2 className="w-4 h-4 text-slate-600" />
                    Total Area
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {formattedArea}
                  </span>
                </div>

                {(property.specs.bedrooms || 0) > 0 && (
                  <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                      <Bed className="w-4 h-4 text-slate-600" />
                      Bedrooms
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {property.specs.bedrooms} Rooms
                    </span>
                  </div>
                )}

                {(property.specs.bathrooms || 0) > 0 && (
                  <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                      <Bath className="w-4 h-4 text-slate-600" />
                      Bathrooms
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {property.specs.bathrooms} Baths
                    </span>
                  </div>
                )}

                {property.attributes?.floor && (
                  <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                      <Building className="w-4 h-4 text-slate-600" />
                      Floor Level
                    </span>
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {property.attributes.floor}
                    </span>
                  </div>
                )}

                {property.attributes?.possessionStatus && (
                  <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                      <ShieldCheck className="w-4 h-4 text-slate-600" />
                      Possession Status
                    </span>
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {property.attributes.possessionStatus.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {property.attributes?.floors && (
                  <div className="bg-[#F8FAFC] border border-slate-200 p-4">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5 mb-1 font-medium">
                      <Building className="w-4 h-4 text-slate-600" />
                      Structure
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {property.attributes.floors} Storey
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Narrative */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                About the Property
              </h3>
              <div className="bg-[#F8FAFC] border border-slate-200 p-6">
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal">
                  {displayDesc}
                </p>
              </div>
            </div>

            {/* Amenities & Features */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Amenities & Luxury Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(property.features || []).map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-200 px-4 py-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-800 font-semibold">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map & Neighborhood */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Location & Enclave
              </h3>
              <div className="aspect-[16/7] w-full border border-slate-200 bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white border border-slate-300 text-slate-900 mx-auto flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {property.location.society || property.location.area}, {property.location.city}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Precise coordinates: {property.location.lat?.toFixed(4)}, {property.location.lng?.toFixed(4)}.
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      property.location.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-black font-bold underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action & Private Tour Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[#0B1320] text-white p-6 space-y-5 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                    {isSold ? 'Verified Closed Valuation' : 'Direct Office Concierge'}
                  </span>
                  <div className={`text-2xl font-bold text-white ${isSold ? 'line-through text-slate-400' : ''}`}>
                    {formattedPrice}
                  </div>
                  {isSold && (
                    <span className="text-xs font-bold text-emerald-400 block mt-1">
                      Status: Transaction Closed (SOLD)
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {!isSold ? (
                    <button
                      onClick={() => openBookingModal(property)}
                      className="w-full bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs sm:text-sm py-3.5 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Request VIP Private Visit</span>
                    </button>
                  ) : (
                    <div className="bg-[#141E30] text-slate-300 p-3 text-xs text-center border border-slate-700 font-semibold">
                      This listing is closed. Inquire below for similar off-market properties.
                    </div>
                  )}

                  <a
                    href={`https://wa.me/923212588222?text=I+am+inquiring+about+${encodeURIComponent(
                      property.title
                    )}+ID:+${property.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-3 flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat with Senior Partner on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => openInquiryModal(property)}
                    className="w-full bg-[#141E30] hover:bg-[#1E2B45] text-white border border-slate-700 font-semibold text-xs py-3 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>Send Message / Inquire Similar</span>
                  </button>
                </div>

                {/* Broker Info */}
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#141E30] border border-slate-700 flex items-center justify-center text-white font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {property.submittedBy?.name || 'Bin Ishaq Advisory Desk'}
                    </h5>
                    <p className="text-[11px] text-slate-300 font-medium capitalize">
                      Senior Executive Broker ({property.submittedBy?.role || 'authorized dealer'})
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {property.submittedBy?.phone || '+92 315 5735785'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-[#F8FAFC] border border-slate-200 p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-slate-900 shrink-0" />
                <p className="text-xs text-slate-600">
                  Inspected & Verified by Bin Ishaq Real Estate. Complete transfer & legal title assistance provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Residences */}
        {relatedProperties.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Curated Portfolio
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-[-0.02em] text-slate-900">
                  Similar Exclusive Residences
                </h3>
              </div>

              <Link
                href="/properties"
                className="text-xs font-bold text-slate-900 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.slice(0, 3).map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
