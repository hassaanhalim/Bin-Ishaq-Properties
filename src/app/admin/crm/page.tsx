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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Client Relationship Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Lead Pipeline & High-Value Deals ({leads.length})
          </h1>
        </div>
      </div>

      {/* CRM Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className="bg-[#0B1320] border border-slate-800 p-4 flex flex-col justify-between min-h-[500px]"
            >
              {/* Stage Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 border ${stage.badgeStyle}`}>
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
                      className={`bg-[#141E30] hover:bg-[#1E2B45] border p-3.5 space-y-2 cursor-pointer transition ${
                        selectedLead?.id === lead.id
                          ? 'border-white bg-[#1E2B45]'
                          : 'border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">
                          {lead.name}
                        </h4>
                        <span className="text-[9px] text-slate-400">
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 truncate">
                        {lead.interestedPropertyTitle || lead.interestedArea || 'General Inquiry'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                        <span>{lead.phone}</span>
                        <span className="text-slate-300 font-medium">
                          {lead.activities?.length || 1} logs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Details Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0B1320] text-slate-100 h-full p-6 overflow-y-auto flex flex-col justify-between space-y-6 border-l border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedLead.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedLead.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 bg-[#141E30] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5 mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lead Pipeline Stage
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  className="w-full bg-[#141E30] border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-white cursor-pointer [&>option]:bg-[#0B1320] [&>option]:text-white"
                >
                  <option value="new">New Inquiries</option>
                  <option value="contacted">Contacted</option>
                  <option value="viewing_scheduled">Viewing Scheduled</option>
                  <option value="negotiation">In Negotiation</option>
                  <option value="closed">Closed Deals</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="bg-[#141E30] border border-slate-800 p-4 space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                {selectedLead.notes && (
                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-700">
                    {selectedLead.notes}
                  </p>
                )}
              </div>

              {/* Activity Log Stream */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Activity Timeline & Notes
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedLead.activities?.map((act) => (
                    <div
                      key={act.id}
                      className="bg-[#141E30] border border-slate-800 p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-white capitalize">{act.author}</span>
                        <span>{formatDate(act.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-300">{act.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add private note or update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#141E30] border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="bg-white hover:bg-slate-200 text-[#0B1320] font-bold text-xs px-4 py-2 disabled:opacity-50 transition cursor-pointer"
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
