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
} from 'lucide-react';

export default function AdminMessagesPage() {
  const { showToast } = useStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
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
  }, [activeConv?.messages]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Real-Time Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Client Inquiries & Live Chat Desk
          </h1>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 bg-[#0B1320] border border-slate-800 overflow-hidden min-h-[600px]">
        {/* Left Conversation List */}
        <div className="border-r border-slate-800 p-4 space-y-3 bg-[#070D18]">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 px-2">
            Active Threads ({conversations.length})
          </h4>

          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 border cursor-pointer transition ${
                  activeConvId === conv.id
                    ? 'bg-[#141E30] border-white text-white'
                    : 'bg-[#0B1320] border-slate-800 text-slate-400 hover:bg-[#141E30]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-bold text-white truncate">
                    {conv.customerName}
                  </h5>
                  <span className="text-[9px] text-slate-400">
                    {formatDate(conv.lastMessageTime)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 truncate">
                  {conv.lastMessage}
                </p>

                {conv.propertyTitle && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <Building className="w-3 h-3 text-slate-500" />
                    {conv.propertyTitle}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Chat Console */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full bg-[#0B1320]">
          {activeConv ? (
            <>
              {/* Top Chat Bar */}
              <div className="p-4 border-b border-slate-800 bg-[#0B1320] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {activeConv.customerName}
                  </h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Live Inquiry Thread
                  </span>
                </div>

                {activeConv.propertyTitle && (
                  <div className="text-right text-xs">
                    <span className="text-slate-400 text-[10px] block">Context:</span>
                    <span className="text-white font-semibold truncate max-w-xs block">
                      {activeConv.propertyTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Stream */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[440px] text-xs">
                {activeConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 ${
                        msg.sender === 'admin'
                          ? 'bg-white text-[#0B1320] font-medium'
                          : 'bg-[#141E30] text-slate-100 border border-slate-800'
                      }`}
                    >
                      <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {msg.senderName}
                      </span>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Form */}
              <form
                onSubmit={handleSendReply}
                className="p-4 border-t border-slate-800 bg-[#070D18] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type official response to client..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-[#141E30] border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-white hover:bg-slate-200 text-[#0B1320] px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-12 text-slate-500 text-xs">
              Select a client conversation thread on the left to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
