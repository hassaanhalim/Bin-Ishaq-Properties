'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PropertyPurpose, PropertyType, AreaUnit } from '@/types/property';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
  Plus,
  Trash2,
  Coins,
  MapPin,
  Home,
  FileText,
  Search,
  ChevronDown,
  Check,
  Building,
  UserCheck,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { uploadPropertyImage } from '@/lib/supabase/storage';

export const PAKISTAN_CITIES = [
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Quetta',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Sialkot',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Hyderabad',
  'Sukkur',
  'Mardan',
  'Wah Cantt',
  'Taxila',
  'Gujrat',
  'Jhelum',
  'Rahim Yar Khan',
  'Sheikhupura',
  'Jhang',
  'Larkana',
  'Kasur',
  'Sahiwal',
  'Okara',
  'Chiniot',
  'Kamoke',
  'Hafizabad',
  'Muzaffargarh',
  'Mirpur Khas',
  'Khanewal',
  'Dera Ghazi Khan',
  'Nawabshah',
  'Mansehra',
  'Mingora (Swat)',
  'Attock',
  'Chakwal',
  'Kohat',
  'Bannu',
  'Dera Ismail Khan',
  'Hub',
  'Turbat',
  'Gwadar',
  'Mirpur (AJK)',
  'Muzaffarabad (AJK)',
  'Gilgit',
  'Skardu',
  'Kotli (AJK)',
  'Kharian',
  'Haripur',
  'Nowshera',
  'Swabi',
  'Burewala',
];

export const PRIME_SOCIETY_DATA: Record<
  string,
  { developer: string; defaultCity: string; sectors: string[] }
> = {
  'MPCHS Multi Gardens B-17': {
    developer: 'MPCHS',
    defaultCity: 'Islamabad',
    sectors: ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G', 'Other Block / Sector'],
  },
  'Faisal Town Islamabad': {
    developer: 'ZEDEM International',
    defaultCity: 'Islamabad',
    sectors: ['Sector A', 'Sector B', 'Sector C', 'Executive Block', 'Other Sector'],
  },
  'Faisal Town Phase 2': {
    developer: 'ZEDEM International',
    defaultCity: 'Islamabad',
    sectors: ['General Block', 'Overseas Block', 'Executive Block', 'Commercial Hub', 'Other Block'],
  },
  'Faisal Hills Islamabad': {
    developer: 'ZEDEM International',
    defaultCity: 'Islamabad / Taxila Region',
    sectors: ['Executive Block', 'Block A', 'Block B', 'Block C', 'Block D', 'Other Block'],
  },
  'Bahria Town Islamabad / Rawalpindi': {
    developer: 'Bahria Town',
    defaultCity: 'Rawalpindi',
    sectors: [
      'Phase 1',
      'Phase 2',
      'Phase 3',
      'Phase 4',
      'Phase 5',
      'Phase 6',
      'Phase 7',
      'Phase 8',
      'Safari Villas',
      'Civic Center Phase 4',
      'Bahria Enclave',
      'Other Phase / Sector',
    ],
  },
  'Other': {
    developer: 'Verified Private / Authorized Developer',
    defaultCity: 'Islamabad',
    sectors: ['Custom Sector / Area'],
  },
};

const AVAILABLE_AMENITIES = [
  '24/7 Security & CCTV',
  'Solar Hybrid + Backup Generator',
  'Private Swimming Pool',
  'Lush Landscaped Lawn',
  'Smart Home Automation',
  'Italian Open-Concept Kitchen',
  'Dedicated Servant Quarters',
  'Jacuzzi & Spa Bath',
  'Elevator in Villa',
];

function SubmitPropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useStore();

  const isAdminSource = searchParams?.get('source') === 'admin';
  const submitterRole: 'owner' | 'agent' = isAdminSource ? 'agent' : 'owner';

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState<string | null>(null);

  // Form state
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user_session');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.email || parsed.name)) {
              setCurrentUser(parsed);
              if (parsed.name) setOwnerName((prev) => prev || parsed.name);
              if (parsed.email) setOwnerEmail((prev) => prev || parsed.email);
              if (parsed.phone) setOwnerPhone((prev) => prev || parsed.phone);
            } else {
              setCurrentUser(null);
            }
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setAuthChecked(true);
      }
    };

    checkAuth();
    window.addEventListener('focus', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [type, setType] = useState<PropertyType>('plot');
  const [price, setPrice] = useState('');

  // Location state
  const [society, setSociety] = useState('MPCHS Multi Gardens B-17');
  const [sector, setSector] = useState('Block F');
  const [customSector, setCustomSector] = useState('');
  const [customSocietyName, setCustomSocietyName] = useState('');

  // Searchable City state
  const [city, setCity] = useState('Islamabad');
  const [citySearch, setCitySearch] = useState('');
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [address, setAddress] = useState('');

  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [areaSize, setAreaSize] = useState('5');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('marla');
  const [parkingSpaces, setParkingSpaces] = useState(1);
  const [furnished, setFurnished] = useState<'unfurnished' | 'semi-furnished' | 'fully-furnished'>('unfurnished');

  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '24/7 Security & CCTV',
    'Solar Hybrid + Backup Generator',
  ]);

  // Images start 100% empty (no pre-filled demo images)
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const isOtherSociety = society === 'Other';
  const availableSectors = PRIME_SOCIETY_DATA[society]?.sectors || ['Custom Sector / Area'];

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  // Device file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select valid image files');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !images.includes(result)) {
          setImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && !images.includes(result)) {
            setImages((prev) => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const addImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages((prev) => [...prev, url]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !ownerName || !ownerPhone) {
      showToast('Please fill out all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const finalSociety = isOtherSociety
        ? customSocietyName.trim() || 'Other Societies & Areas'
        : society;
      
      const finalSectorName = isOtherSociety
        ? customSector.trim() || 'General Block'
        : sector.includes('Other') && customSector.trim()
        ? customSector.trim()
        : sector;

      const finalArea = isOtherSociety
        ? `${customSocietyName.trim() || 'Other Area'}${customSector.trim() ? `, ${customSector.trim()}` : ''}`
        : `${society} — ${finalSectorName}`;

      const finalDeveloper = isOtherSociety
        ? 'Verified Private / Authorized Developer'
        : PRIME_SOCIETY_DATA[society]?.developer || 'Authorized Developer';

      // Upload local images to Supabase storage bucket
      const uploadedImageUrls: string[] = [];
      for (const img of images) {
        if (img.startsWith('data:image')) {
          try {
            const cdnUrl = await uploadPropertyImage(img);
            uploadedImageUrls.push(cdnUrl);
          } catch {
            uploadedImageUrls.push(img);
          }
        } else {
          uploadedImageUrls.push(img);
        }
      }

      const finalImages =
        uploadedImageUrls.length > 0
          ? uploadedImageUrls
          : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

      const payload = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        society: finalSociety,
        developer: finalDeveloper,
        city,
        propertyType: type,
        category: (type === 'plot'
          ? 'plot'
          : type === 'file'
          ? 'file'
          : type === 'shop'
          ? 'shop'
          : type === 'commercial'
          ? 'commercial'
          : type === 'apartment' || type === 'penthouse'
          ? 'apartment'
          : 'house') as any,
        description:
          description ||
          `Verified property listing in ${finalArea}, ${city}. Clear title with complete documentation verified by Bin Ishaq Properties.`,
        price: Number(price),
        purpose,
        type,
        location: {
          city,
          area: finalArea,
          society: finalSociety,
          address: address || finalArea,
        },
        specs: {
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          areaSize: Number(areaSize),
          areaUnit,
          parkingSpaces: Number(parkingSpaces),
          furnished,
        },
        images: finalImages,
        featuredImage: finalImages[0],
        isFeatured: false,
        isVerified: isAdminSource,
        status: isAdminSource ? 'published' : 'pending',
        submittedBy: {
          name: ownerName,
          phone: ownerPhone,
          email: ownerEmail || `${ownerPhone.replace(/\D/g, '')}@binishaq.pk`,
          role: submitterRole,
        },
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.data) {
        setSubmittedPropertyId(data.data.id);
        setStep(5);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0B1320', '#d4af37', '#10b981'],
        });
        showToast(
          isAdminSource
            ? 'Listing published successfully to inventory!'
            : 'Property submitted for review by Direct Owner!'
        );
      }
    } catch {
      showToast('Error submitting listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading state while checking auth
  if (!isAdminSource && !authChecked) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Unauthenticated Gate for Public Visitors
  if (!isAdminSource && !currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] py-16 px-4 sm:px-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B1320] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              Direct Owner &amp; Seller Verification
            </span>
            <h1 className="text-2xl font-bold text-slate-950">
              Sign In to List Your Property
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To verify property ownership, ensure transparent direct transfers, and allow you to track buyer inquiries, please sign in or create an account before submitting.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login?redirect=/submit-property"
              className="w-full bg-[#0B1320] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/signup?redirect=/submit-property"
              className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-4 rounded-xl text-sm border border-slate-300 flex items-center justify-center gap-2 transition"
            >
              <span>Create New Investor Account</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Society Advisory Portal</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 py-12 px-4 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-blue-900 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-300 inline-block">
            {isAdminSource ? 'Brokerage Admin Inventory Entry' : 'Direct Seller & Owner Portal'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-900">
            {isAdminSource ? 'Add New Portfolio Inventory' : 'List Your Exclusive Property'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {isAdminSource
              ? 'Authorized Agent submission directly published to the Bin Ishaq verified catalog.'
              : 'Direct Property Owner listing submitted to Bin Ishaq advisory desk for high-net-worth investors.'}
          </p>
        </div>

        {/* Step Indicator */}
        {step < 5 && (
          <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Specs' },
              { num: 3, label: 'Location' },
              { num: 4, label: 'Visuals' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step === s.num
                      ? 'bg-[#0B1320] text-white shadow-md'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline ${
                    step === s.num ? 'font-bold text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step Form Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* STEP 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-xl font-bold tracking-[-0.02em] text-slate-900">
                  {isAdminSource ? 'Agent & Listing Manager Details' : 'Direct Owner Contact Details'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isAdminSource
                    ? 'Official brokerage representative managing this verified inventory file.'
                    : 'How our executive desk and verified buyers can reach you for inspections.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isAdminSource ? 'Listing Agent / Broker Name *' : 'Direct Owner Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAdminSource ? 'e.g. Tariq Bin Ishaq (Senior Agent)' : 'e.g. Tariq Mehmood'}
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      WhatsApp / Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="contact@binishaq.pk"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Submitter Role Notice Badge (Decision removed from UI) */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#0B1320] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">
                      {isAdminSource ? 'Role: Authorized Agent / Representative' : 'Role: Direct Property Owner'}
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      {isAdminSource
                        ? 'Directly managed by Bin Ishaq Properties brokerage desk.'
                        : 'Direct seller submission verified before publishing.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!ownerName || !ownerPhone) {
                      showToast('Please provide your name and phone number');
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-[#0B1320] hover:bg-black text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Continue to Property Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Specs & Pricing */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Property Category & Specifications
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify whether you are selling or renting, property type, and price.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Listing Purpose
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPurpose('buy')}
                      className={`py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        purpose === 'buy'
                          ? 'bg-[#0B1320] text-white border-[#0B1320]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      For Sale
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurpose('rent')}
                      className={`py-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        purpose === 'rent'
                          ? 'bg-[#0B1320] text-white border-[#0B1320]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      For Rent / Lease
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Property Category
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black font-semibold"
                    >
                      <option value="plot">Residential Plot</option>
                      <option value="file">Plot File / Booking</option>
                      <option value="villa">House / Villa</option>
                      <option value="apartment">Modern Apartment</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="commercial">Commercial Plot</option>
                      <option value="shop">Retail Shop</option>
                      <option value="office">Corporate Office</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Price in PKR *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 8500000 (85 Lakh)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Conditional House / Apartment Specs */}
                {(type === 'villa' || type === 'apartment' || type === 'penthouse') && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min={1}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Bathrooms</label>
                      <input
                        type="number"
                        min={1}
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Parking Spaces</label>
                      <input
                        type="number"
                        min={0}
                        value={parkingSpaces}
                        onChange={(e) => setParkingSpaces(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Furnishing</label>
                      <select
                        value={furnished}
                        onChange={(e) => setFurnished(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                      >
                        <option value="unfurnished">Unfurnished</option>
                        <option value="semi-furnished">Semi-Furnished</option>
                        <option value="fully-furnished">Fully Furnished</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Plot / Area Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Area / Plot Size</label>
                    <input
                      type="text"
                      value={areaSize}
                      onChange={(e) => setAreaSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-black"
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="sqft">Sq Ft</option>
                      <option value="sqyd">Sq Yd</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!price) {
                      showToast('Please enter an asking price');
                      return;
                    }
                    setStep(3);
                  }}
                  className="bg-[#0B1320] hover:bg-black text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Prime Societies + Other Location Selection */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Location & Housing Society Selection
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select from our authorized Prime Housing Societies or specify another area.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Prime Housing Society Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Housing Society / Project *
                  </label>
                  <select
                    value={society}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSociety(selected);
                      const sectors = PRIME_SOCIETY_DATA[selected]?.sectors || [];
                      if (sectors.length > 0) setSector(sectors[0]);
                      if (PRIME_SOCIETY_DATA[selected]?.defaultCity) {
                        setCity(PRIME_SOCIETY_DATA[selected].defaultCity);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-black"
                  >
                    <option value="MPCHS Multi Gardens B-17">MPCHS Multi Gardens B-17</option>
                    <option value="Faisal Town Islamabad">Faisal Town Islamabad</option>
                    <option value="Faisal Town Phase 2">Faisal Town Phase 2</option>
                    <option value="Faisal Hills Islamabad">Faisal Hills Islamabad</option>
                    <option value="Bahria Town Islamabad / Rawalpindi">Bahria Town Islamabad / Rawalpindi</option>
                    <option value="Other">Other Society / Sector / Area (Add Custom)</option>
                  </select>
                </div>

                {/* 2. If Prime Society: Select Sector / Block */}
                {!isOtherSociety ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Sector / Block in {society} *
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black font-semibold"
                      >
                        {availableSectors.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Specific Street / Block Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value)}
                        placeholder="e.g. Street 14, Near 40ft Main Boulevard"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                ) : (
                  /* 3. If "Other": Add Custom Society & Custom Sector */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">
                        Custom Society / Area Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customSocietyName}
                        onChange={(e) => setCustomSocietyName(e.target.value)}
                        placeholder="e.g. Gulberg Greens, DHA Phase 2, G-13"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">
                        Sector / Phase / Block Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value)}
                        placeholder="e.g. Executive Block, Sector B"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* 4. City Selector with Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      City in Pakistan *
                    </label>
                    <div
                      onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 flex items-center justify-between cursor-pointer focus-within:border-black"
                    >
                      <span className="font-semibold truncate">{city || 'Select City'}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isCityMenuOpen ? 'rotate-180 text-slate-900' : ''
                        }`}
                      />
                    </div>

                    {isCityMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 p-2 max-h-72 flex flex-col ring-1 ring-black/5">
                        <div className="relative mb-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search any city in Pakistan..."
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-0.5 max-h-48 pr-1">
                          {PAKISTAN_CITIES.filter((c) =>
                            c.toLowerCase().includes(citySearch.toLowerCase())
                          ).map((cityName) => (
                            <button
                              key={cityName}
                              type="button"
                              onClick={() => {
                                setCity(cityName);
                                setIsCityMenuOpen(false);
                                setCitySearch('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                city === cityName
                                  ? 'bg-[#0B1320] text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-black'
                              }`}
                            >
                              <span>{cityName}</span>
                              {city === cityName && <Check className="w-3.5 h-3.5 text-amber-300" />}
                            </button>
                          ))}
                          {PAKISTAN_CITIES.filter((c) =>
                            c.toLowerCase().includes(citySearch.toLowerCase())
                          ).length === 0 && (
                            <div className="text-center py-4 text-xs text-slate-400">
                              No city found matching &quot;{citySearch}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Street / Plot Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Plot # 412, Street 8"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Amenities Included:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_AMENITIES.map((am) => (
                      <button
                        key={am}
                        type="button"
                        onClick={() => toggleFeature(am)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition cursor-pointer ${
                          selectedFeatures.includes(am)
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span>{am}</span>
                        {selectedFeatures.includes(am) && (
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isOtherSociety && !customSocietyName.trim()) {
                      showToast('Please enter your custom society or area name');
                      return;
                    }
                    setStep(4);
                  }}
                  className="bg-[#0B1320] hover:bg-black text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Continue to Visuals &amp; Narrative</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Title, Narrative & Photos */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Headline &amp; Property Photos
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add an enticing headline and upload real property photos from your device.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Editorial Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Marla Solid Land Residential Plot — Sector B-17"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Detailed Narrative (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe architectural features, double-height ceilings, marble flooring, private pool, possession status, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Photo Upload & Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Property Gallery Photos ({images.length} Uploaded)
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      PNG, JPG, WEBP accepted
                    </span>
                  </div>

                  {/* Device File Upload Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 hover:border-[#071426] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-6 text-center transition cursor-pointer relative mb-4"
                  >
                    <input
                      type="file"
                      id="property-photo-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-slate-200 text-[#071426] flex items-center justify-center shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block sm:inline">
                          Click to select photos from your device
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline"> or drag &amp; drop</span>
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-sm">
                        Select multiple real photos from your phone, computer, or camera roll.
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Photos Grid Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {images.map((img, idx) => (
                        <div
                          key={img + idx}
                          className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm"
                        >
                          <Image
                            src={img}
                            alt={`Uploaded photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                              }}
                              className="p-1.5 bg-rose-600 rounded-md text-white transition hover:scale-110 shadow-lg cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 bg-[#071426] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Main Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Optional: Add via URL toggle */}
                  <div className="pt-1">
                    {!showUrlInput ? (
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(true)}
                        className="text-[11px] font-bold text-slate-600 hover:text-black flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Or add photo using direct Image URL</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL (https://...)"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            addImage(newImageUrl);
                            setShowUrlInput(false);
                          }}
                          className="px-4 py-2 bg-[#071426] text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(false)}
                          className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0B1320] hover:bg-black text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl shadow-xl disabled:opacity-50 transition cursor-pointer"
                >
                  {submitting
                    ? 'Submitting Property...'
                    : isAdminSource
                    ? 'Publish Listing to Catalog'
                    : 'Submit Property for Review'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success Confirmation Screen */}
          {step === 5 && (
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
                {isAdminSource ? 'Listing Published Live' : 'Submission Received • Direct Owner'}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900">
                {isAdminSource
                  ? 'Your Listing is Live on the Platform!'
                  : 'Your Property has been Submitted for Review!'}
              </h2>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Listing Reference ID:{' '}
                <strong className="text-amber-700 font-mono">{submittedPropertyId}</strong>.
                {isAdminSource
                  ? ' This property is now visible in the portfolio catalog and searchable by buyers.'
                  : ' Our editorial team will verify society demarcation and transfer records before publishing.'}
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/properties"
                  className="w-full sm:w-auto bg-[#0B1320] text-white font-bold px-8 py-3.5 rounded-xl text-xs shadow-lg hover:bg-black transition"
                >
                  Browse Portfolio
                </Link>
                <Link
                  href={isAdminSource ? '/admin/properties' : '/account'}
                  className="w-full sm:w-auto bg-white border border-slate-300 text-slate-900 font-bold px-8 py-3.5 rounded-xl text-xs hover:bg-slate-100 transition"
                >
                  {isAdminSource ? 'Go to Admin Inventory' : 'View in Client Account'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubmitPropertyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F3] py-20 text-center font-bold">Loading...</div>}>
      <SubmitPropertyForm />
    </Suspense>
  );
}
