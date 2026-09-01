'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency } from './utils';
import { Language, TRANSLATIONS } from './translations';
import { Property } from '@/types/property';

export type UserRole = 'guest' | 'user' | 'admin';

interface StoreContextType {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: typeof TRANSLATIONS.en;
  isUrdu: boolean;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string) => void;
  isPropertySaved: (id: string) => boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeBookingProperty: Property | null;
  openBookingModal: (property: Property) => void;
  closeBookingModal: () => void;
  activeInquiryProperty: Property | null;
  openInquiryModal: (property: Property) => void;
  closeInquiryModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>('PKR');
  const [language, setLanguage] = useState<Language>('en');
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [activeBookingProperty, setActiveBookingProperty] = useState<Property | null>(null);
  const [activeInquiryProperty, setActiveInquiryProperty] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate saved properties from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('real_estate_saved_props');
      if (saved) {
        setSavedPropertyIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        showToast('Removed from saved properties');
      } else {
        updated = [...prev, id];
        showToast('Added to saved properties');
      }
      try {
        localStorage.setItem('real_estate_saved_props', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isPropertySaved = (id: string) => savedPropertyIds.includes(id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  return (
    <StoreContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        t,
        isUrdu,
        savedPropertyIds,
        toggleSaveProperty,
        isPropertySaved,
        userRole,
        setUserRole,
        activeBookingProperty,
        openBookingModal: (p) => setActiveBookingProperty(p),
        closeBookingModal: () => setActiveBookingProperty(null),
        activeInquiryProperty,
        openInquiryModal: (p) => setActiveInquiryProperty(p),
        closeInquiryModal: () => setActiveInquiryProperty(null),
        toastMessage,
        showToast,
      }}
    >
      <div dir={isUrdu ? 'rtl' : 'ltr'} className={isUrdu ? 'font-urdu' : ''}>
        {children}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-950/95 text-white border border-amber-500/30 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            {toastMessage}
          </div>
        )}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
