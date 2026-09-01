'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Property } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import {
  User,
  Heart,
  FileText,
  Clock,
  LogOut,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  PlusCircle,
  Calendar,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { savedPropertyIds, showToast } = useStore();

  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'inquiries' | 'submissions'>('saved');
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check real user session strictly
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.email || parsed.name)) {
            setUser(parsed);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthChecked(true);
    }

    // Load saved properties
    async function loadProperties() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.data) {
          const matched = data.data.filter((p: Property) => savedPropertyIds.includes(p.id));
          setSavedProperties(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [savedPropertyIds]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');
    }
    setUser(null);
    showToast('Signed out successfully.');
    router.push('/login');
  };

  // 1. Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Unauthenticated Gate (Strict Login Required)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] py-16 px-4 sm:px-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B1320] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
              Client Authentication Required
            </span>
            <h1 className="text-2xl font-bold text-slate-950">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Please sign in to view your saved properties, track listed property submissions, and communicate with society officers.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login?redirect=/account"
              className="w-full bg-[#0B1320] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow"
            >
              <span>Sign In to Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup?redirect=/account"
              className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-sm border border-slate-300 flex items-center justify-center gap-2 transition"
            >
              <span>Create New Investor Account</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Society Advisory Portal</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Client Dashboard
  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Account Header Card */}
        <div className="architectural-grid bg-[#0B1320] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black text-white shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'BI'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white">
                  {user?.name || 'Verified Client'}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Verified Client
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {user?.email || 'Registered Investor'} {user?.phone ? `• ${user.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <Link
              href="/submit-property"
              className="bg-white hover:bg-slate-100 text-[#0B1320] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#0B1320]" />
              <span>List Property</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/10 hover:bg-rose-600/80 text-white rounded-xl transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'saved', label: `Saved Properties (${savedPropertyIds.length})`, icon: Heart },
            { id: 'inquiries', label: 'Consultation & Inquiries', icon: Clock },
            { id: 'submissions', label: 'My Listed Properties', icon: Building },
            { id: 'profile', label: 'Account Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold transition border-b-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-black text-black bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'saved' && (
          <div>
            {savedProperties.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Saved Properties Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Browse our inventory in MPCHS B-17, Faisal Town, Faisal Hills, and Bahria Town to save verified plots and residences.
                </p>
                <Link
                  href="/properties"
                  className="inline-block bg-[#0B1320] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-black transition"
                >
                  Explore Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Inquiries & Advisory Files</h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time tracking of your society inquiries and dealer verification sessions.
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">MPCHS Multi Gardens B-17 — Block B 10 Marla Corner</span>
                    <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">In Review</span>
                  </div>
                  <p className="text-xs text-slate-500">Official Society Verification & Plot Demarcation Request</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Submitted Today</span>
                  <span className="text-xs font-bold text-slate-900">Advisory: Senior Desk ISB</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Faisal Hills Executive Block — 1 Kanal Solid Land</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Verified Title</span>
                  </div>
                  <p className="text-xs text-slate-500">Direct ZEDEM International Transfer Documentation</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">2 Days Ago</span>
                  <span className="text-xs font-bold text-slate-900">Officer: Tariq Bin Ishaq</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Submitted Properties</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Properties you have listed through the Bin Ishaq Seller Portal.
                </p>
              </div>
              <Link
                href="/submit-property"
                className="bg-[#0B1320] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Another</span>
              </Link>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 text-center space-y-3 bg-slate-50">
              <Building className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">All submissions are monitored in real time</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Once submitted, our on-ground inspection officers verify society records with MPCHS, ZEDEM, or Bahria Town before publishing to the platform.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Investor Profile Information</h3>
              <p className="text-xs text-slate-500 mt-1">Manage your contact details and investment preferences.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || 'Verified Client'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  disabled
                  value={user?.phone || 'Not Specified'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
