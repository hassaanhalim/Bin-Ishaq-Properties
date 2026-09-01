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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Portfolio Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            All Property Listings ({properties.length})
          </h1>
        </div>

        <Link
          href="/submit-property?source=admin"
          className="flex items-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs px-5 py-2.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, area, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1320] border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0B1320] border border-slate-700 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Live</option>
            <option value="sold">Marked as SOLD</option>
            <option value="rented">Marked as RENTED</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Property Inventory Table */}
      <div className="bg-[#0B1320] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141E30] border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status & Sold Banner</th>
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
                      <div className="relative w-14 h-12 overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
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
                    <span className={`font-bold text-sm block ${prop.status === 'sold' ? 'line-through text-slate-400' : 'text-white'}`}>
                      {prop.priceDisplay || (prop.price ? formatPrice(prop.price, 'PKR', prop.purpose === 'rent') : 'Call for Rate')}
                    </span>
                    {prop.status === 'sold' && (
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Closed Deal</span>
                    )}
                  </td>

                  {/* Status Dropdown with SOLD / RENTED options */}
                  <td className="p-4">
                    <select
                      value={prop.status}
                      onChange={(e) => handleUpdateStatus(prop.id, e.target.value as PropertyStatus)}
                      className={`text-[11px] font-bold uppercase px-2.5 py-1.5 border cursor-pointer ${
                        prop.status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : prop.status === 'sold'
                          ? 'bg-white text-black border-white font-black'
                          : prop.status === 'rented'
                          ? 'bg-[#141E30] text-white border-slate-500 font-black'
                          : prop.status === 'pending'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      } [&>option]:bg-[#0B1320] [&>option]:text-white`}
                    >
                      <option value="published">Published (Available)</option>
                      <option value="sold">SOLD (Banner Active)</option>
                      <option value="rented">RENTED (Banner Active)</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Featured Toggle */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(prop.id)}
                      className={`p-2 transition ${
                        prop.isFeatured
                          ? 'bg-white text-[#0B1320]'
                          : 'bg-[#141E30] text-slate-500 hover:text-white'
                      }`}
                      title={prop.isFeatured ? 'Featured on Homepage' : 'Not Featured'}
                    >
                      <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                  </td>

                  {/* Views */}
                  <td className="p-4 text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {prop.viewsCount}
                    </span>
                  </td>

                  {/* Quick Actions (1-Click SOLD Toggle & View & Delete) */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* 1-Click SOLD Button */}
                      <button
                        onClick={() => handleUpdateStatus(prop.id, prop.status === 'sold' ? 'published' : 'sold')}
                        className={`px-2.5 py-1.5 text-[10px] font-bold border uppercase transition ${
                          prop.status === 'sold'
                            ? 'bg-black text-white border-white/50 hover:bg-slate-800'
                            : 'bg-[#141E30] text-slate-300 hover:text-white border-slate-700 hover:border-white'
                        }`}
                        title={prop.status === 'sold' ? 'Remove SOLD Banner' : 'Add SOLD Banner'}
                      >
                        {prop.status === 'sold' ? 'Unmark Sold' : 'Mark Sold'}
                      </button>

                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-1.5 bg-[#141E30] hover:bg-[#1E2B45] text-slate-300 hover:text-white border border-slate-700 transition"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-1.5 bg-[#141E30] hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
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
