import { Property, PropertyFilterParams, PropertyStatus } from '@/types/property';
import { SiteContent } from '@/types/siteContent';
import { Lead, LeadStatus, VisitorLog, GeographicAnalytics, CountryTrafficStat, CityTrafficStat } from '@/types/crm';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { MasterPlanMap } from '@/types/map';
import { Conversation, ChatMessage } from '@/types/chat';
import { INITIAL_MAPS } from './data/maps';
import { INITIAL_PROPERTIES } from './data/properties';
import { INITIAL_LEADS } from './data/leads';
import { INITIAL_APPOINTMENTS } from './data/appointments';
import { INITIAL_CONVERSATIONS } from './data/chat';

const SEED_VISITOR_LOGS: VisitorLog[] = [
  {
    id: 'vis-1',
    city: 'Karachi',
    country: 'Pakistan',
    countryCode: 'PK',
    flag: '🇵🇰',
    device: 'desktop',
    browser: 'Chrome / macOS',
    pageVisited: '/properties/prop-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    ip: '111.119.187.42',
  },
  {
    id: 'vis-2',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    device: 'mobile',
    browser: 'Safari / iPhone 15 Pro',
    pageVisited: '/properties?area=DHA+Phase+6',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    ip: '94.200.12.19',
  },
  {
    id: 'vis-3',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    device: 'desktop',
    browser: 'Chrome / Windows',
    pageVisited: '/properties/prop-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    ip: '86.14.92.110',
  },
  {
    id: 'vis-4',
    city: 'Lahore',
    country: 'Pakistan',
    countryCode: 'PK',
    flag: '🇵🇰',
    device: 'mobile',
    browser: 'Chrome / Android',
    pageVisited: '/properties?type=villa',
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    ip: '182.180.77.201',
  },
  {
    id: 'vis-5',
    city: 'Islamabad',
    country: 'Pakistan',
    countryCode: 'PK',
    flag: '🇵🇰',
    device: 'desktop',
    browser: 'Edge / Windows',
    pageVisited: '/properties',
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    ip: '39.40.128.5',
  },
  {
    id: 'vis-6',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    device: 'mobile',
    browser: 'Safari / iOS',
    pageVisited: '/properties/prop-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    ip: '212.118.143.10',
  },
  {
    id: 'vis-7',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    device: 'desktop',
    browser: 'Safari / macOS',
    pageVisited: '/properties?type=penthouse',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    ip: '108.35.24.89',
  },
  {
    id: 'vis-8',
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    device: 'mobile',
    browser: 'Chrome / Android',
    pageVisited: '/submit-property',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    ip: '142.114.88.22',
  },
  {
    id: 'vis-9',
    city: 'Karachi',
    country: 'Pakistan',
    countryCode: 'PK',
    flag: '🇵🇰',
    device: 'mobile',
    browser: 'Safari / iPhone',
    pageVisited: '/',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    ip: '111.119.187.88',
  },
  {
    id: 'vis-10',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    device: 'desktop',
    browser: 'Chrome / Windows',
    pageVisited: '/properties/prop-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    ip: '94.200.55.70',
  },
  {
    id: 'vis-11',
    city: 'Manchester',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    device: 'mobile',
    browser: 'Safari / iOS',
    pageVisited: '/properties',
    timestamp: new Date(Date.now() - 1000 * 60 * 290).toISOString(),
    ip: '82.132.240.15',
  },
  {
    id: 'vis-12',
    city: 'Doha',
    country: 'Qatar',
    countryCode: 'QA',
    flag: '🇶🇦',
    device: 'desktop',
    browser: 'Chrome / Windows',
    pageVisited: '/properties/prop-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
    ip: '78.100.11.45',
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title: 'Find Your Dream Property in',
    highlightText: 'Prime Locations',
    subtitle:
      'Explore premier residential plots, luxury houses, modern apartments, and commercial properties across top housing societies in Islamabad & Rawalpindi.',
    bgImageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=90',
    ctaText: 'Explore Society Portfolios',
  },
  company: {
    name: 'Bin Ishaq Properties',
    tagline: 'Authorized Housing Societies Dealer & Property Advisory',
    phone: '+92 300 5195000',
    whatsapp: '923005195000',
    email: 'info@binishaqproperties.com',
    address: 'Head Office: Faisal Town / MPCHS B-17 Commercial Hub, Islamabad',
    workingHours: 'Mon - Sat: 10:00 AM - 8:00 PM',
  },
  whyChoose: {
    eyebrow: 'Authorized Housing Society Dealer',
    heading: 'Why Clients Trust Bin Ishaq for Society Investments',
    description: 'We provide direct dealer representation, verified title checks, transparent file transfers, and strategic guidance across Pakistan’s leading master-planned developments.',
    points: [
      {
        id: 'w-1',
        title: 'Direct Society & Developer Transfers',
        description: 'Direct submission and official verification with developer transfer offices (MPCHS, ZEDEM, Bahria, DHA).',
      },
      {
        id: 'w-2',
        title: 'On-Ground Physical Verification',
        description: 'Accurate on-ground sector location, plot demarcation, and real development progress reports.',
      },
      {
        id: 'w-3',
        title: 'Strategic Capital Growth Advisory',
        description: 'Actionable guidance on installment files, balloting dates, commercial avenues, and long-term ROI.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Client Guidance',
    heading: 'Trusted Real Estate Advice',
    items: [],
  },
  offices: [
    {
      id: 'off-1',
      city: 'Islamabad Desk (B-17 & Faisal Town)',
      address: 'Commercial Avenue, Block B, MPCHS Multi Gardens B-17, Islamabad',
      phone: '+92 300 5195000',
      whatsapp: '923005195000',
      email: 'info@binishaqproperties.com',
    },
    {
      id: 'off-2',
      city: 'Karachi Office (DHA & Clifton)',
      address: 'Executive Tower 1, Khayaban-e-Shamsheer, DHA Phase 5, Karachi',
      phone: '+92 300 5195000',
      whatsapp: '923005195000',
      email: 'info@binishaqproperties.com',
    },
    {
      id: 'off-3',
      city: 'Lahore Desk (DHA & Bahria)',
      address: 'Main Boulevard, Phase 6, DHA Lahore',
      phone: '+92 300 5195000',
      whatsapp: '923005195000',
      email: 'info@binishaqproperties.com',
    },
  ],
  about: {
    eyebrow: 'Bin Ishaq Property Advisory',
    heading: 'Authorized Dealer for Pakistan’s Premier Housing Societies',
    storyP1: 'Bin Ishaq Real Estate is a dedicated real estate dealership and property advisory specializing in high-demand housing societies including MPCHS, ZEDEM International (Faisal Town, Faisal Hills, Faisal Margalla City), Bahria Town, and DHA.',
    storyP2: 'We assist individual buyers, overseas Pakistanis, and institutional investors in securing verified residential plots, commercial avenues, and prime houses with complete documentation clarity and direct developer transfer support.',
    stat1Value: '100%',
    stat1Label: 'Official Society Verification',
    stat2Value: 'Direct',
    stat2Label: 'Developer Transfer Support',
    stat3Value: 'Zero',
    stat3Label: 'Hidden Surcharges',
  },
  searchFilter: {
    locations: [
      { label: 'All Societies / Locations', value: 'all' },
      { label: 'MPCHS Multi Gardens B-17', value: 'MPCHS' },
      { label: 'Faisal Town Islamabad', value: 'Faisal Town' },
      { label: 'Faisal Town Phase 2', value: 'Faisal Town Phase 2' },
      { label: 'Faisal Hills Islamabad', value: 'Faisal Hills' },
      { label: 'Bahria Town (ISB/RWP)', value: 'Bahria Town' },
    ],
    propertyTypes: [
      { label: 'All Property Categories', value: 'all' },
      { label: 'Residential Plot', value: 'plot' },
      { label: 'Plot File / Booking', value: 'file' },
      { label: 'House / Villa', value: 'house' },
      { label: 'Apartment', value: 'apartment' },
      { label: 'Commercial Plot', value: 'commercial' },
      { label: 'Retail Shop', value: 'shop' },
      { label: 'Corporate Office', value: 'office' },
    ],
    priceRanges: [
      { label: 'Any Budget Range', value: 'all' },
      { label: 'Under 50 Lakh', value: '0-5000000' },
      { label: '50 Lakh to 1.5 Crore', value: '5000000-15000000' },
      { label: '1.5 to 5 Crore', value: '15000000-50000000' },
      { label: '5 Crore & Above', value: '50000000-500000000' },
    ],
    bedrooms: [
      { label: 'Any Bedrooms (Houses/Flats)', value: 'all' },
      { label: '2+ Bedrooms', value: '2' },
      { label: '3+ Bedrooms', value: '3' },
      { label: '4+ Bedrooms', value: '4' },
      { label: '5+ Bedrooms', value: '5' },
    ],
  },
  footer: {
    brandDescription:
      'Bin Ishaq Real Estate — Authorized property dealer & advisory for Pakistan’s leading housing societies. Delivering verified plots, transparent developer transfers, and high-growth investment guidance in Islamabad and Rawalpindi.',
    trustBadges: [
      {
        id: 'tb-1',
        title: 'Official Society Transfers',
        description: 'Direct verification with MPCHS, ZEDEM, and Bahria Town offices.',
      },
      {
        id: 'tb-2',
        title: 'On-Ground Physical Verification',
        description: 'Accurate sector location, demarcation, and development status.',
      },
      {
        id: 'tb-3',
        title: 'Overseas Expat Desk',
        description: 'Seamless remote file processing and investment advisory.',
      },
    ],
    exploreLinks: [
      { label: 'Browse All Inventory', href: '/properties' },
      { label: 'Residential Plots for Sale', href: '/properties?category=plot' },
      { label: 'Commercial Plots & Shops', href: '/properties?category=commercial' },
      { label: 'Plot Files & Bookings', href: '/properties?category=file' },
      { label: 'Houses & Villas', href: '/properties?category=house' },
      { label: 'Apartments & Penthouses', href: '/properties?category=apartment' },
    ],
    primeLocationLinks: [
      { label: 'MPCHS Multi Gardens B-17', href: '/properties?society=MPCHS' },
      { label: 'Faisal Town Islamabad', href: '/properties?society=Faisal+Town' },
      { label: 'Faisal Town Phase 2', href: '/properties?society=Faisal+Town+Phase+2' },
      { label: 'Faisal Hills Islamabad', href: '/properties?society=Faisal+Hills' },
      { label: 'Bahria Town (ISB/RWP)', href: '/properties?society=Bahria' },
    ],
    copyrightText: 'Bin Ishaq Real Estate & Advisory. All rights reserved.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/about' },
      { label: 'Terms of Brokerage', href: '/about' },
      { label: 'Office Locator', href: '/contact' },
    ],
  },
  updatedAt: new Date().toISOString(),
};

// Global singleton in Node environment for hot-reload persistence
declare global {
  // eslint-disable-next-line no-var
  var __realEstateDb:
    | {
        properties: Property[];
        leads: Lead[];
        appointments: Appointment[];
        conversations: Conversation[];
        visitors: VisitorLog[];
        siteContent: SiteContent;
        maps: MasterPlanMap[];
      }
    | undefined;
}

if (!global.__realEstateDb) {
  global.__realEstateDb = {
    properties: [...INITIAL_PROPERTIES],
    leads: [],
    appointments: [],
    conversations: [],
    visitors: [],
    siteContent: { ...DEFAULT_SITE_CONTENT },
    maps: [...INITIAL_MAPS],
  };
} else {
  // Reset on reload to pick up fresh clean properties and content
  global.__realEstateDb.properties = [...INITIAL_PROPERTIES];
  global.__realEstateDb.siteContent = { ...DEFAULT_SITE_CONTENT };
  global.__realEstateDb.maps = [...INITIAL_MAPS];
  global.__realEstateDb.leads = [];
  global.__realEstateDb.appointments = [];
  global.__realEstateDb.conversations = [];
  global.__realEstateDb.visitors = [];
}

const db = global.__realEstateDb;

// ================= PROPERTY METHODS =================

export function getProperties(params?: PropertyFilterParams): Property[] {
  let result = [...db.properties];

  if (!params) return result;

  if (params.purpose && params.purpose !== 'all') {
    result = result.filter((p) => p.purpose === params.purpose);
  }

  if (params.category && params.category !== 'all') {
    const cat = params.category;
    if (cat === 'plot') {
      result = result.filter((p) => p.category === 'plot' || p.category === 'file');
    } else if (cat === 'commercial') {
      result = result.filter(
        (p) => p.category === 'commercial' || p.category === 'shop' || p.category === 'office'
      );
    } else {
      result = result.filter((p) => p.category === cat);
    }
  }

  if (params.type && params.type !== 'all') {
    const q = params.type.toLowerCase();
    result = result.filter(
      (p) =>
        p.category === q ||
        p.propertyType.toLowerCase().includes(q) ||
        (p as any).type === q
    );
  }

  if (params.developer && params.developer !== 'all') {
    const dev = params.developer.toLowerCase();
    result = result.filter(
      (p) =>
        p.developer.toLowerCase().includes(dev) ||
        (dev.includes('zedem') &&
          (p.society.toLowerCase().includes('faisal') || p.developer.toLowerCase().includes('zedem')))
    );
  }

  if (params.society && params.society !== 'all') {
    const q = params.society.toLowerCase();
    if (q === 'zedem' || q.includes('zedem')) {
      result = result.filter(
        (p) =>
          p.developer.toLowerCase().includes('zedem') ||
          p.society.toLowerCase().includes('faisal')
      );
    } else if (q === 'other' || q.includes('other')) {
      const primeSocieties = ['mpchs', 'faisal', 'bahria'];
      result = result.filter(
        (p) =>
          p.society.toLowerCase().includes('other') ||
          !primeSocieties.some((prime) => p.society.toLowerCase().includes(prime))
      );
    } else {
      result = result.filter(
        (p) =>
          p.society.toLowerCase().includes(q) ||
          p.developer.toLowerCase().includes(q) ||
          p.location.society?.toLowerCase().includes(q)
      );
    }
  }

  if (params.city && params.city !== 'all') {
    const q = params.city.toLowerCase();
    result = result.filter((p) => p.city.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q));
  }

  if (params.area && params.area !== 'all') {
    const q = params.area.toLowerCase();
    result = result.filter(
      (p) =>
        p.location.area.toLowerCase().includes(q) ||
        p.society.toLowerCase().includes(q) ||
        p.location.society?.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q)
    );
  }

  if (params.minPrice !== undefined && params.minPrice > 0) {
    result = result.filter((p) => (p.price || 0) >= params.minPrice!);
  }

  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    result = result.filter((p) => (p.price || 0) <= params.maxPrice!);
  }

  if (params.minBedrooms !== undefined && params.minBedrooms > 0) {
    result = result.filter((p) => (p.specs?.bedrooms || 0) >= params.minBedrooms!);
  }

  if (params.minBathrooms !== undefined && params.minBathrooms > 0) {
    result = result.filter((p) => (p.specs?.bathrooms || 0) >= params.minBathrooms!);
  }

  if (params.sizeRange && params.sizeRange !== 'all') {
    const sr = params.sizeRange;
    result = result.filter((p) => {
      const size = p.specs?.areaSize || 0;
      const unit = p.specs?.areaUnit || 'marla';

      if (sr === '5-marla') {
        return (unit === 'marla' && size >= 4.5 && size <= 6) || (unit === 'sqyd' && size >= 115 && size <= 140);
      }
      if (sr === '7-marla') {
        return (unit === 'marla' && size >= 6.5 && size <= 8) || (unit === 'sqyd' && size >= 160 && size <= 190);
      }
      if (sr === '10-marla') {
        return (unit === 'marla' && size >= 9 && size <= 12) || (unit === 'sqyd' && size >= 230 && size <= 275);
      }
      if (sr === '1-kanal') {
        return (
          (unit === 'kanal' && size >= 0.9 && size <= 1.2) ||
          (unit === 'marla' && size >= 18 && size <= 22) ||
          (unit === 'sqyd' && size >= 450 && size <= 550)
        );
      }
      if (sr === '2-kanal') {
        return (unit === 'kanal' && size >= 1.8 && size <= 2.5) || (unit === 'marla' && size >= 38 && size <= 44);
      }
      if (sr === '4-kanal') {
        return unit === 'kanal' && size >= 3.5;
      }
      if (sr === '2-4-marla') {
        return (unit === 'marla' && size >= 2 && size <= 4.5) || (unit === 'sqft' && size >= 400 && size <= 1100);
      }
      if (sr === '4-8-marla') {
        return (unit === 'marla' && size >= 4 && size <= 8.5) || (unit === 'sqft' && size >= 1000 && size <= 2200);
      }
      if (sr === '10-16-marla') {
        return unit === 'marla' && size >= 9 && size <= 16;
      }
      if (sr === '1-kanal-plus') {
        return (unit === 'kanal' && size >= 1) || (unit === 'marla' && size >= 20);
      }
      if (sr === '500-2000-sqft') {
        return (unit === 'sqft' && size >= 400 && size <= 2200) || (unit === 'marla' && size >= 2 && size <= 8);
      }
      return true;
    });
  }

  if (params.isFeatured) {
    result = result.filter((p) => p.isFeatured);
  }

  if (params.features && params.features.length > 0) {
    result = result.filter((p) =>
      params.features!.every((f) => p.features?.includes(f))
    );
  }

  // Sort
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  return result;
}

export function getPropertyById(id: string): Property | undefined {
  return db.properties.find((p) => p.id === id || p.slug === id);
}

export function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>): Property {
  const newProperty: Property = {
    ...propertyData,
    id: `prop-${Date.now()}`,
    viewsCount: 0,
    inquiriesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.properties.unshift(newProperty);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const index = db.properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.properties[index] = {
    ...db.properties[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return db.properties[index];
}

export function updatePropertyStatus(
  id: string,
  status: PropertyStatus,
  rejectionReason?: string
): Property | null {
  const updates: Partial<Property> = { status };
  if (rejectionReason) {
    updates.rejectionReason = rejectionReason;
  }
  return updateProperty(id, updates);
}

export function togglePropertyFeatured(id: string): Property | null {
  const property = getPropertyById(id);
  if (!property) return null;
  return updateProperty(id, { isFeatured: !property.isFeatured });
}

export function incrementPropertyView(id: string): void {
  const prop = db.properties.find((p) => p.id === id);
  if (prop) {
    prop.viewsCount = (prop.viewsCount || 0) + 1;
  }
}

export function incrementPropertyInquiry(id: string): void {
  const prop = db.properties.find((p) => p.id === id);
  if (prop) {
    prop.inquiriesCount = (prop.inquiriesCount || 0) + 1;
  }
}

export function deleteProperty(id: string): boolean {
  const index = db.properties.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.properties.splice(index, 1);
  return true;
}

// ================= CRM LEADS METHODS =================

export function getLeads(): Lead[] {
  return [...db.leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLeadById(id: string): Lead | undefined {
  return db.leads.find((l) => l.id === id);
}

export function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): Lead {
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    activities: [
      {
        id: `act-${Date.now()}`,
        type: 'note',
        message: 'Lead registered from website inquiry.',
        author: 'System',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.leads.unshift(newLead);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus, author = 'Admin'): Lead | null {
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;

  const prevStatus = lead.status;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  lead.activities.unshift({
    id: `act-${Date.now()}`,
    type: 'status_change',
    message: `Status transitioned from ${prevStatus} to ${status}`,
    author,
    createdAt: new Date().toISOString(),
  });

  return lead;
}

export function addLeadActivity(
  id: string,
  activityOrMessage: { type: any; message: string; author?: string } | string,
  typeArg?: any,
  authorArg?: string
): Lead | null {
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;

  let activityType = 'note';
  let message = '';
  let author = 'Admin';

  if (typeof activityOrMessage === 'string') {
    message = activityOrMessage;
    activityType = typeArg || 'note';
    author = authorArg || 'Admin';
  } else {
    activityType = activityOrMessage.type;
    message = activityOrMessage.message;
    author = activityOrMessage.author || 'Admin';
  }

  lead.activities.unshift({
    id: `act-${Date.now()}`,
    type: activityType as any,
    message,
    author,
    createdAt: new Date().toISOString(),
  });
  lead.updatedAt = new Date().toISOString();

  return lead;
}

// ================= APPOINTMENTS METHODS =================

export function getAppointments(): Appointment[] {
  return [...db.appointments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Appointment {
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...data,
    id: `apt-${Date.now()}`,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  db.appointments.unshift(newAppointment);

  // Auto create or update a CRM lead
  const existingLead = db.leads.find(
    (l) => l.phone === data.customerPhone || (data.customerEmail && l.email === data.customerEmail)
  );

  if (existingLead) {
    addLeadActivity(existingLead.id, {
      type: 'viewing',
      message: `Requested VIP viewing for ${data.propertyTitle} on ${data.preferredDate} (${data.preferredTimeSlot})`,
      author: 'Website Booking Engine',
    });
  } else {
    createLead({
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail,
      status: 'viewing_scheduled',
      source: 'visit_request',
      interestedPropertyId: data.propertyId,
      interestedPropertyTitle: data.propertyTitle,
      interestedArea: data.propertyLocation,
      notes: `Requested ${data.viewingMode} viewing on ${data.preferredDate} at ${data.preferredTimeSlot}. Notes: ${data.notes || 'None'}`,
    });
  }

  incrementPropertyInquiry(data.propertyId);

  return newAppointment;
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  adminNotes?: string
): Appointment | null {
  const apt = db.appointments.find((a) => a.id === id);
  if (!apt) return null;

  apt.status = status;
  if (adminNotes) apt.adminNotes = adminNotes;
  apt.updatedAt = new Date().toISOString();

  return apt;
}

// ================= CHAT CONVERSATIONS METHODS =================

export function getConversations(): Conversation[] {
  return [...db.conversations];
}

export function getConversationById(id: string): Conversation | undefined {
  return db.conversations.find((c) => c.id === id);
}

export function addChatMessage(
  conversationId: string,
  message: {
    sender: 'customer' | 'admin' | 'ai';
    senderName?: string;
    text: string;
    propertyContext?: any;
    recommendations?: any[];
  }
): ChatMessage {
  let conv = db.conversations.find((c) => c.id === conversationId);
  const now = new Date().toISOString();

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    sender: message.sender,
    senderName: message.senderName || (message.sender === 'admin' ? 'Bin Ishaq VIP Concierge' : 'Guest'),
    text: message.text,
    timestamp: now,
    propertyContext: message.propertyContext,
    recommendations: message.recommendations,
    isRead: message.sender === 'admin',
  };

  if (!conv) {
    conv = {
      id: conversationId,
      customerName: message.senderName || 'Guest User',
      lastMessage: message.text,
      lastMessageTime: now,
      unreadCount: message.sender === 'customer' ? 1 : 0,
      propertyId: message.propertyContext?.id,
      propertyTitle: message.propertyContext?.title,
      propertyImage: message.propertyContext?.image,
      status: 'active',
      messages: [newMsg],
    };
    db.conversations.unshift(conv);
  } else {
    conv.messages.push(newMsg);
    conv.lastMessage = message.text;
    conv.lastMessageTime = now;
    if (message.sender === 'customer') {
      conv.unreadCount += 1;
    }
  }

  return newMsg;
}

export const sendChatMessage = addChatMessage;

// ================= VISITOR TELEMETRY & GEOGRAPHY =================

export function recordVisitorLog(data: Omit<VisitorLog, 'id' | 'timestamp'>): VisitorLog {
  const newLog: VisitorLog = {
    ...data,
    id: `vis-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  db.visitors.unshift(newLog);
  if (db.visitors.length > 200) {
    db.visitors = db.visitors.slice(0, 200);
  }
  return newLog;
}

export function getGeographicAnalytics(): GeographicAnalytics {
  const visitors = db.visitors || [];
  const totalVisits = visitors.length;
  const uniqueIps = totalVisits > 0 ? new Set(visitors.map((v) => v.ip || '127.0.0.1')).size : 0;

  // Country calculations
  const countryMap: Record<string, { code: string; flag: string; count: number }> = {};
  visitors.forEach((v) => {
    if (!countryMap[v.country]) {
      countryMap[v.country] = { code: v.countryCode, flag: v.flag, count: 0 };
    }
    countryMap[v.country].count += 1;
  });

  const topCountries: CountryTrafficStat[] = Object.entries(countryMap)
    .map(([country, info]) => ({
      country,
      countryCode: info.code,
      flag: info.flag,
      visits: info.count,
      percentage: totalVisits > 0 ? Math.round((info.count / totalVisits) * 100) : 0,
    }))
    .sort((a, b) => b.visits - a.visits);

  // City calculations
  const cityMap: Record<string, { country: string; flag: string; count: number }> = {};
  visitors.forEach((v) => {
    if (!cityMap[v.city]) {
      cityMap[v.city] = { country: v.country, flag: v.flag, count: 0 };
    }
    cityMap[v.city].count += 1;
  });

  const topCities: CityTrafficStat[] = Object.entries(cityMap)
    .map(([city, info]) => ({
      city,
      country: info.country,
      flag: info.flag,
      visits: info.count,
      percentage: totalVisits > 0 ? Math.round((info.count / totalVisits) * 100) : 0,
    }))
    .sort((a, b) => b.visits - a.visits);

  return {
    totalVisits,
    uniqueVisitors: uniqueIps,
    topCountries,
    topCities,
    recentLogs: visitors.slice(0, 15),
  };
}

// ================= ANALYTICS =================

export function getAnalytics() {
  const totalProperties = db.properties.length;
  const publishedProperties = db.properties.filter((p) => p.status === 'published').length;
  const pendingSubmissions = db.properties.filter((p) => p.status === 'pending' || p.status === 'under_review').length;
  const totalLeads = db.leads.length;
  const totalAppointments = db.appointments.length;
  const totalViews = db.properties.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalInquiries = db.properties.reduce((sum, p) => sum + (p.inquiriesCount || 0), 0);

  const byArea: Record<string, number> = {};
  db.properties.forEach((p) => {
    byArea[p.location.area] = (byArea[p.location.area] || 0) + 1;
  });

  const byType: Record<string, number> = {};
  db.properties.forEach((p) => {
    const key = p.propertyType || p.category || (p as any).type || 'Plot';
    byType[key] = (byType[key] || 0) + 1;
  });

  return {
    totalProperties,
    publishedProperties,
    pendingSubmissions,
    totalLeads,
    totalAppointments,
    totalViews,
    totalInquiries,
    areaDistribution: Object.entries(byArea).map(([area, count]) => ({ area, count })),
    typeDistribution: Object.entries(byType).map(([type, count]) => ({ type, count })),
  };
}

// ================= CMS SITE CONTENT =================

export function getSiteContent(): SiteContent {
  if (!db.siteContent) {
    db.siteContent = { ...DEFAULT_SITE_CONTENT };
  } else {
    if (!db.siteContent.searchFilter) {
      db.siteContent.searchFilter = { ...DEFAULT_SITE_CONTENT.searchFilter };
    } else {
      if (!db.siteContent.searchFilter.locations || db.siteContent.searchFilter.locations.length === 0) {
        db.siteContent.searchFilter.locations = [...DEFAULT_SITE_CONTENT.searchFilter.locations];
      }
      if (!db.siteContent.searchFilter.propertyTypes || db.siteContent.searchFilter.propertyTypes.length === 0) {
        db.siteContent.searchFilter.propertyTypes = [...DEFAULT_SITE_CONTENT.searchFilter.propertyTypes];
      }
      if (!db.siteContent.searchFilter.priceRanges || db.siteContent.searchFilter.priceRanges.length === 0) {
        db.siteContent.searchFilter.priceRanges = [...DEFAULT_SITE_CONTENT.searchFilter.priceRanges];
      }
      if (!db.siteContent.searchFilter.bedrooms || db.siteContent.searchFilter.bedrooms.length === 0) {
        db.siteContent.searchFilter.bedrooms = [...DEFAULT_SITE_CONTENT.searchFilter.bedrooms];
      }
    }
    if (!db.siteContent.footer) {
      db.siteContent.footer = { ...DEFAULT_SITE_CONTENT.footer };
    } else {
      if (!db.siteContent.footer.trustBadges || db.siteContent.footer.trustBadges.length === 0) {
        db.siteContent.footer.trustBadges = [...DEFAULT_SITE_CONTENT.footer.trustBadges];
      }
      if (!db.siteContent.footer.exploreLinks || db.siteContent.footer.exploreLinks.length === 0) {
        db.siteContent.footer.exploreLinks = [...DEFAULT_SITE_CONTENT.footer.exploreLinks];
      }
      if (!db.siteContent.footer.primeLocationLinks || db.siteContent.footer.primeLocationLinks.length === 0) {
        db.siteContent.footer.primeLocationLinks = [...DEFAULT_SITE_CONTENT.footer.primeLocationLinks];
      }
      if (!db.siteContent.footer.legalLinks || db.siteContent.footer.legalLinks.length === 0) {
        db.siteContent.footer.legalLinks = [...DEFAULT_SITE_CONTENT.footer.legalLinks];
      }
    }
  }
  return db.siteContent;
}

export function updateSiteContent(updates: Partial<SiteContent>): SiteContent {
  if (!db.siteContent) {
    db.siteContent = { ...DEFAULT_SITE_CONTENT };
  }

  db.siteContent = {
    ...db.siteContent,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return db.siteContent;
}

// ================= MAP / MASTER PLAN METHODS =================

export function getMaps(society?: string): MasterPlanMap[] {
  if (!db.maps || db.maps.some((m) => m.id === 'map-mpchs-b17-master' || m.id === 'map-faisal-town-phase1')) {
    db.maps = [...INITIAL_MAPS];
  }
  let result = [...db.maps];
  if (society && society !== 'all') {
    const q = society.toLowerCase();
    if (q === 'other') {
      const primes = ['mpchs', 'faisal', 'bahria'];
      result = result.filter(
        (m) =>
          m.society.toLowerCase().includes('other') ||
          !primes.some((pr) => m.society.toLowerCase().includes(pr))
      );
    } else {
      result = result.filter((m) => m.society.toLowerCase().includes(q));
    }
  }
  const f2024 = result.find((m) => m.id === 'map-faisal-hills-2024');
  const rest = result.filter((m) => m.id !== 'map-faisal-hills-2024');
  return f2024 ? [f2024, ...rest] : result;
}

export function getMapById(id: string): MasterPlanMap | undefined {
  return (db.maps || []).find((m) => m.id === id);
}

export function createMap(
  data: Omit<MasterPlanMap, 'id' | 'createdAt' | 'updatedAt' | 'downloadsCount'>
): MasterPlanMap {
  const newMap: MasterPlanMap = {
    ...data,
    id: `map-${Date.now()}`,
    downloadsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!db.maps) db.maps = [];
  db.maps.unshift(newMap);
  return newMap;
}

export function deleteMap(id: string): boolean {
  if (!db.maps) return false;
  const initialLen = db.maps.length;
  db.maps = db.maps.filter((m) => m.id !== id);
  return db.maps.length < initialLen;
}

