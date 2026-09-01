'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Bed,
  Bath,
  Maximize2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminSubmissionsPage() {
  const { showToast } = useStore();
  const [submissions, setSubmissions] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.data) {
        setSubmissions(
          data.data.filter(
            (p: Property) => p.status === 'pending' || p.status === 'under_review'
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: 'published' }),
      });
      if (res.ok) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#000000', '#ffffff', '#10b981'],
        });
        showToast('Property approved and published to public site!');
        fetchSubmissions();
      }
    } catch {
      showToast('Error approving property');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide reason for rejection (e.g. Invalid documents, price verification needed):');
    if (!reason) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          status: 'rejected',
          rejectionReason: reason,
        }),
      });
      if (res.ok) {
        showToast('Submission marked as rejected');
        fetchSubmissions();
      }
    } catch {
      showToast('Error rejecting submission');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Editorial Approval Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Pending User Submissions ({submissions.length})
          </h1>
        </div>

        <Link
          href="/submit-property"
          className="text-xs bg-[#0B1320] hover:bg-[#141E30] text-slate-200 border border-slate-700 px-4 py-2 font-medium transition"
        >
          Test Public Submission Flow
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-[#0B1320] border border-slate-800 space-y-4">
          <div className="w-14 h-14 bg-white text-[#0B1320] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Queue is All Clear!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no pending seller or landlord submissions awaiting review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-[#0B1320] border border-slate-800 p-6 space-y-6"
            >
              {/* Top Submitter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#141E30] border border-slate-700 text-white font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {sub.submittedBy?.name || 'Private Property Owner'}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {sub.submittedBy?.phone || '+92 300 0000000'}
                      </span>
                      {sub.submittedBy?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {sub.submittedBy.email}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700">
                    {sub.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {sub.id}
                  </span>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800 border border-slate-700">
                  <Image
                    src={sub.featuredImage || sub.images[0]}
                    alt={sub.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#0B1320] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-slate-700">
                    {sub.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-lg font-bold text-white">
                    {sub.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.location.address}, {sub.location.area}, {sub.location.city}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {sub.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      {sub.specs.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-slate-400" />
                      {sub.specs.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      {sub.specs.areaSize} {sub.specs.areaUnit}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Requested Listing Price
                      </span>
                      <span className="text-lg font-bold text-white">
                        {sub.priceDisplay || (sub.price ? formatPrice(sub.price, 'PKR', sub.purpose === 'rent') : 'Call for Rate')}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(sub.id)}
                        className="flex items-center gap-1.5 bg-[#141E30] hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 px-4 py-2 text-xs font-semibold transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub.id)}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-200 text-[#0B1320] px-5 py-2 text-xs font-bold transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
