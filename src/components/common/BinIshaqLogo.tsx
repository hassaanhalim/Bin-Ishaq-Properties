'use client';

import React from 'react';

interface BinIshaqLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export default function BinIshaqLogo({
  className = '',
  showText = true,
  size = 'md',
  variant = 'light',
}: BinIshaqLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
  }[size];

  const subSizes = {
    sm: 'text-[7px]',
    md: 'text-[8px]',
    lg: 'text-[9px]',
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Sharp Architectural Monochrome Emblem */}
      <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0 border ${isLight ? 'border-white bg-[#0B1320] text-white' : 'border-black bg-black text-white'}`}>
        <span className="font-logo font-semibold text-xs sm:text-sm tracking-normal">
          BI
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-logo ${titleSizes} font-semibold tracking-[0.15em] ${isLight ? 'text-white group-hover:text-slate-200' : 'text-slate-900 group-hover:text-black'} transition-colors leading-tight`}
          >
            BIN ISHAQ
          </span>
          <span
            className={`${subSizes} uppercase tracking-[0.25em] ${isLight ? 'text-slate-400' : 'text-slate-500'} font-semibold mt-0.5`}
          >
            PROPERTIES
          </span>
        </div>
      )}
    </div>
  );
}
