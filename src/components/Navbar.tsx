import React, { useState, useEffect } from 'react';
import { Train, ShieldCheck, Cpu, Users, MapPin, Radio, Compass, PhoneCall, Bell, Menu, X, ChevronDown, User, Search, Sparkles, Globe, Ticket, Calendar, Clock, LogOut, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types/user';

interface NavbarProps {
  activeTab: 'search' | 'trains' | 'seats' | 'checkout' | 'dashboard' | 'admin' | 'tracking' | 'contact';
  setActiveTab: (tab: 'search' | 'trains' | 'seats' | 'checkout' | 'dashboard' | 'admin' | 'tracking' | 'contact') => void;
  onOpenConcurrencyLab: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConcurrencyLab,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [port5500Online, setPort5500Online] = useState<boolean>(true);
  const [port5500Latency, setPort5500Latency] = useState<number>(4);

  useEffect(() => {
    const pingPort5500 = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch('/health');
        if (res.ok) {
          const lat = Math.max(1, Math.round(performance.now() - t0));
          setPort5500Online(true);
          setPort5500Latency(lat);
        } else {
          setPort5500Online(false);
        }
      } catch {
        setPort5500Online(false);
      }
    };

    pingPort5500();
    const interval = setInterval(pingPort5500, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 transition-all pt-3 px-3 sm:px-6">
      
      {/* Framer/Solidroad Style Floating Rounded Pill Navigation Container */}
      <div className="max-w-7xl mx-auto rounded-full bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left Side Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Brand Logo & Title (Solidroad style) */}
          <div 
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 cursor-pointer group mr-2 sm:mr-4"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Train className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                RailFleet
              </span>
              <span className="hidden md:inline text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/10 text-amber-400 uppercase tracking-widest">
                NATIONAL
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'search'
                  ? 'text-white bg-white/10 font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Corridors
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                activeTab === 'tracking'
                  ? 'text-sky-300 bg-sky-500/10 font-bold'
                  : 'hover:text-sky-400 hover:bg-white/5'
              }`}
            >
              <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
              <span>Live Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('trains')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'trains'
                  ? 'text-white bg-white/10 font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Schedules
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'dashboard'
                  ? 'text-white bg-white/10 font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              My Bookings
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'admin'
                  ? 'text-white bg-white/10 font-bold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              Operations
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Contact & 139</span>
            </button>
          </nav>
        </div>

        {/* Right Side Controls & Sign In Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Port 5500 Connection Status Telemetry Badge */}
          <div 
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono shadow-inner cursor-help"
            title="Backend Secondary Server running on port 5500, synchronized via Vite proxy"
          >
            <span className={`w-2 h-2 rounded-full ${port5500Online ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-slate-400 font-sans text-[10px]">Port 5500:</span>
            <span className={port5500Online ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {port5500Online ? `ACTIVE (${port5500Latency}ms)` : 'CONNECTING'}
            </span>
          </div>

          {/* Engineering tools pills */}
          <button
            onClick={onOpenConcurrencyLab}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all"
            title="Concurrency Stress Lab"
          >
            <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Concurrency Lab</span>
          </button>

          {/* User Sign In / Profile State (Solidroad style) */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-medium">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] text-amber-400 font-mono hidden md:inline">₹{currentUser.walletBalance}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1 text-xs z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="font-bold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-1">Wallet: ₹{currentUser.walletBalance}</div>
                  </div>
                  <button
                    onClick={() => { setActiveTab('dashboard'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>My Bookings & PNR</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('admin'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fleet Console</span>
                  </button>
                  <button
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 pt-1 border-t border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>

              {/* Glowing CTA Button (matching Solidroad's green/gold button) */}
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-4 sm:px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Register</span>
                <span className="text-[10px]">➔</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-2 text-xs font-bold text-white shadow-2xl">
          <button
            onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'search' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Corridors & Route Search
          </button>
          <button
            onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'tracking' ? 'bg-amber-500 text-slate-950' : 'text-sky-400 hover:bg-slate-800'}`}
          >
            <Radio className="w-3.5 h-3.5" /> Live Train Radar
          </button>
          <button
            onClick={() => { setActiveTab('trains'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'trains' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Train Schedules
          </button>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            My Bookings & PNR
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'contact' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:bg-slate-800'}`}
          >
            <PhoneCall className="w-3.5 h-3.5" /> 24/7 Rail Madad & Contact
          </button>
          <button
            onClick={() => { onOpenConcurrencyLab(); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2 rounded-xl text-emerald-400 hover:bg-slate-800 flex items-center gap-2"
          >
            <Cpu className="w-3.5 h-3.5" /> Launch Concurrency Lab
          </button>
        </div>
      )}

    </header>
  );
};
