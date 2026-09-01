'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MasterPlanMap } from '@/types/map';
import {
  Map,
  Download,
  Eye,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  X,
  Building,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  ArrowRight,
} from 'lucide-react';

const SOCIETY_TABS = [
  { label: 'All Master Plans', value: 'all' },
  { label: 'MPCHS B-17', value: 'MPCHS' },
  { label: 'Faisal Town', value: 'Faisal Town' },
  { label: 'Faisal Hills', value: 'Faisal Hills' },
  { label: 'Bahria Town', value: 'Bahria' },
  { label: 'Other Societies', value: 'Other' },
];

export default function MapsPage() {
  const [maps, setMaps] = useState<MasterPlanMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSociety, setActiveSociety] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMap, setPreviewMap] = useState<MasterPlanMap | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const fetchMaps = async () => {
    try {
      const url =
        activeSociety === 'all'
          ? '/api/maps'
          : `/api/maps?society=${encodeURIComponent(activeSociety)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.data) {
        setMaps(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, [activeSociety]);

  const filteredMaps = maps.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.society.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.sector && m.sector.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDownload = (mapItem: MasterPlanMap) => {
    const a = document.createElement('a');
    a.href = mapItem.pdfUrl;
    a.download = `${mapItem.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-16">
      {/* 1. Header Banner */}
      <section className="architectural-grid bg-[#0B1320] border-b border-slate-800 text-white py-10 sm:py-14 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1320] via-[#141E30] to-[#0B1320] opacity-80" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-widest rounded-full">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Authorized Society Layouts</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] text-white">
            Society Maps &amp; Master Plans
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Download high-definition approved master plans, sector demarcations, and avenue layouts for
            Islamabad &amp; Rawalpindi premier housing societies in verified PDF format.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sector, block, or society map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141E30] border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Society Filter Tabs */}
      <section className="sticky top-16 z-30 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SOCIETY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveSociety(tab.value)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shrink-0 cursor-pointer ${
                activeSociety === tab.value
                  ? 'bg-[#0B1320] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Maps Grid (Compact 2-col on mobile: 4 maps fit in phone viewport) */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-8 py-6 sm:py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">
              Loading Verified Master Plans...
            </span>
          </div>
        ) : filteredMaps.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">No Master Plans Found</h3>
            <p className="text-xs text-slate-500">
              No society maps match your filter. You can request a specific sector map from our desk.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0B1320] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-black transition mt-2"
            >
              <span>Contact Advisory Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {filteredMaps.map((mapItem) => (
              <div
                key={mapItem.id}
                className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Thumbnail Preview (Compact aspect ratio) */}
                <div
                  onClick={() => {
                    setPreviewMap(mapItem);
                    setZoomLevel(1);
                  }}
                  className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={mapItem.thumbnailUrl || '/maps/faisal-hills-cover.svg'}
                    alt={mapItem.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320]/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Society Badge */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-[#0B1320]/95 text-blue-300 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/30 truncate max-w-[85%]">
                    {mapItem.society.split(' ')[0]}
                  </div>

                  {/* PDF Badge */}
                  <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-blue-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                    PDF
                  </div>

                  {/* Quick Click Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="bg-white text-black text-[10px] sm:text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </span>
                  </div>
                </div>

                {/* Body Details (Compact for mobile viewport) */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                      {mapItem.sector || mapItem.society}
                    </span>
                    <h3
                      onClick={() => {
                        setPreviewMap(mapItem);
                        setZoomLevel(1);
                      }}
                      className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-black cursor-pointer leading-snug"
                    >
                      {mapItem.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewMap(mapItem);
                        setZoomLevel(1);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] sm:text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3 h-3 shrink-0" />
                      <span className="hidden xs:inline">View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(mapItem)}
                      className="flex-1 bg-[#0B1320] hover:bg-black text-white font-bold text-[10px] sm:text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3 shrink-0" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Full-Screen Interactive Map / PDF Preview Modal */}
      {previewMap && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-fade-in">
          {/* Modal Header */}
          <div className="bg-[#0B1320] border border-slate-800 text-white p-3.5 sm:p-4 rounded-t-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider truncate">
                  {previewMap.society} • {previewMap.sector || 'Master Layout'}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  {previewMap.title}
                </h3>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.2))}
                className="p-2 bg-[#141E30] hover:bg-[#1E2B45] text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.2))}
                className="p-2 bg-[#141E30] hover:bg-[#1E2B45] text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDownload(previewMap)}
                className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-200 text-[#0B1320] text-xs font-bold px-3.5 py-2 rounded-lg transition shadow"
              >
                <Download className="w-3.5 h-3.5 text-[#0B1320]" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMap(null)}
                className="p-2 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 rounded-lg transition cursor-pointer"
                title="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Main Viewport with Zoom / PDF embed */}
          <div className="flex-1 bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl overflow-auto p-2 sm:p-4 flex items-center justify-center relative">
            {previewMap.pdfUrl.toLowerCase().includes('.pdf') ? (
              <iframe
                src={`${previewMap.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full min-h-[500px] sm:min-h-[650px] rounded-lg border-0 bg-white"
                title={previewMap.title}
              />
            ) : (
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 relative max-w-full max-h-full"
              >
                <Image
                  src={previewMap.pdfUrl}
                  alt={previewMap.title}
                  width={1600}
                  height={1100}
                  className="rounded-lg shadow-2xl object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Mobile Bottom Download Button */}
          <div className="sm:hidden pt-2">
            <button
              type="button"
              onClick={() => handleDownload(previewMap)}
              className="w-full bg-white text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Resolution Map PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
