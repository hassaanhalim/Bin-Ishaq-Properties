import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AreaUnit } from '@/types/property';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SupportedCurrency = 'PKR';

/**
 * Formats PKR numbers into standard Pakistani phrasing (Crore, Lakh, Thousand)
 */
export function formatPrice(
  amountInPkr: number,
  currency: SupportedCurrency = 'PKR',
  isRent: boolean = false
): string {
  if (!amountInPkr || isNaN(amountInPkr)) return 'Price on Request';

  // Pakistani Crore notation (1 Crore = 10,000,000 PKR)
  if (amountInPkr >= 10000000) {
    const crore = amountInPkr / 10000000;
    const formatted = crore % 1 === 0 ? crore.toString() : crore.toFixed(2);
    return `PKR ${formatted} Crore${isRent ? '/mo' : ''}`;
  }

  // Pakistani Lakh notation (1 Lakh = 100,000 PKR)
  if (amountInPkr >= 100000) {
    const lakh = amountInPkr / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toString() : lakh.toFixed(2);
    return `PKR ${formatted} Lakh${isRent ? '/mo' : ''}`;
  }

  return `PKR ${amountInPkr.toLocaleString('en-PK')}${isRent ? '/mo' : ''}`;
}

/**
 * Format Area with proper unit naming
 */
export function formatArea(size: number, unit: AreaUnit): string {
  if (!size) return '';
  switch (unit) {
    case 'kanal':
      return `${size} ${size === 1 ? 'Kanal' : 'Kanals'}`;
    case 'marla':
      return `${size} ${size === 1 ? 'Marla' : 'Marlas'}`;
    case 'sqft':
    default:
      return `${size.toLocaleString()} Sq Ft`;
  }
}

/**
 * Convert area units
 */
export function convertArea(size: number, from: AreaUnit, to: AreaUnit): number {
  if (from === to) return size;
  let inSqft = size;
  if (from === 'marla') inSqft = size * 225;
  if (from === 'kanal') inSqft = size * 4500;

  if (to === 'sqft') return inSqft;
  if (to === 'marla') return Number((inSqft / 225).toFixed(1));
  if (to === 'kanal') return Number((inSqft / 4500).toFixed(2));
  return size;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export const PAKISTAN_POPULAR_AREAS = [
  'DHA Phase 5',
  'DHA Phase 6',
  'DHA Phase 8',
  'Bahria Town',
  'Clifton Block 2',
  'Clifton Block 4',
  'Clifton Block 5',
  'Gulshan-e-Iqbal',
  'Emaar Crescent Bay',
  'F-7 Islamabad',
  'F-8 Islamabad',
  'Gulberg Lahore',
];
