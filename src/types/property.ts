export type PropertyPurpose = 'buy' | 'rent';

export type PropertyCategory =
  | 'plot'
  | 'house'
  | 'apartment'
  | 'commercial'
  | 'shop'
  | 'office'
  | 'file';

export type PropertyType =
  | 'plot'
  | 'house'
  | 'villa'
  | 'apartment'
  | 'penthouse'
  | 'office'
  | 'shop'
  | 'file'
  | 'commercial';

export type PropertyStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'sold'
  | 'rented';

export type AreaUnit = 'sqft' | 'marla' | 'kanal' | 'sqyd';

export interface PropertyLocation {
  city: string; // e.g. Islamabad, Rawalpindi
  area: string; // e.g. Sector B, Block C, Phase 4
  society: string; // e.g. MPCHS Multi Gardens B-17, Faisal Town, Faisal Hills, Bahria Town
  address: string;
  lat?: number;
  lng?: number;
  nearbyPlaces?: {
    name: string;
    type: 'school' | 'hospital' | 'shopping' | 'airport' | 'park' | 'mosque';
    distance: string;
  }[];
}

export interface PropertySpecs {
  bedrooms?: number;
  bathrooms?: number;
  areaSize: number;
  areaUnit: AreaUnit;
  parkingSpaces?: number;
  buildYear?: number;
  floors?: number;
  furnished?: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
}

export interface PropertyAttributes {
  plotSize?: string; // e.g. '5 Marla', '8 Marla', '10 Marla', '1 Kanal'
  plotType?: 'residential' | 'commercial' | 'corner' | 'park_facing' | 'main_boulevard';
  commercialType?: 'commercial_plot' | 'plaza_plot' | 'avenue_plot' | 'shop' | 'office';
  size?: string; // e.g. '5 Marla', '10 Marla', '1 Kanal', '450 Sq Ft'
  status?: string; // e.g. 'Allocation File', 'Balloted File', 'Open File'
  bedrooms?: number;
  bathrooms?: number;
  area?: string; // e.g. '5 Marla', '10 Marla', '1 Kanal', '1,250 Sq Ft'
  floor?: string | number; // e.g. 'Ground Floor', '2nd Floor', 'Penthouse Level'
  floors?: number; // e.g. 2, 3
  furnished?: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  possessionStatus?: 'possession' | 'non_possession' | 'under_development' | 'balloted';
}

export interface PropertySubmitter {
  name: string;
  phone: string;
  email: string;
  role: 'owner' | 'agent' | 'admin';
}

export interface Property {
  id: string;
  title: string;
  titleUrdu?: string;
  slug?: string;
  society: string; // 'MPCHS Multi Gardens B-17' | 'Faisal Town' | 'Faisal Town Phase 2' | 'Faisal Hills' | 'Bahria Town Islamabad / Rawalpindi'
  developer: string; // 'MPCHS' | 'ZEDEM International' | 'Bahria Town'
  city: string; // 'Islamabad' | 'Rawalpindi' | 'Taxila / Islamabad Region'
  propertyType: string; // e.g. 'Residential Plot', 'Commercial Plot', 'House', 'Apartment', 'Shop', 'Office', 'File'
  type?: PropertyType | string;
  category: PropertyCategory;
  purpose: PropertyPurpose;
  price: number; // in PKR
  priceDisplay?: string; // e.g. "PKR 65.00 Lakh", "PKR 1.85 Crore"
  description: string;
  descriptionUrdu?: string;
  location: PropertyLocation;
  specs: PropertySpecs;
  attributes: PropertyAttributes;
  features?: string[];
  images: string[];
  featuredImage?: string;
  videoTourUrl?: string;
  virtualTourUrl?: string;
  isFeatured?: boolean;
  isHot?: boolean;
  isVerified?: boolean;
  status: PropertyStatus;
  rejectionReason?: string;
  submittedBy?: PropertySubmitter;
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
  inquiriesCount?: number;
  documents?: { name: string; url: string }[];
}

export interface PropertyFilterParams {
  purpose?: PropertyPurpose | 'all';
  category?: PropertyCategory | 'all';
  type?: PropertyType | string | 'all';
  society?: string;
  developer?: string;
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  areaUnit?: AreaUnit;
  minArea?: number;
  maxArea?: number;
  sizeRange?: string;
  features?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  isFeatured?: boolean;
}
