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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Bin Ishaq Executive Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Brokerage Operations & Live Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 bg-[#0B1320] hover:bg-[#141E30] text-slate-300 hover:text-white border border-slate-700 font-semibold text-xs px-4 py-2.5 transition"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Visitor Geography</span>
          </Link>

          <Link
            href="/submit-property"
            className="flex items-center gap-2 bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs px-4 py-2.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-[#0B1320] border border-slate-800 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Active Inventory
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {properties.filter((p) => p.status === 'published').length}
            </div>
            <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              {properties.length} Total Registered
            </span>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="bg-[#0B1320] border border-slate-800 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Pending Submissions
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {pendingSubmissions.length}
            </div>
            <Link
              href="/admin/submissions"
              className="text-[11px] text-slate-300 hover:text-white underline mt-1 block"
            >
              Action required ({pendingSubmissions.length})
            </Link>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* CRM Leads */}
        <div className="bg-[#0B1320] border border-slate-800 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Active CRM Leads
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {leads.length}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              High intent buyer inquiries
            </span>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Visitor Origins */}
        <div className="bg-[#0B1320] border border-slate-800 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Top Visitor Origin
            </span>
            <div className="text-xl font-bold text-white flex items-center gap-1.5 truncate">
              {geoData?.topCountries[0] ? (
                <>
                  <span>{geoData.topCountries[0].flag}</span>
                  <span>{geoData.topCities[0]?.city || geoData.topCountries[0].country}</span>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-400">No traffic yet</span>
              )}
            </div>
            <Link
              href="/admin/analytics"
              className="text-[11px] text-slate-300 hover:text-white underline block mt-1"
            >
              {geoData?.topCountries.length || 0} countries detected
            </Link>
          </div>
          <div className="p-3 bg-[#141E30] text-white border border-slate-700">
            <Globe className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visitor Origins Visual Breakdown Bar */}
      {geoData && geoData.topCities.length > 0 && (
        <div className="bg-[#0B1320] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Visitor Geographic Origins (Top Cities & Countries)
              </h4>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <span>Full Analytics Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {geoData.topCities.slice(0, 6).map((city) => (
              <div
                key={city.city}
                className="bg-[#141E30] border border-slate-800 p-2.5 flex items-center gap-2"
              >
                <span className="text-base">{city.flag}</span>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white truncate block">
                    {city.city}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
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
        <div className="bg-[#141E30] border border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-[#0B1320] font-bold shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {pendingSubmissions.length} User Listing Submission{pendingSubmissions.length > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-xs text-slate-400">
                Owners have submitted property documents and specs. Review, edit details, and publish to the live site.
              </p>
            </div>
          </div>

          <Link
            href="/admin/submissions"
            className="shrink-0 bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs px-5 py-2.5 flex items-center gap-1.5 transition"
          >
            <span>Review Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2-Column Dashboard Grid: Recent CRM Inquiries & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent CRM Leads Table */}
        <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Recent Customer Inquiries</span>
            </h3>
            <Link
              href="/admin/crm"
              className="text-xs text-slate-300 hover:text-white font-semibold"
            >
              View All CRM ({leads.length})
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="bg-[#141E30] border border-slate-800 p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">{lead.name}</h5>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 truncate max-w-xs">
                    {lead.interestedPropertyTitle || lead.interestedArea || 'General Inquiry'}
                  </p>
                  <p className="text-[10px] text-slate-500">{lead.phone}</p>
                </div>

                <Link
                  href="/admin/crm"
                  className="p-2 bg-[#0B1320] text-slate-400 hover:text-white border border-slate-800"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Visit Requests */}
        <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Upcoming Visit Requests</span>
            </h3>
            <Link
              href="/admin/appointments"
              className="text-xs text-slate-300 hover:text-white font-semibold"
            >
              View Calendar ({appointments.length})
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.slice(0, 4).map((apt) => (
              <div
                key={apt.id}
                className="bg-[#141E30] border border-slate-800 p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">{apt.customerName}</h5>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    {apt.preferredDate} • {apt.preferredTimeSlot}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-xs">
                    {apt.propertyTitle}
                  </p>
                </div>

                <Link
                  href="/admin/appointments"
                  className="text-xs bg-[#0B1320] hover:bg-[#141E30] text-slate-200 border border-slate-700 px-3 py-1.5 font-medium"
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
