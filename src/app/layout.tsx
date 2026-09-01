import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileQuickBar from '@/components/layout/MobileQuickBar';
import BookingModal from '@/components/modals/BookingModal';
import InquiryModal from '@/components/modals/InquiryModal';
import VisitorTracker from '@/components/common/VisitorTracker';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-logo',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#071426',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://binishaqproperties.com'),
  title: {
    default: 'Bin Ishaq Properties | Authorized Housing Societies Dealer & Advisory',
    template: '%s | Bin Ishaq Properties',
  },
  description:
    'Bin Ishaq Properties — Authorized dealer for MPCHS Multi Gardens B-17, Faisal Town, Faisal Town Phase 2, Faisal Hills, and Bahria Town Islamabad & Rawalpindi. Verified residential plots, commercial avenues, and luxury residences.',
  keywords: [
    'Bin Ishaq Properties',
    'MPCHS Multi Gardens B-17',
    'Faisal Town Islamabad',
    'Faisal Town Phase 2',
    'Faisal Hills Islamabad',
    'Bahria Town Rawalpindi',
    'plots for sale Islamabad',
    'commercial plots B-17',
    'real estate dealer Islamabad',
    'authorized property dealer Pakistan',
  ],
  authors: [{ name: 'Bin Ishaq Properties & Advisory' }],
  creator: 'Bin Ishaq Properties',
  publisher: 'Bin Ishaq Properties',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://binishaqproperties.com',
    siteName: 'Bin Ishaq Properties',
    title: 'Bin Ishaq Properties | Authorized Dealer & Real Estate Advisory',
    description:
      'Verified plots, transparent developer transfers, and luxury residences across MPCHS B-17, Faisal Town, Faisal Hills, and Bahria Town.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Bin Ishaq Properties Luxury Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bin Ishaq Properties | Authorized Dealer & Real Estate Advisory',
    description:
      'Verified plots, transparent developer transfers, and luxury residences across Islamabad & Rawalpindi prime housing societies.',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF8F3] text-slate-900 antialiased flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
        <StoreProvider>
          <VisitorTracker />
          <Navbar />
          <main className="flex-1 pb-16 sm:pb-0">{children}</main>
          <Footer />
          <MobileQuickBar />
          <BookingModal />
          <InquiryModal />
        </StoreProvider>
      </body>
    </html>
  );
}
