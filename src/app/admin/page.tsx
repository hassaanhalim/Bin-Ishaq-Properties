'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { Lead, GeographicAnalytics } from '@/types/crm';
import { Appointment } from '@/types/appointment';
import {
  Building2,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  TrendingUp,
  Globe,
  AlertCircle,
  PlusCircle,
  Activity,
  FileEdit,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [geoData, setGeoData] = useState<GeographicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, leadsRes, aptsRes, analyticsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/crm'),
          fetch('/api/appointments'),
          fetch('/api/analytics'),
        ]);

        const propsData = await propsRes.json();
        const leadsData = await leadsRes.json();
        const aptsData = await aptsRes.json();
        const analyticsData = await analyticsRes.json();

        if (propsData.data) setProperties(propsData.data);
        if (leadsData.data) setLeads(leadsData.data);
        if (aptsData.data) setAppointments(aptsData.data);
        if (analyticsData.geo) setGeoData(analyticsData.geo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingSubmissions = properties.filter(
    (p) => p.status === 'pending' || p.status === 'under_review'
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Bin Ishaq Executive Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Brokerage Operations &amp; Live Telemetry
          </h1>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/admin/analytics"
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-[#0B1320] hover:bg-[#141E30] text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Visitor Geography</span>
          </Link>

          <Link
            href="/submit-property?source=admin"
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-4 py-2.5 rounded-xl transition shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards (Single column on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Properties */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Active Inventory
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {properties.filter((p) => p.status === 'published').length}
            </div>
            <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{properties.length} Total Registered</span>
            </span>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700 rounded-xl">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Pending Submissions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {pendingSubmissions.length}
            </div>
            <Link
              href="/admin/submissions"
              className="text-[11px] text-blue-400 hover:text-blue-300 font-bold underline mt-1 block min-h-[24px] flex items-center"
            >
              Action required ({pendingSubmissions.length})
            </Link>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700 rounded-xl">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* CRM Leads */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Active CRM Leads
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {leads.length}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              High intent buyer inquiries
            </span>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700 rounded-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Visitor Origins */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Top Visitor Origin
            </span>
            <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5 truncate">
              {geoData?.topCountries[0] ? (
                <>
                  <span>{geoData.topCountries[0].flag}</span>
                  <span className="truncate">{geoData.topCities[0]?.city || geoData.topCountries[0].country}</span>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-400">No traffic yet</span>
              )}
            </div>
            <Link
              href="/admin/analytics"
              className="text-[11px] text-slate-300 hover:text-white underline block mt-1 min-h-[24px] flex items-center"
            >
              {geoData?.topCountries.length || 0} countries detected
            </Link>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700 rounded-xl">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Visitor Origins Visual Breakdown Bar */}
      {geoData && geoData.topCities.length > 0 && (
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Visitor Geographic Origins
              </h4>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 py-1"
            >
              <span>Full Analytics Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {geoData.topCities.slice(0, 6).map((city) => (
              <div
                key={city.city}
                className="bg-[#141E30] border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2"
              >
                <span className="text-lg shrink-0">{city.flag}</span>
                <div className="overflow-hidden min-w-0">
                  <span className="text-xs font-bold text-white truncate block">
                    {city.city}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    {city.visits} visits ({city.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Reviews Alert Banner */}
      {pendingSubmissions.length > 0 && (
        <div className="bg-[#141E30] border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-white text-[#0B1320] font-bold rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {pendingSubmissions.length} User Submission{pendingSubmissions.length > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Review documents, plot demarcation, and pricing before publishing.
              </p>
            </div>
          </div>

          <Link
            href="/admin/submissions"
            className="w-full sm:w-auto min-h-[44px] shrink-0 bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition shadow"
          >
            <span>Review Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2-Column Dashboard Grid: Recent CRM Inquiries & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent CRM Leads Table */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Recent Customer Inquiries</span>
            </h3>
            <Link
              href="/admin/crm"
              className="text-xs text-slate-300 hover:text-white font-semibold min-h-[36px] flex items-center"
            >
              View All CRM ({leads.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="bg-[#141E30] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white truncate">{lead.name}</h5>
                    <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                    {lead.interestedPropertyTitle || lead.interestedArea || 'General Inquiry'}
                  </p>
                  <p className="text-[10px] text-slate-400">{lead.phone}</p>
                </div>

                <Link
                  href="/admin/crm"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-[#0B1320] text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center shrink-0 transition"
                  aria-label={`Open CRM lead ${lead.name}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Visit Requests */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Upcoming Visit Requests</span>
            </h3>
            <Link
              href="/admin/appointments"
              className="text-xs text-slate-300 hover:text-white font-semibold min-h-[36px] flex items-center"
            >
              View Calendar ({appointments.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                className="bg-[#141E30] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white truncate">{apt.customerName}</h5>
                    <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                    {apt.preferredDate} • {apt.preferredTimeSlot}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {apt.propertyTitle}
                  </p>
                </div>

                <Link
                  href="/admin/appointments"
                  className="min-h-[44px] text-xs bg-[#0B1320] hover:bg-white hover:text-[#0B1320] text-slate-200 border border-slate-700 px-3.5 py-2 font-bold rounded-xl flex items-center justify-center shrink-0 transition"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
