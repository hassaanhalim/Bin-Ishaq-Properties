import { AreaUnit, PropertyPurpose, PropertyType } from './property';

export interface PropertySubmissionForm {
  // Submitter details
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  submitterRole: 'owner' | 'agent';

  // Basic Property Info
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: string | number;

  // Location
  city: string;
  area: string;
  society?: string;
  address: string;

  // Specifications
  bedrooms: number;
  bathrooms: number;
  areaSize: string | number;
  areaUnit: AreaUnit;
  parkingSpaces: number;
  buildYear?: string | number;
  furnished: 'unfurnished' | 'semi-furnished' | 'fully-furnished';

  // Details & Amenities
  description: string;
  features: string[];

  // Uploaded media & documents
  images: string[];
  documents: { name: string; url: string }[];
  agreeToTerms: boolean;
}
