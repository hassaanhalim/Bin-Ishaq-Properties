'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import BinIshaqLogo from '@/components/common/BinIshaqLogo';
import {
  Heart,
  Menu,
  X,
  Phone,
  ArrowRight,
  User,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { savedPropertyIds } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phone, setPhone] = useState('+92 315 5735785');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Fetch live company phone from CMS
    fetch('/api/site-content')
      .then((res) => res.json())
      .then((d) => {
        if (d.data?.company?.phone) setPhone(d.data.company.phone);
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Maps', href: '/maps' },
    { label: 'Sell', href: '/submit-property' },
    { label: 'Rent', href: '/properties?purpose=rent' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1320] border-b border-slate-800 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center">
            <BinIshaqLogo size="md" variant="light" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-150 py-1 ${
                  isActive
                    ? 'text-white font-extrabold border-b-2 border-white'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Contact Header actions */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 hover:text-white transition font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{phone}</span>
          </a>

          {/* Saved Badge */}
          <Link
            href="/saved"
            className="relative p-2 bg-[#141E30] hover:bg-[#1E2B45] border border-slate-700 text-slate-200 hover:text-white transition"
            title="Saved Properties"
          >
            <Heart className="w-4 h-4" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-extrabold text-[9px] flex items-center justify-center">
                {savedPropertyIds.length}
              </span>
            )}
          </Link>

          {/* User Account Portal */}
          <Link
            href="/account"
            className="p-2 bg-[#141E30] hover:bg-[#1E2B45] border border-slate-700 text-slate-200 hover:text-white transition"
            title="Client Account Portal"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* List Property Button */}
          <Link
            href="/submit-property"
            className="bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5 transition"
          >
            <span>List Property</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Actions Header */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link
            href="/account"
            className="p-2 bg-[#141E30] border border-slate-700 text-slate-200"
            title="Client Account"
          >
            <User className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#141E30] border border-slate-700 text-white cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1320] border-b border-slate-800 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 font-bold text-base">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-100 hover:text-white py-1 border-b border-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-sm font-bold text-white bg-[#141E30] p-3 border border-slate-700"
            >
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Direct Hotline: {phone}</span>
            </a>

            <Link
              href="/submit-property"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-white text-[#0B1320] text-center font-bold text-sm py-3 transition"
            >
              List Your Property
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
