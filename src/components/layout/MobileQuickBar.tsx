'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  Phone,
  Search,
  Plus,
  Heart,
} from 'lucide-react';

export default function MobileQuickBar() {
  const pathname = usePathname();
  const { savedPropertyIds } = useStore();
  const [phone, setPhone] = React.useState('+92 315 5735785');

  React.useEffect(() => {
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data?.company?.phone) setPhone(d.data.company.phone);
      })
      .catch(() => {});
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const whatsappNumber = phone.replace(/\D/g, '') || '923155735785';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#071426]/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 sm:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
        {/* 1. Direct Call */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-bold text-slate-300 hover:text-white transition active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-[#141E30] border border-slate-700 flex items-center justify-center text-slate-200 mb-1">
            <Phone className="w-4 h-4" />
          </div>
          <span>Call</span>
        </a>

        {/* 2. Authentic WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi%2C+I+am+interested+in+Bin+Ishaq+Properties+exclusive+society+listings`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center mb-1 shadow-sm">
            <svg
              className="w-4 h-4 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>
          <span>WhatsApp</span>
        </a>

        {/* 3. Explore Properties */}
        <Link
          href="/properties"
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-bold transition active:scale-95 ${
            pathname === '/properties' ? 'text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-1 ${
              pathname === '/properties'
                ? 'bg-white text-[#0B1320] border-white'
                : 'bg-[#141E30] border-slate-700 text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
          </div>
          <span>Explore</span>
        </Link>

        {/* 4. Saved Favorites */}
        <Link
          href="/saved"
          className={`relative flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-bold transition active:scale-95 ${
            pathname === '/saved' ? 'text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-1 relative ${
              pathname === '/saved'
                ? 'bg-white text-[#0B1320] border-white'
                : 'bg-[#141E30] border-slate-700 text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center border border-[#0B1320]">
                {savedPropertyIds.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </Link>

        {/* 5. List Property */}
        <Link
          href="/submit-property"
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-bold transition active:scale-95 ${
            pathname === '/submit-property' ? 'text-white' : 'text-slate-200 hover:text-white'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-white text-[#0B1320] border border-white flex items-center justify-center mb-1 shadow-sm font-black">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>List</span>
        </Link>
      </div>
    </div>
  );
}
