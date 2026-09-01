'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, PropertyFilterParams } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilterDrawer from '@/components/properties/PropertyFilterDrawer';
import {
  Search,
  ArrowUpDown,
  Building,
  Check,
  ChevronDown,
} from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
];

function PropertyListingsContent() {
  const searchParams = useSearchParams();
  const sortRef = useRef<HTMLDivElement>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilterParams>({
    purpose: (searchParams.get('purpose') as any) || 'all',
    category: (searchParams.get('category') as any) || 'all',
    type: (searchParams.get('type') as any) || 'all',
    society: searchParams.get('society') || undefined,
    city: searchParams.get('city') || undefined,
    area: searchParams.get('area') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
    sizeRange: searchParams.get('sizeRange') || undefined,
    sortBy: 'newest',
  });

  // Sync filters whenever URL searchParams change
  useEffect(() => {
    setFilters({
      purpose: (searchParams.get('purpose') as any) || 'all',
      category: (searchParams.get('category') as any) || 'all',
      type: (searchParams.get('type') as any) || 'all',
      society: searchParams.get('society') || undefined,
      city: searchParams.get('city') || undefined,
      area: searchParams.get('area') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
      sizeRange: searchParams.get('sizeRange') || undefined,
      sortBy: 'newest',
    });
  }, [searchParams]);

  const [searchKeyword, setSearchKeyword] = useState('');

  // Close sort menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.purpose && filters.purpose !== 'all') query.set('purpose', filters.purpose);
      if (filters.category && filters.category !== 'all') query.set('category', filters.category);
      if (filters.type && filters.type !== 'all') query.set('type', filters.type);
      if (filters.society) query.set('society', filters.society);
      if (filters.city) query.set('city', filters.city);
      if (filters.area) query.set('area', filters.area);
      if (filters.minPrice) query.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) query.set('maxPrice', filters.maxPrice.toString());
      if (filters.minBedrooms) query.set('minBedrooms', filters.minBedrooms.toString());
      if (filters.sizeRange) query.set('sizeRange', filters.sizeRange);
      if (filters.sortBy) query.set('sortBy', filters.sortBy);

      const res = await fetch(`/api/properties?${query.toString()}`);
      const data = await res.json();
      if (data.data) {
        setProperties(data.data.filter((p: Property) => p.status === 'published' || p.status === 'sold' || p.status === 'rented'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      purpose: 'all',
      category: 'all',
      type: 'all',
      sortBy: 'newest',
    });
    setSearchKeyword('');
  };

  const filteredProperties = properties.filter((p) => {
    if (!searchKeyword) return true;
    const q = searchKeyword.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.society && p.society.toLowerCase().includes(q)) ||
      (p.developer && p.developer.toLowerCase().includes(q)) ||
      (p.location.area && p.location.area.toLowerCase().includes(q)) ||
      (p.location.city && p.location.city.toLowerCase().includes(q))
    );
  });

  const currentSortLabel = SORT_OPTIONS.find((s) => s.value === (filters.sortBy || 'newest'))?.label || 'Newest First';

  return (
    <div className="min-h-screen bg-white text-slate-900 py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-slate-300">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-600">
              Verified Dealer Inventory
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 mt-1">
              Housing Societies & Properties
            </h1>
            <p className="text-sm text-slate-700 font-medium mt-1">
              Explore verified residential plots, plot files, commercial avenues, and luxury houses across MPCHS, Faisal Town, Faisal Hills, and DHA.
            </p>
          </div>

          {/* Custom Sort Dropdown */}
          <div ref={sortRef} className="relative shrink-0">
            <div
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2.5 bg-[#0B1320] text-white border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer select-none transition hover:border-slate-400"
            >
              <ArrowUpDown className="w-4 h-4 text-slate-300" />
              <span>Sort: {currentSortLabel}</span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${sortOpen ? 'rotate-180 text-white' : ''}`} />
            </div>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#0B1320] border border-slate-700 shadow-2xl z-50 py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, sortBy: opt.value as any });
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                      (filters.sortBy || 'newest') === opt.value
                        ? 'bg-white text-black font-extrabold'
                        : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {(filters.sortBy || 'newest') === opt.value && (
                      <Check className="w-4 h-4 text-black shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by society (e.g. MPCHS B-17, Faisal Hills), developer, city, or property type..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-black placeholder:text-slate-400"
            />
          </div>

          <PropertyFilterDrawer
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            totalResults={filteredProperties.length}
          />
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-100 border border-slate-200" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#F8FAFC] border border-slate-200 p-8 space-y-4">
            <Building className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              No properties matched your current filter criteria. Try searching a different society, category, or reset the filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#0B1320] text-white text-xs font-bold px-6 py-2.5 hover:bg-black transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PropertyListingsContent />
    </Suspense>
  );
}
