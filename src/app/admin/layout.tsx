'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  Building,
  Clock,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  FileEdit,
  Map,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const ADMIN_USERNAME = 'farhanullah';
const ADMIN_PASSWORD = 'farhanullah785';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem('bin_ishaq_admin_session');
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);

    setTimeout(() => {
      if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        try {
          localStorage.setItem('bin_ishaq_admin_session', 'authenticated');
        } catch {}
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Invalid username or password. Access restricted.');
      }
      setLoggingIn(false);
    }, 400);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('bin_ishaq_admin_session');
    } catch {}
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Site Content (CMS)', href: '/admin/site-content', icon: FileEdit, badge: 'Editable' },
    { label: 'Property Inventory', href: '/admin/properties', icon: Building },
    { label: 'Society Maps & Plans', href: '/admin/maps', icon: Map, badge: 'PDF' },
    { label: 'Review Submissions', href: '/admin/submissions', icon: Clock, badge: 'New' },
    { label: 'Customer CRM', href: '/admin/crm', icon: Users },
    { label: 'Visit Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Chat & Inquiries', href: '/admin/messages', icon: MessageSquare },
    { label: 'Visitor Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  // 1. Initial Session Check Loader
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-bold">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen architectural-grid bg-[#070D18] flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-[#0B1320] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 bg-white text-[#0B1320] font-black text-xl flex items-center justify-center mx-auto rounded-2xl shadow-lg">
              BI
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-blue-400 block">
                Executive Portal
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Admin Authentication
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Sign in with authorized administrator credentials to manage portfolio and CMS.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-rose-400 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-[#141E30] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#141E30] border border-slate-700 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-white hover:bg-slate-200 text-[#0B1320] font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              {loggingIn ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <span>Back to Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-[#0B1320] border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold">
            <span>BI</span>
          </div>
          <span className="font-bold text-white text-sm">BIN ISHAQ ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#141E30] text-slate-300 hover:text-white cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0B1320] border-r border-slate-800 flex flex-col justify-between p-4 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white text-[#0B1320] flex items-center justify-center font-bold text-xs">
                <span>BI</span>
              </div>
              <div>
                <span className="font-bold tracking-wider text-sm text-white block">
                  BIN ISHAQ
                </span>
                <span className="text-[9px] uppercase tracking-widest text-blue-400 font-bold block">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-white text-[#0B1320] font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#141E30]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && !isActive && (
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] px-1.5 py-0.5 font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="bg-[#141E30] border border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-white block truncate">
                  {ADMIN_USERNAME}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  Master Administrator
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition cursor-pointer"
              title="Log Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-[#141E30] hover:bg-[#1E2B45] text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold py-2.5 transition"
          >
            <span>Back to Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
