'use client';

import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '@/types/crm';
import { formatDate } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  Users,
  Search,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle2,
  FileText,
  X,
  MessageCircle,
  Plus,
} from 'lucide-react';

const STAGES: { id: LeadStatus; label: string; badgeStyle: string }[] = [
  { id: 'new', label: 'New Inquiries', badgeStyle: 'bg-blue-950 text-blue-300 border-blue-800' },
  { id: 'contacted', label: 'Contacted', badgeStyle: 'bg-purple-950 text-purple-300 border-purple-800' },
  { id: 'viewing_scheduled', label: 'Viewing Scheduled', badgeStyle: 'bg-slate-800 text-slate-200 border-slate-700' },
  { id: 'negotiation', label: 'In Negotiation', badgeStyle: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
  { id: 'closed', label: 'Closed Deals', badgeStyle: 'bg-white text-black border-white' },
];

export default function AdminCRMPage() {
  const { showToast } = useStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [activeMobileStage, setActiveMobileStage] = useState<LeadStatus>('new');

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/crm');
      const data = await res.json();
      if (data.data) {
        setLeads(data.data);
        if (selectedLead) {
          const updated = data.data.find((l: Lead) => l.id === selectedLead.id);
          if (updated) setSelectedLead(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      const res = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status, author: 'Admin' }),
      });
      if (res.ok) {
        showToast('Lead status updated');
        fetchLeads();
      }
    } catch {
      showToast('Error updating lead');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    try {
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_activity',
          leadId: selectedLead.id,
          message: newNote,
          type: 'note',
          author: 'Admin',
        }),
      });

      if (res.ok) {
        setNewNote('');
        showToast('Note added to lead activity history');
        fetchLeads();
      }
    } catch {
      showToast('Error adding note');
    }
  };

  const activeStageLeads = leads.filter((l) => l.status === activeMobileStage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400">
            Client Relationship Management
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Lead Pipeline &amp; High-Value Deals ({leads.length})
          </h1>
        </div>
      </div>

      {/* MOBILE STAGE TABS (< lg): Quick 1-tap switcher */}
      <div className="lg:hidden space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STAGES.map((stage) => {
            const count = leads.filter((l) => l.status === stage.id).length;
            const isCurrent = activeMobileStage === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveMobileStage(stage.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-[#0B1320] shadow-md'
                    : 'bg-[#0B1320] text-slate-300 border border-slate-700 hover:text-white'
                }`}
              >
                <span>{stage.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isCurrent ? 'bg-[#0B1320] text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Leads List */}
        <div className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {STAGES.find((s) => s.id === activeMobileStage)?.label} ({activeStageLeads.length})
            </span>
          </div>

          {activeStageLeads.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No leads currently in this stage.
            </div>
          ) : (
            <div className="space-y-3">
              {activeStageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-[#141E30] hover:bg-[#1E2B45] border border-slate-700 rounded-xl p-4 space-y-2.5 cursor-pointer transition shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {lead.interestedPropertyTitle || lead.interestedArea || 'General Inquiry'}
                  </p>

                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </span>
                    <span className="text-[11px] font-bold text-blue-400">Tap to Manage &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP KANBAN COLUMNS (>= lg) */}
      <div className="hidden lg:grid grid-cols-5 gap-4 pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="bg-[#0B1320] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[500px]"
            >
              {/* Stage Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${stage.badgeStyle}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards List */}
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-[#141E30] hover:bg-[#1E2B45] border rounded-xl p-3.5 space-y-2 cursor-pointer transition ${
                        selectedLead?.id === lead.id
                          ? 'border-white text-white'
                          : 'border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-bold text-white truncate">{lead.name}</h5>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {lead.interestedPropertyTitle || lead.interestedArea || 'General Inquiry'}
                      </p>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[100px]">{lead.phone}</span>
                        </span>
                        {(lead as any).budget && (
                          <span className="text-slate-300 font-semibold">{(lead as any).budget}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LEAD DETAILS DRAWER / BOTTOM SHEET */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0B1320] border border-slate-700 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {selectedLead.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {selectedLead.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="min-w-[40px] min-h-[40px] rounded-xl bg-[#141E30] text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Lead Pipeline Stage
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  className="w-full min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white"
                >
                  <option value="new">New Inquiries</option>
                  <option value="contacted">Contacted</option>
                  <option value="viewing_scheduled">Viewing Scheduled</option>
                  <option value="negotiation">In Negotiation</option>
                  <option value="closed">Closed Deals</option>
                </select>
              </div>

              {/* Direct Actions (Call, WhatsApp, Email) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${selectedLead.phone.replace(/\s+/g, '')}`}
                  className="min-h-[44px] bg-[#141E30] hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-slate-700 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello+${encodeURIComponent(selectedLead.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold border border-emerald-600/40 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Contact Info Card */}
              <div className="bg-[#141E30] border border-slate-700/80 rounded-xl p-3.5 space-y-2">
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline truncate">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                {selectedLead.interestedPropertyTitle && (
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedLead.interestedPropertyTitle}</span>
                  </div>
                )}
                {selectedLead.notes && (
                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-700 leading-relaxed">
                    {selectedLead.notes}
                  </p>
                )}
              </div>

              {/* Activity Log Stream */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Activity Timeline &amp; Notes
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.activities?.map((act) => (
                    <div
                      key={act.id}
                      className="bg-[#141E30] border border-slate-700/80 rounded-xl p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-white capitalize">{act.author}</span>
                        <span>{formatDate(act.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{act.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="p-4 border-t border-slate-800 bg-[#0B1320] flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Add private note or update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 min-h-[44px] bg-[#141E30] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="min-h-[44px] bg-white hover:bg-slate-200 text-[#0B1320] font-black text-xs px-5 py-2 rounded-xl disabled:opacity-50 transition cursor-pointer shadow"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
