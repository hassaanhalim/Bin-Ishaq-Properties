'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Home,
  KeyRound,
  Bed,
  Layers,
  Building,
  Check,
  Maximize2,
  ChevronRight,
  ChevronDown,
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
  { label: 'House / Luxury Villa', value: 'house' },
  { label: 'Modern Apartment', value: 'apartment' },
  { label: 'Commercial Plot', value: 'commercial' },
  { label: 'Retail Shop / Showroom', value: 'shop' },
  { label: 'Corporate Office', value: 'office' },
];

const BEDROOM_OPTIONS: DropdownOption[] = [
  { label: 'Any Bedrooms', value: 'all' },
  { label: '1 Bedroom', value: '1' },
  { label: '2 Bedrooms', value: '2' },
  { label: '3 Bedrooms', value: '3' },
  { label: '4 Bedrooms', value: '4' },
  { label: '5+ Bedrooms / Villa', value: '5' },
];

const PLOT_SIZE_OPTIONS: DropdownOption[] = [
  { label: 'Any Plot Size', value: 'all' },
  { label: '5 Marla (25x50 / 125 Sq Yds)', value: '5-marla' },
  { label: '7 Marla (30x60 / 175 Sq Yds)', value: '7-marla' },
  { label: '10 Marla (35x70 / 250 Sq Yds)', value: '10-marla' },
  { label: '1 Kanal (50x90 / 500 Sq Yds)', value: '1-kanal' },
  { label: '2 Kanal (75x120 / 1000 Sq Yds)', value: '2-kanal' },
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
  const [bedroomOptions, setBedroomOptions] = useState<DropdownOption[]>(BEDROOM_OPTIONS);

  const [activeTab, setActiveTab] = useState<PropertyPurpose>('buy');
  const [area, setArea] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [plotSize, setPlotSize] = useState('all');
  const [commercialSize, setCommercialSize] = useState('all');

  const [openDropdown, setOpenDropdown] = useState<'area' | 'type' | 'size' | null>(null);

  // Determine contextual filter mode
  const isPlotMode = propertyType === 'plot' || propertyType === 'file';
  const isCommercialMode = propertyType === 'commercial' || propertyType === 'office' || propertyType === 'shop';

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

    query.set('purpose', activeTab);

    if (propertyType !== 'all') {
      query.set('category', propertyType);
    }

    if (area !== 'all') {
      query.set('society', area);
    }

    // Contextual size / bedroom filter
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

  const selectedSizeLabel = isPlotMode
    ? PLOT_SIZE_OPTIONS.find((o) => o.value === plotSize)?.label || 'Any Plot Size'
    : isCommercialMode
    ? COMMERCIAL_SIZE_OPTIONS.find((o) => o.value === commercialSize)?.label || 'Any Commercial Size'
    : bedroomOptions.find((o) => o.value === bedrooms)?.label || 'Any Bedrooms / Size';

  return (
    <div
      ref={searchRef}
      className="w-full max-w-xl lg:max-w-5xl mx-auto bg-[#071322]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3.5 font-sans"
    >
      {/* 1. Top Tabs: Buy Property & Rent Property */}
      <div className="flex items-center gap-2 pb-1 max-w-xs sm:max-w-sm">
        {/* Buy Tab */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('buy');
            setOpenDropdown(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeTab === 'buy'
              ? 'bg-white/10 border border-white/30 text-white shadow-inner'
              : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Home className="w-4 h-4 text-white" />
          <span>Buy Property</span>
        </button>

        {/* Rent Tab */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('rent');
            setOpenDropdown(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
            activeTab === 'rent'
              ? 'bg-white/10 border border-white/30 text-white shadow-inner'
              : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <KeyRound className="w-4 h-4 text-slate-300" />
          <span>Rent Property</span>
        </button>
      </div>

      {/* 2. Main Search Console Stack (Vertical on Mobile, Horizontal Row on Laptop/Desktop) */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-4 gap-2.5 sm:gap-3 items-stretch">
        {/* Field 1: Location / Area */}
        <div className="relative">
          <div
            onClick={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
            className={`h-full min-h-[58px] bg-[#0B1A2E]/90 border rounded-xl p-3.5 flex items-center justify-between transition cursor-pointer select-none ${
              openDropdown === 'area' ? 'border-white ring-1 ring-white/50' : 'border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-300 block">
                  Location / Area
                </span>
                <span className="text-xs sm:text-sm text-white font-bold truncate block">
                  {selectedAreaLabel}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${openDropdown === 'area' ? 'rotate-90 text-white' : ''}`} />
          </div>

          {/* Location Dropdown Menu */}
          {openDropdown === 'area' && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-[#071322] border border-white/15 rounded-xl shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto">
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
                      ? 'bg-white text-slate-950 font-extrabold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {area === opt.value && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 2: Property Type / Categories */}
        <div className="relative">
          <div
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className={`h-full min-h-[58px] bg-[#0B1A2E]/90 border rounded-xl p-3.5 flex items-center justify-between transition cursor-pointer select-none ${
              openDropdown === 'type' ? 'border-white ring-1 ring-white/50' : 'border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-300 block">
                  Property Type
                </span>
                <span className="text-xs sm:text-sm text-white font-bold truncate block">
                  {selectedTypeLabel}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${openDropdown === 'type' ? 'rotate-90 text-white' : ''}`} />
          </div>

          {/* Property Type Dropdown Menu */}
          {openDropdown === 'type' && (
            <div className="absolute left-0 top-full mt-1.5 w-full bg-[#071322] border border-white/15 rounded-xl shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto">
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
                      ? 'bg-white text-slate-950 font-extrabold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {propertyType === opt.value && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 3: Bedrooms / Plot Size (Replacing Price Range) */}
        <div className="relative">
          <div
            onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
            className={`h-full min-h-[58px] bg-[#0B1A2E]/90 border rounded-xl p-3.5 flex items-center justify-between transition cursor-pointer select-none ${
              openDropdown === 'size' ? 'border-white ring-1 ring-white/50' : 'border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                {isPlotMode ? (
                  <Maximize2 className="w-4 h-4" />
                ) : isCommercialMode ? (
                  <Building className="w-4 h-4" />
                ) : (
                  <Bed className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-300 block">
                  {isPlotMode ? 'Plot Size' : isCommercialMode ? 'Commercial Area' : 'Bedrooms / Size'}
                </span>
                <span className="text-xs sm:text-sm text-white font-bold truncate block">
                  {selectedSizeLabel}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${openDropdown === 'size' ? 'rotate-90 text-white' : ''}`} />
          </div>

          {/* Size / Bedroom Dropdown Menu */}
          {openDropdown === 'size' && (
            <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-1.5 w-full sm:w-72 bg-[#071322] border border-white/15 rounded-xl shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto">
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
                        ? 'bg-white text-slate-950 font-extrabold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {plotSize === opt.value && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
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
                        ? 'bg-white text-slate-950 font-extrabold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {commercialSize === opt.value && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
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
                        ? 'bg-white text-slate-950 font-extrabold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {bedrooms === opt.value && <Check className="w-4 h-4 text-slate-950 shrink-0 ml-2" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. Action Button: Search Properties (Full Height in Row on Laptop) */}
        <div className="flex items-stretch">
          <button
            type="submit"
            className="w-full h-full min-h-[58px] bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 transition shadow-lg cursor-pointer active:scale-[0.99]"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
}
