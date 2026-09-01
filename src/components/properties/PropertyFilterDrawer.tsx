'use client';

import React, { useState } from 'react';
import { PropertyFilterParams, PropertyPurpose, PropertyCategory } from '@/types/property';
import {
  X,
  RotateCcw,
  Check,
  SlidersHorizontal,
  Building,
  Maximize2,
} from 'lucide-react';

interface PropertyFilterProps {
  filters: PropertyFilterParams;
  onFilterChange: (newFilters: PropertyFilterParams) => void;
  onReset: () => void;
  totalResults?: number;
}

const CATEGORY_OPTIONS: { label: string; value: PropertyCategory }[] = [
  { label: 'Residential Plot', value: 'plot' },
  { label: 'Plot File / Booking', value: 'file' },
  { label: 'House / Villa', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Commercial Plot', value: 'commercial' },
  { label: 'Retail Shop', value: 'shop' },
  { label: 'Corporate Office', value: 'office' },
];

const PLOT_SIZE_OPTIONS = [
  { label: 'All Sizes', value: 'all' },
  { label: '5 Marla', value: '5-marla' },
  { label: '7 Marla', value: '7-marla' },
  { label: '10 Marla', value: '10-marla' },
  { label: '1 Kanal', value: '1-kanal' },
  { label: '2 Kanal', value: '2-kanal' },
  { label: '4+ Kanal', value: '4-kanal' },
];

const COMMERCIAL_SIZE_OPTIONS = [
  { label: 'All Sizes', value: 'all' },
  { label: '2-4 Marla (Shop / Booth)', value: '2-4-marla' },
  { label: '4-8 Marla (Plaza Plot)', value: '4-8-marla' },
  { label: '10-16 Marla (Commercial)', value: '10-16-marla' },
  { label: '1 Kanal+ (Corporate Plot)', value: '1-kanal-plus' },
  { label: '500-2000 Sq Ft (Office / Shop)', value: '500-2000-sqft' },
];

const HOUSING_SOCIETIES_OPTIONS = [
  'MPCHS Multi Gardens B-17',
  'Faisal Town Islamabad',
  'Faisal Town Phase 2',
  'Faisal Hills Islamabad',
  'Bahria Town (ISB/RWP)',
  'Other Societies & Areas',
];

const CITIES = ['Islamabad', 'Rawalpindi', 'Islamabad / Taxila Region'];

export default function PropertyFilterDrawer({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: PropertyFilterProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handlePurposeChange = (purpose: PropertyPurpose | 'all') => {
    onFilterChange({ ...filters, purpose });
  };

  const handleCategoryToggle = (cat: PropertyCategory) => {
    if (filters.category === cat) {
      onFilterChange({ ...filters, category: 'all' });
    } else {
      onFilterChange({ ...filters, category: cat });
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header with Results Count & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Filter Properties</h3>
          {totalResults !== undefined && (
            <p className="text-xs text-slate-500 font-medium">{totalResults} Verified Listings</p>
          )}
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-black transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Purpose: Buy vs Rent */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['all', 'buy', 'rent'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handlePurposeChange(mode)}
              className={`py-2 text-xs font-semibold capitalize transition ${
                (filters.purpose || 'all') === mode
                  ? 'bg-[#0B1320] text-white font-bold'
                  : 'bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {mode === 'all' ? 'All' : mode === 'buy' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Housing Society / Scheme */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Housing Society / Developer
        </label>
        <select
          value={filters.society || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              society: e.target.value === 'all' ? undefined : e.target.value,
            })
          }
          className="w-full bg-[#F8FAFC] border border-slate-300 p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-black"
        >
          <option value="all">All Housing Societies</option>
          {HOUSING_SOCIETIES_OPTIONS.map((soc) => (
            <option key={soc} value={soc}>
              {soc}
            </option>
          ))}
        </select>
      </div>

      {/* Property Categories */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Property Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleCategoryToggle(t.value)}
              className={`py-2 px-3 text-xs font-semibold transition text-left flex items-center justify-between ${
                filters.category === t.value
                  ? 'bg-[#0B1320] text-white font-bold'
                  : 'bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{t.label}</span>
              {filters.category === t.value && <Check className="w-3 h-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Plot & Land Size Filter (Marla / Kanal) */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Plot / Land Size (Marla & Kanal)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {PLOT_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  sizeRange: filters.sizeRange === opt.value ? undefined : opt.value === 'all' ? undefined : opt.value,
                })
              }
              className={`py-2 text-xs font-semibold transition truncate px-1 ${
                (filters.sizeRange || 'all') === opt.value
                  ? 'bg-[#0B1320] text-white font-bold'
                  : 'bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Commercial Property Size */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Commercial Size
        </label>
        <select
          value={filters.sizeRange || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sizeRange: e.target.value === 'all' ? undefined : e.target.value,
            })
          }
          className="w-full bg-[#F8FAFC] border border-slate-300 p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-black"
        >
          {COMMERCIAL_SIZE_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Metropolitan City
        </label>
        <select
          value={filters.city || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              city: e.target.value === 'all' ? undefined : e.target.value,
            })
          }
          className="w-full bg-[#F8FAFC] border border-slate-300 p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-black"
        >
          <option value="all">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms (For houses/apartments) */}
      <div>
        <label className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
          Bedrooms (Houses & Apartments)
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minBedrooms: filters.minBedrooms === num ? undefined : num,
                })
              }
              className={`py-2 text-xs font-semibold transition ${
                filters.minBedrooms === num
                  ? 'bg-[#0B1320] text-white font-bold'
                  : 'bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Trigger / Drawer Button */}
      <button
        onClick={() => setMobileDrawerOpen(true)}
        className="flex items-center gap-2 bg-[#0B1320] hover:bg-black text-white px-5 py-3 text-xs font-semibold shrink-0 transition cursor-pointer"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {/* Slideout Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <span className="font-bold text-slate-900 text-base">
                  Filter Society Inventory
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 bg-slate-100 text-slate-700 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full bg-[#0B1320] hover:bg-black text-white font-bold text-xs py-3.5 transition cursor-pointer"
              >
                Apply Filters & Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
