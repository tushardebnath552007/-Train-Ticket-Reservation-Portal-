import React, { useState } from 'react';
import { ShieldCheck, User, Sparkles, CheckCircle2, ArrowRight, Wallet, Ticket, KeyRound, Award, Lock } from 'lucide-react';
import { UserProfile, DEMO_USERS } from '../types/user';

interface MemberPortalSectionProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onViewMyBookings: () => void;
}

export const MemberPortalSection: React.FC<MemberPortalSectionProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onViewMyBookings
}) => {
  return (
    <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              NATIONAL RAILWAY MEMBER PRIVILEGES
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            RailFleet Traveler & Membership Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sign in to unlock 1-click Tatkal reservations, zero-fee cancellations, automated UPI refunds, and digital wallet credits.
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Active: {currentUser.membershipTier}
            </span>
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuthModal('signin')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 text-xs font-black transition-all shadow-md"
            >
              Register Account
            </button>
          </div>
        )}
      </div>

      {/* Member State */}
      {currentUser ? (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-600/40 text-amber-400 flex items-center justify-center font-black text-xl">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-600/20 text-amber-300 border border-rose-600/30 font-bold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUser.email} • {currentUser.phone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Rail Wallet Balance</span>
                <span className="text-xl font-black text-amber-400 font-mono">₹{currentUser.walletBalance}</span>
              </div>
              <button
                onClick={onViewMyBookings}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
            </div>
          </div>

          {/* Quick Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Tatkal Auto-Fill
              </div>
              <p className="text-slate-400">
                Pre-saved passenger manifest ready for 10:00 AM booking rush with zero manual entry delay.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" /> Instant RailPass Wallet
              </div>
              <p className="text-slate-400">
                Zero PG failure rate with direct wallet debit and instant 60-second cancellation refunds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" /> Complimentary Lounge Pass
              </div>
              <p className="text-slate-400">
                2 free IRCTC Executive Lounge visits per quarter at New Delhi, Howrah, and Mumbai Central.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Logged Out / Promo Banner */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-600/30 text-amber-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Rail Pass Membership</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Create an account or sign in to streamline your rail travels
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Never miss a Tatkal berth again. RailFleet members enjoy pre-loaded passenger lists, instant cancellation wallet re-credits, priority customer helpline access, and travel insurance coverage.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Existing User Sign In</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Member Perks Checklist
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200"><strong>₹500 Welcome Travel Credit</strong> credited instantly upon phone verification.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200"><strong>Zero Booking Fees:</strong> No payment gateway surcharges on UPI & debit cards.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200"><strong>Auto Lower Berth Allocation</strong> preference for senior citizens and families.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200"><strong>Live Delay WhatsApp SMS Alerts</strong> with automated reschedule protection.</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
