'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { GeographicAnalytics } from '@/types/crm';
import { timeAgo } from '@/lib/utils';
import {
  Globe,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  Activity,
  Users,
  Eye,
  MessageSquare,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [geoData, setGeoData] = useState<GeographicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propRes, analyticsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/analytics'),
        ]);

        const propData = await propRes.json();
        const analyticsData = await analyticsRes.json();

        if (propData.data) setProperties(propData.data);
        if (analyticsData.geo) setGeoData(analyticsData.geo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalVisits = geoData?.totalVisits || 0;
  const uniqueVisitors = geoData?.uniqueVisitors || (totalVisits > 0 ? 1 : 0);
  const topCountries = geoData?.topCountries || [];
  const topCities = geoData?.topCities || [];
  const recentLogs = geoData?.recentLogs || [];

  // Calculate real overseas expat traffic dynamically
  const overseasVisits = topCountries
    .filter((c) => c.countryCode !== 'PK')
    .reduce((acc, c) => acc + c.visits, 0);

  const expatPercentage =
    totalVisits > 0 ? Math.round((overseasVisits / totalVisits) * 100) : 0;

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Laptop className="w-4 h-4 text-slate-300" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-slate-300" />;
      case 'mobile':
      default:
        return <Smartphone className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Executive Intelligence
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Visitor Geography &amp; Traffic Origins
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry showing which cities and countries potential buyers and investors are visiting from.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141E30] border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-emerald-500" />
          </span>
          <span>Live Visitor Tracker Active</span>
        </div>
      </div>

      {/* KPI Overview (Single column mobile, 2 tablet, 4 desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Sessions */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Total Website Sessions
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalVisits.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {totalVisits > 0 ? `${uniqueVisitors} unique visitor(s)` : 'Awaiting live traffic'}
          </span>
        </div>

        {/* Top Country */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Top Visitor Country
          </span>
          <div className="text-lg sm:text-xl font-bold text-white truncate">
            {topCountries.length > 0
              ? `${topCountries[0].flag} ${topCountries[0].country}`
              : 'No traffic yet'}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {topCountries.length > 0
              ? `${topCountries[0].percentage}% of total traffic`
              : '0% of total traffic'}
          </span>
        </div>

        {/* Top City */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Top Visitor City
          </span>
          <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{topCities.length > 0 ? topCities[0].city : 'No city recorded yet'}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 truncate">
            {topCities.length > 0
              ? `${topCities[0].visits} hit(s) (${topCities[0].percentage}%)`
              : 'Awaiting city data'}
          </span>
        </div>

        {/* Overseas Percentage */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Overseas Expat Traffic
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {expatPercentage}%
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {overseasVisits} visit(s) from outside Pakistan
          </span>
        </div>
      </div>

      {/* 2-Column Grid: Top Countries & Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Visitor Breakdown by Country</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {topCountries.length} Countries
            </span>
          </div>

          <div className="space-y-3">
            {topCountries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No country telemetry recorded yet.
              </div>
            ) : (
              topCountries.map((c) => (
                <div key={c.countryCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="font-bold text-white">{c.country}</span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {c.visits} visits ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#141E30] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(c.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Top Buyer &amp; Investor Cities</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {topCities.length} Cities
            </span>
          </div>

          <div className="space-y-3">
            {topCities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No city telemetry recorded yet.
              </div>
            ) : (
              topCities.map((city) => (
                <div key={city.city} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{city.flag}</span>
                      <span className="font-bold text-white">{city.city}</span>
                      <span className="text-[10px] text-slate-400">({city.country})</span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {city.visits} visits ({city.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#141E30] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(city.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Recent Visitor Log Stream (Mobile Stacked Cards) */}
      <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              Live Session Activity Stream ({recentLogs.length})
            </h3>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No live visitor logs in this session.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentLogs.slice(0, 12).map((log, idx) => (
              <div
                key={log.id || idx}
                className="bg-[#141E30] border border-slate-700/80 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 truncate">
                    <span>{log.flag}</span>
                    <span className="truncate">{log.city || log.country}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {timeAgo(log.timestamp)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                  <span className="flex items-center gap-1.5">
                    {getDeviceIcon(log.device)}
                    <span className="capitalize">{log.device}</span>
                  </span>
                  <span className="text-slate-300 font-mono text-[10px] truncate max-w-[120px]">
                    {log.browser}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
