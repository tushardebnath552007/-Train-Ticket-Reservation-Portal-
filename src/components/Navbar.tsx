import React, { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-50 transition-all pt-3 px-3 sm:px-6">
      
      {/* Premium floating pill navigation with scenic picture backdrop */}
      <div className="max-w-7xl mx-auto rounded-full relative overflow-hidden border border-rose-600/25 shadow-[0_8px_40px_-8px_rgba(225,29,72,0.35)] px-4 sm:px-6 h-16 sm:h-[4.5rem] flex items-center justify-between">
        {/* Picture background + dark glass overlays */}
        <img
          src="/src/assets/images/winding_mountain_rail_hero_1791009627778.jpg"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/95"></div>
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"></div>
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>

        {/* Left Side Links */}
        <div className="relative flex items-center gap-1 sm:gap-2">
          
          {/* Brand Logo & Title (Solidroad style) */}
          <div 
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 cursor-pointer group mr-2 sm:mr-4"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-700 flex items-center justify-center text-white font-black shadow-md shadow-rose-600/20 group-hover:scale-105 transition-all">
              <Train className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                style={{ fontFamily: "'UnifrakturCook', serif" }}
                className="text-xl sm:text-2xl tracking-wide bg-gradient-to-b from-amber-200 via-amber-400 to-rose-700 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(225,29,72,0.35)] group-hover:from-amber-100 group-hover:to-rose-600 transition-all"
              >
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
                  ? 'text-white bg-gradient-to-r from-rose-500 to-rose-700 font-black shadow-md shadow-rose-600/40'
                  : 'hover:text-amber-300 hover:bg-rose-600/10'
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
                  ? 'text-white bg-gradient-to-r from-rose-500 to-rose-700 font-black shadow-md shadow-rose-600/40'
                  : 'hover:text-amber-300 hover:bg-rose-600/10'
              }`}
            >
              Schedules
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'dashboard'
                  ? 'text-white bg-gradient-to-r from-rose-500 to-rose-700 font-black shadow-md shadow-rose-600/40'
                  : 'hover:text-amber-300 hover:bg-rose-600/10'
              }`}
            >
              My Bookings
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'admin'
                  ? 'text-white bg-gradient-to-r from-rose-500 to-rose-700 font-black shadow-md shadow-rose-600/40'
                  : 'hover:text-amber-300 hover:bg-rose-600/10'
              }`}
            >
              Operations
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'text-amber-400 bg-rose-600/10 font-bold border border-rose-600/30'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Contact & 139</span>
            </button>
          </nav>
        </div>

        {/* Right Side Controls & Sign In Section */}
        <div className="relative flex items-center gap-2 sm:gap-3">

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
                <div className="w-6 h-6 rounded-full bg-rose-600/20 text-amber-400 flex items-center justify-center font-bold text-xs">
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
        <div className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-slate-900 border border-rose-600/25 shadow-[0_8px_40px_-8px_rgba(225,29,72,0.3)] text-xs font-bold text-white">
          <div className="relative h-20 overflow-hidden">
            <img
              src="/src/assets/images/classic_darjeeling_steam_1791013001.jpg"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            <span
              style={{ fontFamily: "'UnifrakturCook', serif" }}
              className="absolute bottom-2 left-4 text-2xl bg-gradient-to-b from-amber-200 via-amber-400 to-rose-700 bg-clip-text text-transparent"
            >
              RailFleet
            </span>
          </div>
          <div className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'search' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Corridors & Route Search
          </button>
          <button
            onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'tracking' ? 'bg-rose-600 text-white' : 'text-sky-400 hover:bg-slate-800'}`}
          >
            <Radio className="w-3.5 h-3.5" /> Live Train Radar
          </button>
          <button
            onClick={() => { setActiveTab('trains'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'trains' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Train Schedules
          </button>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl ${activeTab === 'dashboard' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            My Bookings & PNR
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2 rounded-xl flex items-center gap-2 ${activeTab === 'contact' ? 'bg-rose-600 text-white' : 'text-amber-400 hover:bg-slate-800'}`}
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
        </div>
      )}

    </header>
  );
};
