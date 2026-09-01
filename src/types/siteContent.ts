export interface SiteHeroContent {
  title: string;
  highlightText: string;
  subtitle: string;
  bgImageUrl: string;
  ctaText: string;
}

export interface SiteCompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface WhyChoosePoint {
  id: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface DealerMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  phone?: string;
  email?: string;
}

export interface AboutPageContent {
  eyebrow: string;
  heading: string;
  storyP1: string;
  storyP2: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  dealers?: DealerMember[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchFilterContent {
  locations: FilterOption[];
  propertyTypes: FilterOption[];
  priceRanges: FilterOption[];
  bedrooms: FilterOption[];
}

export interface FooterTrustBadge {
  id: string;
  title: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  brandDescription: string;
  trustBadges: FooterTrustBadge[];
  exploreLinks: FooterLink[];
  primeLocationLinks: FooterLink[];
  copyrightText: string;
  legalLinks: FooterLink[];
}

export interface SiteContent {
  hero: SiteHeroContent;
  company: SiteCompanyInfo;
  whyChoose: {
    eyebrow: string;
    heading: string;
    description: string;
    points: WhyChoosePoint[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    items: TestimonialItem[];
  };
  offices: OfficeLocation[];
  about: AboutPageContent;
  searchFilter: SearchFilterContent;
  footer: FooterContent;
  updatedAt: string;
}
