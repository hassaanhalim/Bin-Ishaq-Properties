'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/types/property';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  Search,
  Star,
  Trash2,
  ExternalLink,
  PlusCircle,
  Eye,
  CheckCircle,
  Tag,
  Building,
  MapPin,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const { showToast } = useStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.data) setProperties(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_featured' }),
      });
      if (res.ok) {
        showToast('Updated featured status');
        fetchProperties();
      }
    } catch {
      showToast('Error updating status');
    }
  };

  const handleUpdateStatus = async (id: string, status: PropertyStatus) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status }),
      });
      if (res.ok) {
        showToast(
          status === 'sold'
            ? 'Property marked as SOLD with banner!'
            : status === 'rented'
            ? 'Property marked as RENTED with banner!'
            : `Property status set to ${status}`
        );
        fetchProperties();
      }
    } catch {
      showToast('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Property deleted successfully');
        fetchProperties();
      }
    } catch {
      showToast('Error deleting property');
    }
  };

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.area.toLowerCase().includes(search.toLowerCase()) ||
      p.location.city.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Portfolio Management
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            All Property Listings ({properties.length})
          </h1>
        </div>

        <Link
          href="/submit-property?source=admin"
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2.5 rounded-xl transition shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, area, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] bg-[#0B1320] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white transition"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full min-h-[44px] bg-[#0B1320] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white transition"
          >
            <option value="all">All Statuses ({properties.length})</option>
            <option value="published">Published Live</option>
            <option value="sold">Marked as SOLD</option>
            <option value="rented">Marked as RENTED</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* MOBILE PRESENTATION (< 768px): Touch-Friendly Stacked Cards */}
      <div className="md:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#0B1320] border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No properties found matching current criteria.
          </div>
        ) : (
          filtered.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#0B1320] border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-3.5 p-4"
            >
              {/* Card Header: Image + Basic Info */}
              <div className="flex gap-3.5 items-start">
                <div className="relative w-24 h-20 overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                  <Image
                    src={prop.featuredImage || prop.images[0]}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                  {prop.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <span className="text-[10px] font-black text-white tracking-wider">SOLD</span>
                    </div>
                  )}
                  {prop.status === 'rented' && (
                    <div className="absolute inset-0 bg-[#0B1320]/90 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white tracking-wider">RENTED</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 truncate">
                      {prop.propertyType || prop.category} • {prop.purpose === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      ID: {prop.id.slice(-6)}
                    </span>
                  </div>

                  <Link
                    href={`/properties/${prop.id}`}
                    className="font-bold text-sm text-white hover:text-slate-300 block truncate mt-0.5"
                  >
                    {prop.title}
                  </Link>

                  <p className="text-xs font-black text-white mt-1">
                    {prop.priceDisplay || (prop.price ? formatPrice(prop.price, 'PKR', prop.purpose === 'rent') : 'Call for Rate')}
                  </p>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {prop.society || prop.location.society || prop.location.area}, {prop.city || prop.location.city}
                    </span>
                  </span>
                </div>
              </div>

              {/* Status Update Dropdown (Full width for easy tapping) */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                  Listing Status / Sold Banner
                </label>
                <select
                  value={prop.status}
                  onChange={(e) => handleUpdateStatus(prop.id, e.target.value as PropertyStatus)}
                  className={`w-full min-h-[44px] rounded-xl px-3 py-2 text-xs font-bold border cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white ${
                    prop.status === 'published'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80'
                      : prop.status === 'sold'
                      ? 'bg-black text-white border-white/40'
                      : prop.status === 'rented'
                      ? 'bg-[#141E30] text-blue-300 border-blue-600/80'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  <option value="published">Published Live</option>
                  <option value="sold">Mark as SOLD (Banner)</option>
                  <option value="rented">Mark as RENTED (Banner)</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                {/* Featured Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(prop.id)}
                  className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    prop.isFeatured
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#141E30] text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-current' : ''}`} />
                  <span>{prop.isFeatured ? 'Featured' : 'Feature'}</span>
                </button>

                {/* View on Live Site */}
                <Link
                  href={`/properties/${prop.id}`}
                  target="_blank"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[#141E30] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition"
                  aria-label="View on live website"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(prop.id)}
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center transition cursor-pointer"
                  aria-label="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP PRESENTATION (>= 768px): Wide Table */}
      <div className="hidden md:block bg-[#0B1320] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141E30] border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status &amp; Sold Banner</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4">Views</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-white/5 transition">
                  {/* Property Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-12 overflow-hidden rounded-lg shrink-0 bg-slate-800 border border-slate-700">
                        <Image
                          src={prop.featuredImage || prop.images[0]}
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                        {prop.status === 'sold' && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <span className="text-[9px] font-black text-white tracking-wider">SOLD</span>
                          </div>
                        )}
                        {prop.status === 'rented' && (
                          <div className="absolute inset-0 bg-[#0B1320]/85 flex items-center justify-center">
                            <span className="text-[8px] font-black text-white tracking-wider">RENTED</span>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden max-w-xs">
                        <Link
                          href={`/properties/${prop.id}`}
                          className="font-bold text-white hover:text-slate-300 block truncate"
                        >
                          {prop.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {prop.society || prop.location.society || prop.location.area}, {prop.city || prop.location.city}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {prop.developer || 'Authorized Dealer'} • ID: {prop.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4">
                    <span className="capitalize font-semibold text-white block">
                      {prop.propertyType || prop.category || (prop as any).type}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-4">
                    <span className="font-bold text-white block">
                      {prop.priceDisplay || (prop.price ? formatPrice(prop.price, 'PKR', prop.purpose === 'rent') : 'Call for Rate')}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={prop.status}
                      onChange={(e) => handleUpdateStatus(prop.id, e.target.value as PropertyStatus)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white ${
                        prop.status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : prop.status === 'sold'
                          ? 'bg-black text-white border-white/50'
                          : prop.status === 'rented'
                          ? 'bg-[#141E30] text-blue-300 border-blue-600'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="sold">Mark as SOLD</option>
                      <option value="rented">Mark as RENTED</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Featured */}
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(prop.id)}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        prop.isFeatured
                          ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={prop.isFeatured ? 'Featured on home' : 'Make featured'}
                    >
                      <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  {/* Views */}
                  <td className="p-4">
                    <span className="text-slate-400 font-mono">
                      {prop.viewsCount || 0}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-white bg-[#141E30] rounded-lg border border-slate-700 transition"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg border border-rose-500/30 transition cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
