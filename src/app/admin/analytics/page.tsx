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
        return <Laptop className="w-3.5 h-3.5 text-slate-300" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-slate-300" />;
      case 'mobile':
      default:
        return <Smartphone className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Executive Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Visitor Geography & Traffic Origins
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry showing which cities and countries potential buyers and investors are visiting from.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141E30] border border-slate-700 px-3 py-1.5 text-xs font-semibold text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-emerald-500" />
          </span>
          <span>Live Visitor Tracker Active</span>
        </div>
      </div>

      {/* KPI Overview — 100% Dynamic Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-[#0B1320] border border-slate-800 p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Total Website Sessions
          </span>
          <div className="text-3xl font-bold text-white">
            {totalVisits.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {totalVisits > 0 ? `${uniqueVisitors} unique visitor(s)` : 'Awaiting live traffic'}
          </span>
        </div>

        {/* Top Country */}
        <div className="bg-[#0B1320] border border-slate-800 p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Top Visitor Country
          </span>
          <div className="text-xl font-bold text-white truncate">
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
        <div className="bg-[#0B1320] border border-slate-800 p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Top Visitor City
          </span>
          <div className="text-xl font-bold text-white flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{topCities.length > 0 ? topCities[0].city : 'No city recorded yet'}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 truncate">
            {topCities.length > 0
              ? `${topCities[0].visits} hit(s) (${topCities[0].percentage}%)`
              : 'Awaiting visitor hits'}
          </span>
        </div>

        {/* Overseas Expat Traffic */}
        <div className="bg-[#0B1320] border border-slate-800 p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Overseas Expat Traffic
          </span>
          <div className="text-3xl font-bold text-white">
            {expatPercentage}%
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 truncate">
            {overseasVisits > 0
              ? `${overseasVisits} international visit(s)`
              : 'Calculated from non-PK visits'}
          </span>
        </div>
      </div>

      {/* 2-Column: Country Breakdown vs City Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown */}
        <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <h3 className="text-base font-bold text-white">
                Traffic by Country
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {topCountries.length} {topCountries.length === 1 ? 'Country' : 'Countries'} Detected
            </span>
          </div>

          {topCountries.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              No country traffic recorded yet. Visitor origins will automatically populate here as users navigate the website.
            </div>
          ) : (
            <div className="space-y-4">
              {topCountries.map((country) => (
                <div key={country.countryCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.country}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({country.countryCode})</span>
                    </span>
                    <span className="text-slate-400 font-mono">
                      {country.visits} visits <strong className="text-white ml-2">{country.percentage}%</strong>
                    </span>
                  </div>

                  <div className="w-full bg-[#141E30] h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: `${Math.max(country.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Breakdown */}
        <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <h3 className="text-base font-bold text-white">
                Traffic by Metropolitan City
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {topCities.length} {topCities.length === 1 ? 'City' : 'Cities'} Detected
            </span>
          </div>

          {topCities.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              No city traffic recorded yet. Cities will automatically appear in real-time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topCities.map((city) => (
                <div
                  key={`${city.city}-${city.country}`}
                  className="bg-[#141E30] border border-slate-800 p-3.5 flex items-center justify-between"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{city.flag}</span>
                      <h4 className="text-xs font-bold text-white truncate">{city.city}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{city.country}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white block">{city.visits} hits</span>
                    <span className="text-[10px] text-slate-400">{city.percentage}% share</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Visitor Session Stream */}
      <div className="bg-[#0B1320] border border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-white">
              Live Real-Time Visitor Telemetry Stream
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {recentLogs.length} Active Connection{recentLogs.length === 1 ? '' : 's'}
          </span>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800">
            No live visitor sessions currently recorded. When visitors browse pages, active telemetry streams here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141E30] border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Origin Location</th>
                  <th className="p-3.5">Device & Browser</th>
                  <th className="p-3.5">Viewed Page</th>
                  <th className="p-3.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{log.flag}</span>
                        <div>
                          <span className="font-bold text-white block">
                            {log.city}, {log.country}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {log.ip.replace(/\.\d+$/, '.***')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(log.device)}
                        <span className="capitalize font-medium text-slate-300">
                          {log.browser} on {log.device}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-mono text-[11px] text-white bg-[#141E30] px-2 py-1 border border-slate-700">
                        {log.pageVisited}
                      </span>
                    </td>

                    <td className="p-3.5 text-right text-slate-400 font-mono text-[11px]">
                      {timeAgo(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
