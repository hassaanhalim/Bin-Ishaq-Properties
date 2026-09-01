'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MasterPlanMap } from '@/types/map';
import { useStore } from '@/lib/store';
import {
  Map,
  PlusCircle,
  Trash2,
  Download,
  Eye,
  FileText,
  Upload,
  Search,
  ExternalLink,
  X,
  CheckCircle2,
  Compass,
  Building,
} from 'lucide-react';

const PRIME_SOCIETIES_LIST = [
  'Faisal Hills Islamabad',
  'MPCHS Multi Gardens B-17',
  'Faisal Town Islamabad',
  'Faisal Town Phase 2',
  'Bahria Town Islamabad / Rawalpindi',
  'Other Societies & Areas',
];

export default function AdminMapsPage() {
  const { showToast } = useStore();
  const [maps, setMaps] = useState<MasterPlanMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [society, setSociety] = useState('Faisal Hills Islamabad');
  const [sector, setSector] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [pdfUrl, setPdfUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMaps = async () => {
    try {
      const res = await fetch('/api/maps');
      const data = await res.json();
      if (data.data) setMaps(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaps();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'pdf') {
        setPdfUrl(result);
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setFileSize(`${sizeMb} MB`);
      } else {
        setThumbnailUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (!pdfUrl && !thumbnailUrl)) {
      showToast('Please fill out all required fields');
      return;
    }

    setSaving(true);

    try {
      const fallbackThumb = thumbnailUrl || '/maps/faisal-hills-cover.svg';

      const payload = {
        title,
        society,
        sector: sector || 'General Master Plan',
        thumbnailUrl: fallbackThumb,
        pdfUrl: pdfUrl || fallbackThumb,
        fileSize: fileSize || '2.4 MB',
      };

      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Society master plan map uploaded successfully!');
        setShowUploadModal(false);
        setTitle('');
        setSector('');
        setPdfUrl('');
        setThumbnailUrl('');
        fetchMaps();
      } else {
        showToast('Error uploading map');
      }
    } catch {
      showToast('Failed to save master plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this master plan map?')) return;
    try {
      const res = await fetch(`/api/maps/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Map deleted successfully');
        fetchMaps();
      }
    } catch {
      showToast('Error deleting map');
    }
  };

  const filtered = maps.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.society.toLowerCase().includes(q) ||
      (m.sector && m.sector.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header (Navy Blue / White / Slate) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Master Plan &amp; Demarcation Desk</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Society Maps &amp; PDF Plans ({maps.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/maps"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#141E30] px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 transition font-semibold"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </Link>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#0B1320]" />
            <span>Upload New Society Map</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search uploaded master plans by society, block or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1320] border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="bg-[#0B1320] border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold">Total Layout Downloads</span>
          <span className="text-white font-mono font-bold text-sm">
            {maps.reduce((acc, m) => acc + (m.downloadsCount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Maps Grid / List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs uppercase tracking-widest font-bold">
          Loading Maps Inventory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0B1320] border border-slate-800 rounded-2xl p-8 space-y-3">
          <Map className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No Maps Found</h3>
          <p className="text-xs text-slate-400">Upload high-resolution master plans to display them on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mapItem) => (
            <div
              key={mapItem.id}
              className="bg-[#0B1320] border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-slate-700 transition"
            >
              {/* Thumbnail with robust fallback & unoptimized */}
              <div className="relative aspect-[16/10] bg-[#070D18] overflow-hidden">
                <Image
                  src={mapItem.thumbnailUrl || '/maps/faisal-hills-cover.svg'}
                  alt={mapItem.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-transparent opacity-80" />

                {/* Blue / White Society Badge */}
                <div className="absolute top-3 left-3 bg-[#0B1320]/95 text-blue-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-blue-500/30 shadow-sm">
                  {mapItem.society}
                </div>

                {/* PDF Badge */}
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  PDF {mapItem.fileSize && `• ${mapItem.fileSize}`}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider truncate">
                    {mapItem.sector || 'Master Layout'}
                  </span>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                    {mapItem.title}
                  </h3>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={mapItem.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#141E30] hover:bg-[#1E2B45] text-slate-200 hover:text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition border border-slate-700 hover:border-slate-500"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Preview</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteMap(mapItem.id)}
                    className="p-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg transition cursor-pointer"
                    title="Delete Map"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Map Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1320] border border-slate-700 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Upload Society Master Plan (PDF)</h3>
                  <span className="text-xs text-slate-400">Add an approved high-definition layout map to the portal.</span>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMap} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Master Plan Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Faisal Hills Islamabad (2024) Approved Master Plan Layout"
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Housing Society *
                  </label>
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    {PRIME_SOCIETIES_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Sector / Block Scope
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="e.g. Executive Block & Blocks A-D"
                    className="w-full bg-[#141E30] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* PDF File Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  PDF Master Plan File *
                </label>
                <div className="border border-dashed border-slate-700 hover:border-blue-500 bg-[#141E30] rounded-xl p-4 text-center relative cursor-pointer transition">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <Upload className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-white">
                      {pdfUrl ? '✓ PDF File Selected' : 'Click to select high-definition PDF / Image map'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Map Thumbnail Preview Image (Optional)
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Paste preview image URL or leave blank to use blueprint graphic"
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 bg-[#141E30] text-slate-300 rounded-xl text-xs font-semibold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-white hover:bg-slate-200 text-[#0B1320] rounded-xl text-xs font-extrabold shadow-lg disabled:opacity-50 transition cursor-pointer"
                >
                  {saving ? 'Publishing Map...' : 'Publish Master Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
