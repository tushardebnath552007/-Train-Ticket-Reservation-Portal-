import React, { useState } from 'react';
import {
  Train,
  Compass,
  Radio,
  Calendar,
  Ticket,
  ShieldCheck,
  PhoneCall,
  Cpu,
  ChevronDown,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Wallet,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { IconTile, IconTone } from './ui/IconTile';
import { UserProfile } from '../types/user';

interface SidebarNavProps {
  activeTab: 'search' | 'trains' | 'seats' | 'checkout' | 'dashboard' | 'admin' | 'tracking' | 'contact';
  setActiveTab: (tab: 'search' | 'trains' | 'seats' | 'checkout' | 'dashboard' | 'admin' | 'tracking' | 'contact') => void;
  onOpenConcurrencyLab: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenConcurrencyLab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  collapsed,
  setCollapsed,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  interface NavItem {
    id: 'search' | 'tracking' | 'trains' | 'dashboard' | 'admin' | 'contact';
    label: string;
    icon: React.ElementType;
    badge: string | null;
    badgeColor: string;
    tone: IconTone;
    pulse?: boolean;
  }

  const navItems: NavItem[] = [
    {
      id: 'search',
      label: 'Corridors & Search',
      icon: Compass,
      badge: 'Hub',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      tone: 'amber'
    },
    {
      id: 'tracking',
      label: 'Live Radar (GPS)',
      icon: Radio,
      badge: 'Live',
      badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
      tone: 'sky',
      pulse: true
    },

    {
      id: 'trains',
      label: 'Train Schedules',
      icon: Calendar,
      badge: null,
      badgeColor: '',
      tone: 'violet'
    },
    {
      id: 'dashboard',
      label: 'My Bookings & PNR',
      icon: Ticket,
      badge: null,
      badgeColor: '',
      tone: 'rose'
    },
    {
      id: 'admin',
      label: 'Fleet Operations',
      icon: ShieldCheck,
      badge: 'Admin',
      badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      tone: 'red'
    },
    {
      id: 'contact',
      label: 'Rail Madad & Helpline',
      icon: PhoneCall,
      badge: '139',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      tone: 'emerald'
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-r border-slate-800 shadow-2xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800 relative overflow-hidden">
        {/* Rainbow gradient glow line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 opacity-80" />
        <div
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-amber-500/30 transition-all flex-shrink-0">
            <Train className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="brand-wordmark text-xl font-extrabold tracking-tight truncate bg-gradient-to-b from-amber-200 via-amber-400 to-rose-600 bg-clip-text text-transparent"
                >
                  RailFleet
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-rose-400/80 uppercase">
                FastAPI • React
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="text-slate-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-rose-600/10 hover:border hover:border-rose-600/20 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-amber-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-3 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Navigation'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl transition-all font-medium text-xs group relative ${
                collapsed ? 'justify-center p-3' : 'px-3.5 py-3 justify-between'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 hover:shadow-md hover:shadow-amber-500/10 hover:border hover:border-amber-400/15'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <IconTile
                  icon={Icon}
                  tone={isActive ? 'slate' : item.tone}
                  size="sm"
                  variant={isActive ? 'solid' : 'soft'}
                  pulse={item.pulse && !isActive}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${item.badgeColor} ml-2`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white/70 rounded-r-full" />
              )}
            </button>
          );
        })}


        <button
          onClick={onOpenConcurrencyLab}
          title={collapsed ? 'Concurrency Stress Lab' : undefined}
          className={`w-full flex items-center rounded-xl transition-all font-medium text-xs group border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/25 hover:to-teal-500/25 hover:shadow-md hover:shadow-emerald-500/20 text-emerald-400 ${
            collapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 justify-between'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <IconTile icon={Cpu} tone="emerald" size="sm" variant="solid" pulse />
            {!collapsed && <span className="truncate font-mono">Concurrency Lab</span>}
          </div>
          {!collapsed && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              ACID
            </span>
          )}
        </button>
      </nav>

      {/* User Auth & Footer Profile Card */}
      <div className="p-3 border-t border-rose-600/15 bg-slate-900/60">
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-full flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 border border-slate-700/60 hover:border-rose-600/30 p-2 text-xs transition-all hover:shadow-md hover:shadow-rose-600/10 ${
                collapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-rose-600/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 border border-amber-400/30">
                  {currentUser.name.charAt(0)}
                </div>
                {!collapsed && (
                  <div className="text-left min-w-0">
                    <div className="font-bold text-white truncate text-xs">{currentUser.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-amber-400 font-mono">₹{currentUser.walletBalance}</div>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {userDropdownOpen && (
              <div className={`absolute bottom-full mb-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 text-xs z-50 animate-in fade-in ${
                collapsed ? 'left-full ml-2 w-52' : 'left-0 right-0'
              }`}>
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">Wallet: ₹{currentUser.walletBalance}</div>
                </div>
                <button
                  onClick={() => { setActiveTab('dashboard'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => { setActiveTab('admin'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fleet Operations</span>
                </button>
                <button
                  onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-slate-800 pt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {!collapsed ? (
              <>
                <button
                  onClick={() => onOpenAuthModal('signin')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
                >
                  Register ➔
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenAuthModal('signin')}
                title="Sign In"
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex justify-center"
              >
                <User className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
