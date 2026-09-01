'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Home,
  Tag,
  Bed,
  Layers,
  ChevronDown,
  Building,
  Check,
  Maximize2,
} from 'lucide-react';
import { PropertyPurpose } from '@/types/property';

interface DropdownOption {
  label: string;
  value: string;
}

const LOCATION_OPTIONS: DropdownOption[] = [
  { label: 'All Societies / Locations', value: 'all' },
  { label: 'MPCHS Multi Gardens B-17', value: 'MPCHS' },
  { label: 'Faisal Town Islamabad', value: 'Faisal Town' },
  { label: 'Faisal Town Phase 2', value: 'Faisal Town Phase 2' },
  { label: 'Faisal Hills Islamabad', value: 'Faisal Hills' },
  { label: 'Bahria Town (ISB/RWP)', value: 'Bahria Town' },
  { label: 'Other Societies & Areas', value: 'Other' },
];

const PROPERTY_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'All Property Categories', value: 'all' },
  { label: 'Residential Plot', value: 'plot' },
  { label: 'Plot File / Booking', value: 'file' },
  { label: 'House / Villa', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Commercial Plot', value: 'commercial' },
  { label: 'Retail Shop', value: 'shop' },
  { label: 'Corporate Office', value: 'office' },
];

const PRICE_RANGE_OPTIONS: DropdownOption[] = [
  { label: 'Any Budget Range', value: 'all' },
  { label: 'Under 50 Lakh', value: '0-5000000' },
  { label: '50 Lakh to 1.5 Crore', value: '5000000-15000000' },
  { label: '1.5 to 5 Crore', value: '15000000-50000000' },
  { label: '5 Crore & Above', value: '50000000-500000000' },
];

const BEDROOM_OPTIONS: DropdownOption[] = [
  { label: 'Any Bedrooms', value: 'all' },
  { label: '2+ Bedrooms', value: '2' },
  { label: '3+ Bedrooms', value: '3' },
  { label: '4+ Bedrooms', value: '4' },
  { label: '5+ Bedrooms', value: '5' },
];

const PLOT_SIZE_OPTIONS: DropdownOption[] = [
  { label: 'Any Plot Size', value: 'all' },
  { label: '5 Marla (125 Sq Yds)', value: '5-marla' },
  { label: '7 Marla (175 Sq Yds)', value: '7-marla' },
  { label: '10 Marla (250 Sq Yds)', value: '10-marla' },
  { label: '1 Kanal (500 Sq Yds)', value: '1-kanal' },
  { label: '2 Kanal (1000 Sq Yds)', value: '2-kanal' },
  { label: '4+ Kanal / Farmhouse', value: '4-kanal' },
];

const COMMERCIAL_SIZE_OPTIONS: DropdownOption[] = [
  { label: 'Any Commercial Size', value: 'all' },
  { label: '2 to 4 Marla (Shop / Booth)', value: '2-4-marla' },
  { label: '4 to 8 Marla (Plaza Plot)', value: '4-8-marla' },
  { label: '10 to 16 Marla (Commercial Avenue)', value: '10-16-marla' },
  { label: '1 Kanal+ (Corporate Plaza Plot)', value: '1-kanal-plus' },
  { label: '500 to 2000 Sq Ft (Retail / Office)', value: '500-2000-sqft' },
];

export default function HeroSearch() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const [locationOptions, setLocationOptions] = useState<DropdownOption[]>(LOCATION_OPTIONS);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<DropdownOption[]>(PROPERTY_TYPE_OPTIONS);
  const [priceRangeOptions, setPriceRangeOptions] = useState<DropdownOption[]>(PRICE_RANGE_OPTIONS);
  const [bedroomOptions, setBedroomOptions] = useState<DropdownOption[]>(BEDROOM_OPTIONS);

  const [activeTab, setActiveTab] = useState<PropertyPurpose | 'commercial' | 'plot'>('buy');
  const [area, setArea] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [plotSize, setPlotSize] = useState('all');
  const [commercialSize, setCommercialSize] = useState('all');

  const [openDropdown, setOpenDropdown] = useState<'area' | 'type' | 'price' | 'fourth' | null>(null);

  // Determine current search mode for 4th filter
  const isPlotMode = activeTab === 'plot' || propertyType === 'plot' || propertyType === 'file';
  const isCommercialMode = activeTab === 'commercial' || propertyType === 'commercial' || propertyType === 'office' || propertyType === 'shop';

  // Fetch dynamic CMS options
  useEffect(() => {
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data?.searchFilter) {
          if (d.data.searchFilter.locations?.length > 0) {
            setLocationOptions(d.data.searchFilter.locations);
          }
          if (d.data.searchFilter.propertyTypes?.length > 0) {
            setPropertyTypeOptions(d.data.searchFilter.propertyTypes);
          }
          if (d.data.searchFilter.priceRanges?.length > 0) {
            setPriceRangeOptions(d.data.searchFilter.priceRanges);
          }
          if (d.data.searchFilter.bedrooms?.length > 0) {
            setBedroomOptions(d.data.searchFilter.bedrooms);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenDropdown(null);
    const query = new URLSearchParams();

    if (activeTab === 'commercial') {
      query.set('category', 'commercial');
    } else if (activeTab === 'plot') {
      query.set('category', 'plot');
    } else {
      query.set('purpose', activeTab);
      if (propertyType !== 'all') {
        query.set('category', propertyType);
      }
    }

    if (area !== 'all') {
      query.set('society', area);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      if (min) query.set('minPrice', min);
      if (max) query.set('maxPrice', max);
    }

    // Dynamic 4th filter parameters
    if (isPlotMode) {
      if (plotSize !== 'all') {
        query.set('sizeRange', plotSize);
      }
    } else if (isCommercialMode) {
      if (commercialSize !== 'all') {
        query.set('sizeRange', commercialSize);
      }
    } else {
      if (bedrooms !== 'all') {
        query.set('minBedrooms', bedrooms);
      }
    }

    router.push(`/properties?${query.toString()}`);
  };

  const selectedAreaLabel =
    locationOptions.find((o) => o.value === area)?.label || locationOptions[0]?.label || 'All Societies / Locations';
  const selectedTypeLabel =
    propertyTypeOptions.find((o) => o.value === propertyType)?.label || propertyTypeOptions[0]?.label || 'All Property Categories';
  const selectedPriceLabel =
    priceRangeOptions.find((o) => o.value === priceRange)?.label || priceRangeOptions[0]?.label || 'Any Budget Range';

  const selectedFourthLabel = isPlotMode
    ? PLOT_SIZE_OPTIONS.find((o) => o.value === plotSize)?.label || 'Any Plot Size'
    : isCommercialMode
    ? COMMERCIAL_SIZE_OPTIONS.find((o) => o.value === commercialSize)?.label || 'Any Commercial Size'
    : bedroomOptions.find((o) => o.value === bedrooms)?.label || 'Any Bedrooms';

  return (
    <div ref={searchRef} className="w-full max-w-5xl mx-auto bg-[#0B1320] border border-slate-700 shadow-2xl p-4 sm:p-6 transition-all duration-300 font-sans">
      {/* 1. Sharp Luxury Purpose Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          type="button"
          onClick={() => {
            setActiveTab('buy');
            setOpenDropdown(null);
            if (propertyType === 'plot' || propertyType === 'commercial') setPropertyType('all');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shrink-0 cursor-pointer ${
            activeTab === 'buy'
              ? 'bg-white text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Buy Property</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('rent');
            setOpenDropdown(null);
            if (propertyType === 'plot') setPropertyType('all');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shrink-0 cursor-pointer ${
            activeTab === 'rent'
              ? 'bg-white text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Rent Property</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('plot');
            setOpenDropdown(null);
            setPropertyType('plot');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shrink-0 cursor-pointer ${
            activeTab === 'plot'
              ? 'bg-white text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Plots & Land</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('commercial');
            setOpenDropdown(null);
            setPropertyType('commercial');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shrink-0 cursor-pointer ${
            activeTab === 'commercial'
              ? 'bg-white text-black shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Commercial</span>
        </button>
      </div>

      {/* 2. Main Search Console Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Field 1: Custom Location Dropdown */}
        <div className={`relative ${openDropdown === 'area' ? 'z-50' : 'z-10'}`}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
            className={`bg-[#141E30] border p-3.5 flex flex-col justify-center transition cursor-pointer select-none ${
              openDropdown === 'area' ? 'border-white ring-1 ring-white' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5 mb-1 cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Location / Area</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-bold truncate pr-2">
                {selectedAreaLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${openDropdown === 'area' ? 'rotate-180 text-white' : ''}`} />
            </div>
          </div>

          {/* Expanded Menu */}
          {openDropdown === 'area' && (
            <div className="absolute left-0 top-full mt-1.5 w-full sm:w-64 bg-[#0B1320] border border-slate-700 shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto ring-1 ring-black/50">
              {locationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setArea(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                    area === opt.value
                      ? 'bg-white text-black font-extrabold'
                      : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {area === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 2: Custom Property Type Dropdown */}
        <div className={`relative ${openDropdown === 'type' ? 'z-50' : 'z-10'}`}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className={`bg-[#141E30] border p-3.5 flex flex-col justify-center transition cursor-pointer select-none ${
              openDropdown === 'type' ? 'border-white ring-1 ring-white' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5 mb-1 cursor-pointer">
              <Home className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Property Type</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-bold truncate pr-2">
                {selectedTypeLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${openDropdown === 'type' ? 'rotate-180 text-white' : ''}`} />
            </div>
          </div>

          {/* Expanded Menu */}
          {openDropdown === 'type' && (
            <div className="absolute left-0 top-full mt-1.5 w-full sm:w-64 bg-[#0B1320] border border-slate-700 shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto ring-1 ring-black/50">
              {propertyTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPropertyType(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                    propertyType === opt.value
                      ? 'bg-white text-black font-extrabold'
                      : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {propertyType === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 3: Custom Price Range Dropdown */}
        <div className={`relative ${openDropdown === 'price' ? 'z-50' : 'z-10'}`}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            className={`bg-[#141E30] border p-3.5 flex flex-col justify-center transition cursor-pointer select-none ${
              openDropdown === 'price' ? 'border-white ring-1 ring-white' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5 mb-1 cursor-pointer">
              <Tag className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Price Range</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-bold truncate pr-2">
                {selectedPriceLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${openDropdown === 'price' ? 'rotate-180 text-white' : ''}`} />
            </div>
          </div>

          {/* Expanded Menu */}
          {openDropdown === 'price' && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-1.5 w-full sm:w-64 bg-[#0B1320] border border-slate-700 shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto ring-1 ring-black/50">
              {priceRangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPriceRange(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                    priceRange === opt.value
                      ? 'bg-white text-black font-extrabold'
                      : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {priceRange === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 4: DYNAMIC CONTEXTUAL FILTER (Plot Size vs Commercial Size vs Bedrooms) */}
        <div className={`relative ${openDropdown === 'fourth' ? 'z-50' : 'z-10'}`}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'fourth' ? null : 'fourth')}
            className={`bg-[#141E30] border p-3.5 flex flex-col justify-center transition cursor-pointer select-none ${
              openDropdown === 'fourth' ? 'border-white ring-1 ring-white' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5 mb-1 cursor-pointer">
              {isPlotMode ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Plot Size</span>
                </>
              ) : isCommercialMode ? (
                <>
                  <Building className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Commercial Size</span>
                </>
              ) : (
                <>
                  <Bed className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Bedrooms</span>
                </>
              )}
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-bold truncate pr-2">
                {selectedFourthLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 shrink-0 ${openDropdown === 'fourth' ? 'rotate-180 text-white' : ''}`} />
            </div>
          </div>

          {/* Expanded Menu for 4th Dropdown */}
          {openDropdown === 'fourth' && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-1.5 w-full sm:w-64 bg-[#0B1320] border border-slate-700 shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto ring-1 ring-black/50">
              {isPlotMode ? (
                PLOT_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPlotSize(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                      plotSize === opt.value
                        ? 'bg-white text-black font-extrabold'
                        : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {plotSize === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                  </button>
                ))
              ) : isCommercialMode ? (
                COMMERCIAL_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCommercialSize(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                      commercialSize === opt.value
                        ? 'bg-white text-black font-extrabold'
                        : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {commercialSize === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                  </button>
                ))
              ) : (
                bedroomOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setBedrooms(opt.value);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition cursor-pointer ${
                      bedrooms === opt.value
                        ? 'bg-white text-black font-extrabold'
                        : 'text-slate-200 hover:bg-[#141E30] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {bedrooms === opt.value && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Button: Search */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-white hover:bg-slate-200 text-black font-extrabold text-sm py-4 px-6 flex items-center justify-center gap-2 transition shadow-lg cursor-pointer h-[66px]"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
