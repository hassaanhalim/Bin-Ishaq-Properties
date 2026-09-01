'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  Phone,
  MessageCircle,
  Search,
  PlusCircle,
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#071426]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 sm:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Direct Call */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-medium text-zinc-300 hover:text-amber-400"
        >
          <div className="p-1.5 rounded-full bg-[#0c1c33] text-amber-400 mb-0.5">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span>Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi%2C+I+am+interested+in+Bin+Ishaq+Properties+exclusive+listings`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-medium text-emerald-400"
        >
          <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 mb-0.5">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span>WhatsApp</span>
        </a>

        {/* Explore */}
        <Link
          href="/properties"
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-medium text-zinc-300 hover:text-amber-400"
        >
          <div className="p-1.5 rounded-full bg-[#0c1c33] text-zinc-300 mb-0.5">
            <Search className="w-3.5 h-3.5" />
          </div>
          <span>Explore</span>
        </Link>

        {/* Saved */}
        <Link
          href="/saved"
          className="relative flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-medium text-zinc-300 hover:text-amber-400"
        >
          <div className="p-1.5 rounded-full bg-[#0c1c33] text-zinc-300 mb-0.5 relative">
            <Heart className="w-3.5 h-3.5" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-[#071426] font-bold text-[8.5px] flex items-center justify-center">
                {savedPropertyIds.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </Link>

        {/* Submit */}
        <Link
          href="/submit-property"
          className="flex-1 flex flex-col items-center justify-center py-1 text-[10px] font-medium text-amber-300"
        >
          <div className="p-1.5 rounded-full gold-gradient-button text-[#071426] mb-0.5">
            <PlusCircle className="w-3.5 h-3.5" />
          </div>
          <span>List</span>
        </Link>
      </div>
    </div>
  );
}
