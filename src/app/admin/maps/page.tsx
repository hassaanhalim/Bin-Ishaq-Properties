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
    return (
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.society.toLowerCase().includes(search.toLowerCase()) ||
      (m.sector ? m.sector.toLowerCase().includes(search.toLowerCase()) : false)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Society Master Plans &amp; Layouts
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Official Society Maps Management ({maps.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2.5 rounded-xl transition shadow cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Master Plan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Filter maps by society, sector, title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-h-[44px] bg-[#0B1320] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
        />
      </div>

      {/* Maps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#0B1320] border border-slate-800 rounded-3xl p-6 text-slate-400 text-xs">
            No society maps found matching search query.
          </div>
        ) : (
          filtered.map((mapItem) => (
            <div
              key={mapItem.id}
              className="bg-[#0B1320] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <Image
                    src={mapItem.thumbnailUrl || '/maps/faisal-hills-cover.svg'}
                    alt={mapItem.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#0B1320]/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-white/20">
                    {mapItem.society}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                    {mapItem.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{mapItem.sector}</span>
                    <span className="font-mono text-[11px]">{mapItem.fileSize || '2.4 MB'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <a
                  href={mapItem.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[44px] bg-[#141E30] hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border border-slate-700 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDeleteMap(mapItem.id)}
                  className="min-w-[44px] min-h-[44px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl flex items-center justify-center transition cursor-pointer"
                  aria-label="Delete map"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Master Plan Slide-up Bottom Sheet / Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B1320] border border-slate-700 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Upload Society Master Plan
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-[#141E30] text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMap} className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Map Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Hills Executive Block Master Plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Housing Society *
                  </label>
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white"
                  >
                    {PRIME_SOCIETIES_LIST.map((soc) => (
                      <option key={soc} value={soc}>
                        {soc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Block / Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block A, B, Executive"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Upload Map Image or PDF File
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'pdf')}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-[#0B1320] file:cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || !title}
                  className="w-full min-h-[48px] bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs uppercase tracking-wider py-3 rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{saving ? 'Publishing Plan...' : 'Save & Publish Master Plan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
