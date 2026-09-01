'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { PropertySnippet } from '@/types/chat';
import {
  Sparkles,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: PropertySnippet[];
  timestamp: string;
}

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'ai-welcome',
    sender: 'ai',
    text: 'Welcome to Bin Ishaq Real Estate! I am your AI property advisor. Ask me anything like "Find 5 bedroom villas in DHA Phase 6" or "Penthouses in Crescent Bay":',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function AIAssistantWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json();

      if (data.success) {
        const aiReply: AIMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          recommendations: data.recommendations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: 'I could not find an exact match for that specific inquiry. Please try searching for villas in DHA, penthouses in Clifton, or plots in Bahria.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Our AI concierge is connecting. Please feel free to reach out directly via WhatsApp for immediate support.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 gold-gradient-button px-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-xs sm:text-sm text-[#071426] cursor-pointer"
        aria-label="Open Bin Ishaq Assistant"
      >
        <Sparkles className="w-4 h-4 text-[#071426]" />
        <span className="font-bold tracking-wide">Bin Ishaq Assistant</span>
        <span className="relative flex h-2.5 w-2.5 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
      </button>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-96 max-h-[580px] bg-[#071426] border border-amber-400/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#0b1c33] border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 p-[1px]">
                <div className="w-full h-full bg-[#071426] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-serif">
                  Bin Ishaq AI Assistant
                </h4>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live Property Search (PKR)
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[360px] text-xs text-zinc-200">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                    msg.sender === 'user'
                      ? 'gold-gradient-button font-medium rounded-tr-none text-[#071426]'
                      : 'bg-[#0f243e] border border-white/10 text-zinc-100 rounded-tl-none leading-relaxed'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                      {msg.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="bg-[#071426] border border-white/10 hover:border-amber-400/50 rounded-xl p-2 flex items-center gap-2.5 transition"
                        >
                          <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                            <Image
                              src={rec.image}
                              alt={rec.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/properties/${rec.id}`}
                              onClick={() => setIsOpen(false)}
                              className="font-serif font-bold text-white hover:text-amber-300 truncate block text-[11px]"
                            >
                              {rec.title}
                            </Link>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {rec.location}
                            </p>
                            <p className="text-[11px] font-bold text-amber-400 font-serif">
                              {rec.priceDisplay || (rec.price ? formatPrice(rec.price) : 'Call for Rate')}
                            </p>
                          </div>

                          <Link
                            href={`/properties/${rec.id}`}
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg bg-[#0f243e] text-amber-400 hover:bg-amber-400 hover:text-[#071426] transition shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-[#071426]/70' : 'text-zinc-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-1.5 bg-[#0b1c33]/80 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Show me 5 Bed Villas in DHA')}
              className="shrink-0 bg-white/5 hover:bg-white/10 hover:text-amber-300 text-zinc-300 px-2.5 py-1 rounded-full transition"
            >
              5 Bed Villas DHA
            </button>
            <button
              onClick={() => handleSend('Penthouses in Crescent Bay')}
              className="shrink-0 bg-white/5 hover:bg-white/10 hover:text-amber-300 text-zinc-300 px-2.5 py-1 rounded-full transition"
            >
              Sea View Penthouses
            </button>
            <button
              onClick={() => handleSend('Apartments for rent in PKR')}
              className="shrink-0 bg-white/5 hover:bg-white/10 hover:text-amber-300 text-zinc-300 px-2.5 py-1 rounded-full transition"
            >
              Executive Rentals
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-[#0b1c33] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for villas, prices in Crore, locations..."
              className="flex-1 bg-[#071426] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl gold-gradient-button disabled:opacity-50 transition cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5 text-[#071426]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
