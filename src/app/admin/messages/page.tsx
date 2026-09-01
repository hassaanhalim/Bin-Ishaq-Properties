'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Conversation } from '@/types/chat';
import { formatDate } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  MessageSquare,
  Send,
  User,
  Building,
  CheckCheck,
  ArrowLeft,
  Phone,
} from 'lucide-react';

export default function AdminMessagesPage() {
  const { showToast } = useStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat');
      const data = await res.json();
      if (data.data) {
        setConversations(data.data);
        if (!activeConvId && data.data.length > 0) {
          setActiveConvId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, mobileShowChat]);

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setMobileShowChat(true);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !replyText.trim()) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          sender: 'admin',
          senderName: 'Senior Broker (Office)',
          text: replyText,
        }),
      });

      if (res.ok) {
        setReplyText('');
        showToast('Reply dispatched to client');
        fetchConversations();
      }
    } catch {
      showToast('Error sending reply');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Real-Time Communications
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Client Inquiries &amp; Live Chat Desk
          </h1>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 bg-[#0B1320] border border-slate-800 rounded-2xl overflow-hidden min-h-[600px] shadow-2xl">
        {/* Left: Conversation List (Hidden on mobile when chat is open) */}
        <div
          className={`border-r border-slate-800 p-4 space-y-3 bg-[#070D18] ${
            mobileShowChat ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between px-2 pb-1">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Active Threads ({conversations.length})
            </h4>
          </div>

          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No inquiries received yet.
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition min-h-[56px] ${
                    activeConvId === conv.id
                      ? 'bg-[#141E30] border-white text-white shadow-md'
                      : 'bg-[#0B1320] border-slate-800 text-slate-400 hover:bg-[#141E30] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-xs font-bold text-white truncate">
                      {conv.customerName}
                    </h5>
                    <span className="text-[9px] text-slate-400 shrink-0">
                      {formatDate(conv.lastMessageTime)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 truncate">
                    {conv.lastMessage}
                  </p>

                  {conv.propertyTitle && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <Building className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{conv.propertyTitle}</span>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Chat Console (Full screen on mobile when open) */}
        <div
          className={`lg:col-span-2 flex flex-col justify-between h-full bg-[#0B1320] ${
            !mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Top Chat Bar with Mobile Back Button */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#0B1320] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="lg:hidden min-w-[40px] min-h-[40px] rounded-xl bg-[#141E30] text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shrink-0"
                    aria-label="Back to threads list"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-white truncate">
                      {activeConv.customerName}
                    </h4>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {activeConv.propertyTitle || 'General Advisory Discussion'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md shrink-0">
                  Live Desk
                </span>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[500px]">
                {activeConv.messages?.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1">
                        {isAdmin ? 'Senior Advisor' : activeConv.customerName}
                      </span>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-white text-[#0B1320] font-medium shadow-md'
                            : 'bg-[#141E30] text-slate-200 border border-slate-700'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Bar */}
              <form
                onSubmit={handleSendReply}
                className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#070D18] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type an executive response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="min-h-[44px] min-w-[44px] bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition flex items-center justify-center gap-1.5 cursor-pointer shadow shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-8">
              Select a conversation thread to view message history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
