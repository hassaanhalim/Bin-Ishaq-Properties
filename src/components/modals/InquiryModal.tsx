'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  MessageSquare,
  Phone,
  Mail,
  User,
  X,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function InquiryModal() {
  const {
    activeInquiryProperty,
    closeInquiryModal,
    currency,
    showToast,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Hello, I am interested in this property. Please send me more details and arrange a callback.');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!activeInquiryProperty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('Please provide your name and phone number');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: `conv-${phone.replace(/\D/g, '')}`,
          sender: 'customer',
          senderName: name,
          text: message,
          propertyContext: {
            id: activeInquiryProperty.id,
            title: activeInquiryProperty.title,
            price: activeInquiryProperty.price || 0,
            location: `${activeInquiryProperty.location.area}, ${activeInquiryProperty.location.city}`,
            image: activeInquiryProperty.featuredImage,
            type: activeInquiryProperty.propertyType || activeInquiryProperty.category,
            bedrooms: activeInquiryProperty.specs?.bedrooms || 0,
          },
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        showToast('Inquiry sent to office!');
      }
    } catch {
      showToast('Error sending message. Please contact via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={closeInquiryModal}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      <div className="relative w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        <button
          onClick={closeInquiryModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              Message Delivered
            </h3>
            <p className="text-xs text-zinc-300">
              Our agent for <strong className="text-white">{activeInquiryProperty.title}</strong> will reply directly to <strong className="text-amber-400">{phone}</strong>.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                closeInquiryModal();
              }}
              className="bg-amber-400 text-zinc-950 font-bold px-6 py-2.5 rounded-full text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block mb-1">
                Direct Contact
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Send Office Inquiry
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-zinc-900/90 border border-white/10 p-3 rounded-2xl">
              <div className="relative w-14 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                <Image
                  src={activeInquiryProperty.featuredImage || activeInquiryProperty.images[0]}
                  alt={activeInquiryProperty.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-semibold text-white truncate">
                  {activeInquiryProperty.title}
                </h4>
                <p className="text-[11px] font-bold text-amber-400 font-serif">
                  {activeInquiryProperty.priceDisplay || (activeInquiryProperty.price ? formatPrice(activeInquiryProperty.price, currency, activeInquiryProperty.purpose === 'rent') : 'Call for Rate')}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="Ahmed Raza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-zinc-400 block mb-1">
                Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
