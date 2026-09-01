'use client';

import React, { useState, useEffect } from 'react';
import { SiteContent, FilterOption, FooterLink, FooterTrustBadge } from '@/types/siteContent';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Home,
  Phone,
  Building,
  Award,
  FileText,
  ExternalLink,
  Search,
  LayoutTemplate,
  Plus,
  Trash2,
  Layers,
  MapPin,
  Tag,
  Bed,
} from 'lucide-react';

export default function SiteContentEditorPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'hero' | 'search' | 'footer' | 'contact' | 'offices' | 'why' | 'about'
  >('hero');

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/site-content');
        const data = await res.json();
        if (data.data) setContent(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setSaving(true);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed saving site content:', err);
    } finally {
      setSaving(false);
    }
  };

  // Helper methods for Search Filter options
  const addFilterOption = (
    key: 'locations' | 'propertyTypes' | 'priceRanges' | 'bedrooms',
    label = 'New Option',
    value = 'new_value'
  ) => {
    if (!content) return;
    const currentList = content.searchFilter?.[key] || [];
    setContent({
      ...content,
      searchFilter: {
        ...content.searchFilter,
        [key]: [...currentList, { label, value }],
      },
    });
  };

  const updateFilterOption = (
    key: 'locations' | 'propertyTypes' | 'priceRanges' | 'bedrooms',
    index: number,
    field: 'label' | 'value',
    val: string
  ) => {
    if (!content) return;
    const currentList = [...(content.searchFilter?.[key] || [])];
    currentList[index] = { ...currentList[index], [field]: val };
    setContent({
      ...content,
      searchFilter: {
        ...content.searchFilter,
        [key]: currentList,
      },
    });
  };

  const removeFilterOption = (
    key: 'locations' | 'propertyTypes' | 'priceRanges' | 'bedrooms',
    index: number
  ) => {
    if (!content) return;
    const currentList = (content.searchFilter?.[key] || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      searchFilter: {
        ...content.searchFilter,
        [key]: currentList,
      },
    });
  };

  // Helper methods for Footer Links
  const addFooterLink = (key: 'exploreLinks' | 'primeLocationLinks' | 'legalLinks') => {
    if (!content) return;
    const currentLinks = content.footer?.[key] || [];
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [key]: [...currentLinks, { label: 'New Link', href: '/properties' }],
      },
    });
  };

  const updateFooterLink = (
    key: 'exploreLinks' | 'primeLocationLinks' | 'legalLinks',
    index: number,
    field: 'label' | 'href',
    val: string
  ) => {
    if (!content) return;
    const currentLinks = [...(content.footer?.[key] || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: val };
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [key]: currentLinks,
      },
    });
  };

  const removeFooterLink = (
    key: 'exploreLinks' | 'primeLocationLinks' | 'legalLinks',
    index: number
  ) => {
    if (!content) return;
    const currentLinks = (content.footer?.[key] || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [key]: currentLinks,
      },
    });
  };

  // Helper methods for Offices
  const addOffice = () => {
    if (!content) return;
    const newOffice = {
      id: Date.now().toString(),
      city: 'New Regional Branch',
      address: 'Main Commercial Hub, Islamabad',
      phone: '+92 315 5735785',
      whatsapp: '923155735785',
      email: 'farhanullah3333@gmail.com',
    };
    setContent({
      ...content,
      offices: [...(content.offices || []), newOffice],
    });
  };

  const updateOffice = (index: number, field: string, val: string) => {
    if (!content) return;
    const updated = [...(content.offices || [])];
    updated[index] = { ...updated[index], [field]: val };
    setContent({
      ...content,
      offices: updated,
    });
  };

  const removeOffice = (index: number) => {
    if (!content) return;
    const updated = (content.offices || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      offices: updated,
    });
  };

  // Helper methods for Dealers / Leadership
  const addDealer = () => {
    if (!content) return;
    const newDealer = {
      id: Date.now().toString(),
      name: 'New Authorized Advisor',
      role: 'Property Consultant & Transfer Specialist',
      bio: 'Dedicated advisory for housing society investments, file procedures, and verified property demarcation.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+92 315 5735785',
      email: 'farhanullah3333@gmail.com',
    };
    const currentDealers = content.about?.dealers || [];
    setContent({
      ...content,
      about: {
        ...content.about,
        dealers: [...currentDealers, newDealer],
      },
    });
  };

  const updateDealer = (index: number, field: string, val: string) => {
    if (!content) return;
    const currentDealers = [...(content.about?.dealers || [])];
    currentDealers[index] = { ...currentDealers[index], [field]: val };
    setContent({
      ...content,
      about: {
        ...content.about,
        dealers: currentDealers,
      },
    });
  };

  const removeDealer = (index: number) => {
    if (!content) return;
    const currentDealers = (content.about?.dealers || []).filter((_, i) => i !== index);
    setContent({
      ...content,
      about: {
        ...content.about,
        dealers: currentDealers,
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Frontend Content Management
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Site Content &amp; Text Editor (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit search filter options, footer links, brand details, and marketing copy in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <span>Preview Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold">Content Updated Successfully!</h4>
            <p className="text-[11px] text-emerald-200">
              All public pages, search filters, and footer links have been updated live.
            </p>
          </div>
        </div>
      )}

      {/* Editor Navigation Tabs (Mobile horizontal scrollable pills) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Hero Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'search'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Filters</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Footer &amp; Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Hotlines &amp; Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offices')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'offices'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Offices &amp; Locations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('why')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'why'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Why Choose Us</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-white text-[#0B1320] shadow-md'
              : 'bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800 hover:bg-[#141E30]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>About Page</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= TAB 1: HERO ================= */}
        {activeTab === 'hero' && (
          <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Hero Section Headline &amp; Copy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Title Prefix</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Highlight Text</label>
                <input
                  type="text"
                  value={content.hero.highlightText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, highlightText: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Subtitle / Tagline</label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">CTA Button Text</label>
                <input
                  type="text"
                  value={content.hero.ctaText}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, ctaText: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Hero Background Image URL</label>
                <input
                  type="text"
                  value={content.hero.bgImageUrl}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, bgImageUrl: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SEARCH FILTERS ================= */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* 1. Location Options */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <h3 className="text-sm font-bold text-white">Location / Area Dropdown Options</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addFilterOption('locations', 'New Area, City', 'New Area')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Location</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.searchFilter?.locations || []).map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Display Label"
                        value={loc.label}
                        onChange={(e) => updateFilterOption('locations', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Search Query Value (e.g. DHA Phase 6 or 'all')"
                        value={loc.value}
                        onChange={(e) => updateFilterOption('locations', idx, 'value', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFilterOption('locations', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Property Type Options */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-300" />
                  <h3 className="text-sm font-bold text-white">Property Type Dropdown Options</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addFilterOption('propertyTypes', 'Luxury Estate', 'estate')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property Type</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.searchFilter?.propertyTypes || []).map((type, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Display Label"
                        value={type.label}
                        onChange={(e) => updateFilterOption('propertyTypes', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Type Code (villa, apartment, penthouse, plot, office...)"
                        value={type.value}
                        onChange={(e) => updateFilterOption('propertyTypes', idx, 'value', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFilterOption('propertyTypes', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Price Range Options */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-300" />
                  <h3 className="text-sm font-bold text-white">Price Range Brackets</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addFilterOption('priceRanges', '50 to 100 Crore', '500000000-1000000000')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Price Range</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.searchFilter?.priceRanges || []).map((range, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Display Label"
                        value={range.label}
                        onChange={(e) => updateFilterOption('priceRanges', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Range min-max in PKR (e.g. 50000000-150000000 or 'all')"
                        value={range.value}
                        onChange={(e) => updateFilterOption('priceRanges', idx, 'value', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFilterOption('priceRanges', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Bedroom Options */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-slate-300" />
                  <h3 className="text-sm font-bold text-white">Bedroom Filter Options</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addFilterOption('bedrooms', '7+ Bedrooms', '7')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bedroom Option</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.searchFilter?.bedrooms || []).map((bed, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Display Label"
                        value={bed.label}
                        onChange={(e) => updateFilterOption('bedrooms', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Bedroom count value (e.g. 5 or 'all')"
                        value={bed.value}
                        onChange={(e) => updateFilterOption('bedrooms', idx, 'value', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFilterOption('bedrooms', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FOOTER & LINKS ================= */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            {/* 1. Brand Description & Copyright */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Footer Brand Narrative & Copyright
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Footer Brand Summary Narrative</label>
                  <textarea
                    rows={3}
                    value={content.footer?.brandDescription || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, brandDescription: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Bottom Copyright Notice</label>
                  <input
                    type="text"
                    value={content.footer?.copyrightText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: { ...content.footer, copyrightText: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Trust Badges (3 items) */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Footer Trust Badges (3 Badges)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(content.footer?.trustBadges || []).map((badge, idx) => (
                  <div key={idx} className="bg-[#141E30] border border-slate-700 p-4 space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Badge #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Badge Title"
                      value={badge.title}
                      onChange={(e) => {
                        const updated = [...(content.footer?.trustBadges || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setContent({
                          ...content,
                          footer: { ...content.footer, trustBadges: updated },
                        });
                      }}
                      className="w-full bg-[#0B1320] border border-slate-700 p-2 text-xs text-white font-bold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Badge Subtitle / Description"
                      value={badge.description}
                      onChange={(e) => {
                        const updated = [...(content.footer?.trustBadges || [])];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setContent({
                          ...content,
                          footer: { ...content.footer, trustBadges: updated },
                        });
                      }}
                      className="w-full bg-[#0B1320] border border-slate-700 p-2 text-xs text-slate-300 font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Explore Portfolio Links */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">"Explore Portfolio" Navigation Links</h3>
                <button
                  type="button"
                  onClick={() => addFooterLink('exploreLinks')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.footer?.exploreLinks || []).map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Link Label"
                        value={link.label}
                        onChange={(e) => updateFooterLink('exploreLinks', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="URL path (e.g. /properties?purpose=buy)"
                        value={link.href}
                        onChange={(e) => updateFooterLink('exploreLinks', idx, 'href', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFooterLink('exploreLinks', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Prime Locations Links */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">"Prime Locations" Links</h3>
                <button
                  type="button"
                  onClick={() => addFooterLink('primeLocationLinks')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Location Link</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.footer?.primeLocationLinks || []).map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Location Label (e.g. DHA Phase 6)"
                        value={link.label}
                        onChange={(e) => updateFooterLink('primeLocationLinks', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="URL path (e.g. /properties?area=DHA+Phase+6)"
                        value={link.href}
                        onChange={(e) => updateFooterLink('primeLocationLinks', idx, 'href', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFooterLink('primeLocationLinks', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Legal Links */}
            <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Bottom Legal Links</h3>
                <button
                  type="button"
                  onClick={() => addFooterLink('legalLinks')}
                  className="flex items-center gap-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-xs font-bold text-white px-3 py-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Legal Link</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(content.footer?.legalLinks || []).map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#141E30] border border-slate-700 p-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Legal Link Title"
                        value={link.label}
                        onChange={(e) => updateFooterLink('legalLinks', idx, 'label', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-white font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Path (e.g. /about or /contact)"
                        value={link.href}
                        onChange={(e) => updateFooterLink('legalLinks', idx, 'href', e.target.value)}
                        className="bg-[#0B1320] border border-slate-700 px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFooterLink('legalLinks', idx)}
                      className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CONTACT ================= */}
        {activeTab === 'contact' && (
          <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-5">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Direct Desk Contact & Official Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={content.company.name}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, name: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Official Tagline</label>
                <input
                  type="text"
                  value={content.company.tagline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Primary Phone Hotline</label>
                <input
                  type="text"
                  value={content.company.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, phone: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">WhatsApp Desk Hotline</label>
                <input
                  type="text"
                  value={content.company.whatsapp}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Concierge Email</label>
                <input
                  type="email"
                  value={content.company.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, email: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Operating Hours</label>
                <input
                  type="text"
                  value={content.company.workingHours}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, workingHours: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Headquarters Physical Address</label>
                <input
                  type="text"
                  value={content.company.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      company: { ...content.company, address: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: OFFICES ================= */}
        {activeTab === 'offices' && (
          <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Regional Office Locations ({(content.offices || []).length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage physical branches, local hotlines, and desk contacts.
                </p>
              </div>
              <button
                type="button"
                onClick={addOffice}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#0B1320] font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Office</span>
              </button>
            </div>

            <div className="space-y-4">
              {(content.offices || []).map((office, idx) => (
                <div
                  key={office.id || idx}
                  className="bg-[#141E30] border border-slate-700 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <span className="text-xs font-extrabold text-white">
                      Office #{idx + 1}: {office.city || 'Untitled Branch'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOffice(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition px-2 py-1 bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Office</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">City / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Islamabad Head Office"
                        value={office.city}
                        onChange={(e) => updateOffice(idx, 'city', e.target.value)}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Phone</label>
                      <input
                        type="text"
                        placeholder="+92 315 5735785"
                        value={office.phone}
                        onChange={(e) => updateOffice(idx, 'phone', e.target.value)}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">WhatsApp / Direct</label>
                      <input
                        type="text"
                        placeholder="923155735785"
                        value={office.whatsapp || ''}
                        onChange={(e) => updateOffice(idx, 'whatsapp', e.target.value)}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">Physical Address</label>
                      <input
                        type="text"
                        placeholder="Plot #, Block, Society, City"
                        value={office.address}
                        onChange={(e) => updateOffice(idx, 'address', e.target.value)}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: WHY CHOOSE US ================= */}
        {activeTab === 'why' && (
          <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Why Discerning Clients Choose Us
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Section Eyebrow</label>
                <input
                  type="text"
                  value={content.whyChoose.eyebrow}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: { ...content.whyChoose, eyebrow: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Heading</label>
                <input
                  type="text"
                  value={content.whyChoose.heading}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: { ...content.whyChoose, heading: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={content.whyChoose.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChoose: { ...content.whyChoose, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase">Key Pillars (3 Features)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {content.whyChoose.points.map((pt, idx) => (
                    <div key={pt.id || idx} className="bg-[#141E30] border border-slate-700 rounded-xl p-3.5 space-y-2">
                      <input
                        type="text"
                        placeholder="Feature Title"
                        value={pt.title}
                        onChange={(e) => {
                          const updated = [...content.whyChoose.points];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setContent({
                            ...content,
                            whyChoose: { ...content.whyChoose, points: updated },
                          });
                        }}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Feature Description"
                        value={pt.description}
                        onChange={(e) => {
                          const updated = [...content.whyChoose.points];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setContent({
                            ...content,
                            whyChoose: { ...content.whyChoose, points: updated },
                          });
                        }}
                        className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-slate-300 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: ABOUT PAGE ================= */}
        {activeTab === 'about' && (
          <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-6 space-y-8">
            <div>
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                About Page Narrative &amp; Heritage Statistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Eyebrow</label>
                  <input
                    type="text"
                    value={content.about.eyebrow}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, eyebrow: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Main Heading</label>
                  <input
                    type="text"
                    value={content.about.heading}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, heading: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Story Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={content.about.storyP1}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, storyP1: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Story Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={content.about.storyP2}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, storyP2: e.target.value },
                      })
                    }
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 mt-4">
                <div className="bg-[#141E30] border border-slate-700 rounded-xl p-3.5 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300">Stat 1 Value</label>
                  <input
                    type="text"
                    value={content.about.stat1Value}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat1Value: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <label className="text-[11px] font-bold text-slate-300">Stat 1 Label</label>
                  <input
                    type="text"
                    value={content.about.stat1Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat1Label: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="bg-[#141E30] border border-slate-700 rounded-xl p-3.5 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300">Stat 2 Value</label>
                  <input
                    type="text"
                    value={content.about.stat2Value}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat2Value: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <label className="text-[11px] font-bold text-slate-300">Stat 2 Label</label>
                  <input
                    type="text"
                    value={content.about.stat2Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat2Label: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="bg-[#141E30] border border-slate-700 rounded-xl p-3.5 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300">Stat 3 Value</label>
                  <input
                    type="text"
                    value={content.about.stat3Value}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat3Value: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <label className="text-[11px] font-bold text-slate-300">Stat 3 Label</label>
                  <input
                    type="text"
                    value={content.about.stat3Label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, stat3Label: e.target.value },
                      })
                    }
                    className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Dealers / Leadership Team Management */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">
                    Authorized Dealers &amp; Leadership Team ({(content.about?.dealers || []).length})
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add, edit, or delete dealer cards that appear on the About page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addDealer}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#0B1320] font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Dealer</span>
                </button>
              </div>

              <div className="space-y-4">
                {(content.about?.dealers || []).map((dealer, idx) => (
                  <div
                    key={dealer.id || idx}
                    className="bg-[#141E30] border border-slate-700 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                      <span className="text-xs font-extrabold text-white">
                        Dealer #{idx + 1}: {dealer.name || 'Untitled Advisor'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDealer(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition px-2 py-1 bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Dealer</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Kamran Ishaq"
                          value={dealer.name}
                          onChange={(e) => updateDealer(idx, 'name', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Designation / Role</label>
                        <input
                          type="text"
                          placeholder="e.g. Managing Principal"
                          value={dealer.role}
                          onChange={(e) => updateDealer(idx, 'role', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Profile Image URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={dealer.image}
                          onChange={(e) => updateDealer(idx, 'image', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Direct Phone (Optional)</label>
                        <input
                          type="text"
                          placeholder="+92 315 5735785"
                          value={dealer.phone || ''}
                          onChange={(e) => updateDealer(idx, 'phone', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Email (Optional)</label>
                        <input
                          type="text"
                          placeholder="farhanullah3333@gmail.com"
                          value={dealer.email || ''}
                          onChange={(e) => updateDealer(idx, 'email', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Professional Bio</label>
                        <textarea
                          rows={2}
                          placeholder="Describe expertise, society authorizations, and advisory background..."
                          value={dealer.bio}
                          onChange={(e) => updateDealer(idx, 'bio', e.target.value)}
                          className="w-full bg-[#0B1320] border border-slate-700 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Bottom Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-sm px-8 py-3.5 rounded-xl transition cursor-pointer shadow-xl disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>

      {/* Floating Sticky Save Bar on Mobile */}
      <div className="md:hidden fixed bottom-16 inset-x-3 z-30 bg-[#0B1320]/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-between gap-3">
        <div className="overflow-hidden">
          <span className="text-[11px] font-extrabold text-white block truncate">
            Site Content CMS
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            Unsaved changes are preserved
          </span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="min-h-[44px] px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs flex items-center justify-center gap-2 shrink-0 shadow cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save All'}</span>
        </button>
      </div>
    </div>
  );
}
