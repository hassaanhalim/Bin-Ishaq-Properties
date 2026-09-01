export interface SocietyLocation {
  id: string;
  name: string;
  slug: string;
  developer: string;
  city: string;
  region: string;
  description: string;
  image: string;
  categories: string[];
  sectors?: string[];
  featured?: boolean;
}

export const HOUSING_SOCIETIES: SocietyLocation[] = [
  {
    id: 'soc-mpchs-b17',
    name: 'MPCHS Multi Gardens B-17',
    slug: 'mpchs-multi-gardens-b17',
    developer: 'MPCHS',
    city: 'Islamabad',
    region: 'Islamabad / Rawalpindi',
    description:
      'Premier master-planned cooperative society located at the foot of Margalla Hills with direct access from GT Road and M-1 Motorway interchange. Renowned for top-tier infrastructure and continuous capital growth.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    categories: ['Residential Plots', 'Houses', 'Commercial Plots', 'Apartments', 'Shops'],
    sectors: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G'],
    featured: true,
  },
  {
    id: 'soc-faisal-town',
    name: 'Faisal Town Islamabad',
    slug: 'faisal-town-islamabad',
    developer: 'ZEDEM International',
    city: 'Islamabad',
    region: 'Islamabad / Rawalpindi',
    description:
      'Iconic development near New Islamabad International Airport and M-2 Motorway interchange, renowned for unmatched development speed, solid ground possession, and thriving commercial centers.',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    categories: ['Residential Plots', 'Commercial Plots', 'Houses', 'Shops', 'Offices'],
    sectors: ['Sector A', 'Sector B', 'Sector C', 'Executive Block'],
    featured: true,
  },
  {
    id: 'soc-faisal-town-phase2',
    name: 'Faisal Town Phase 2',
    slug: 'faisal-town-phase-2',
    developer: 'ZEDEM International',
    city: 'Islamabad',
    region: 'Islamabad / Rawalpindi',
    description:
      'Mega expansion located along the M-2 Thalian Interchange and Chakri corridor, offering high-yield residential plots, commercial avenues, and high-demand investment files.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    categories: ['Residential Plots', 'Commercial Avenue Plots', 'Investment Files', 'Retail Shops'],
    sectors: ['General Block', 'Overseas Block', 'Executive Block', 'Commercial Hub'],
    featured: true,
  },
  {
    id: 'soc-faisal-hills',
    name: 'Faisal Hills Islamabad',
    slug: 'faisal-hills-islamabad',
    developer: 'ZEDEM International',
    city: 'Islamabad / Taxila Region',
    region: 'Islamabad / Rawalpindi',
    description:
      'Nestled against picturesque Margalla Hills along Main GT Road N-5, Faisal Hills offers scenic residential living, wide carpeted boulevards, executive commercial plazas, and rapid possession delivery.',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    categories: ['Residential Plots', 'Commercial Plots', 'Ready Villas', 'Apartments', 'Shops'],
    sectors: ['Executive Block', 'Block A', 'Block B', 'Block C', 'Block D'],
    featured: true,
  },
  {
    id: 'soc-bahria-isb-rwp',
    name: 'Bahria Town Islamabad / Rawalpindi',
    slug: 'bahria-town-islamabad-rawalpindi',
    developer: 'Bahria Town',
    city: 'Islamabad / Rawalpindi',
    region: 'Islamabad / Rawalpindi',
    description:
      'Pakistan’s benchmark master-planned gated community featuring civic infrastructure, continuous 24/7 utilities, international schools, hospitals, commercial plazas, and luxury apartments.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    categories: ['Villas & Houses', 'Apartments & Penthouses', 'Commercial Plots', 'Shops & Offices'],
    sectors: ['Phase 1 to 8', 'Safari Villas', 'Civic Center Phase 4', 'Bahria Enclave'],
    featured: true,
  },
  {
    id: 'soc-other',
    name: 'Other Societies & Areas',
    slug: 'other',
    developer: 'Verified Private Sellers & Developers',
    city: 'Islamabad, Rawalpindi & Nationwide',
    region: 'All Regions',
    description:
      'Verified residential plots, luxury villas, commercial units, and investment opportunities in other recognized sectors and housing schemes across Pakistan.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    categories: ['Residential Plots', 'Houses', 'Commercial Plots', 'Apartments', 'Shops'],
    sectors: ['Custom Sector / Area'],
    featured: true,
  },
];
