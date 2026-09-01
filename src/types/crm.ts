export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'viewing_scheduled'
  | 'negotiation'
  | 'closed'
  | 'lost';

export type LeadSource = 'website_inquiry' | 'whatsapp' | 'call' | 'visit_request' | 'chat_assistant';

export interface LeadActivity {
  id: string;
  type: 'note' | 'status_change' | 'call_log' | 'viewing' | 'offer';
  message: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  interestedPropertyId?: string;
  interestedPropertyTitle?: string;
  interestedArea?: string;
  budgetMax?: number;
  notes?: string;
  activities: LeadActivity[];
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
}

export interface VisitorLog {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  pageVisited: string;
  timestamp: string;
  ip: string;
}

export interface CountryTrafficStat {
  country: string;
  countryCode: string;
  flag: string;
  visits: number;
  percentage: number;
}

export interface CityTrafficStat {
  city: string;
  country: string;
  flag: string;
  visits: number;
  percentage: number;
}

export interface GeographicAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  topCountries: CountryTrafficStat[];
  topCities: CityTrafficStat[];
  recentLogs: VisitorLog[];
}
