import React from 'react';
import { ShieldCheck, Radio, Cpu, Lock, CheckCircle2, AlertTriangle, Zap, Heart, Eye } from 'lucide-react';

export const KavachSafetyShowcase: React.FC = () => {
  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            MISSION ZERO ACCIDENTS & ZERO DOUBLE-BOOKINGS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Kavach Collision Shield & Database Integrity Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Indigenously developed SIL-4 certified Automatic Train Protection (ATP) combined with mathematical transaction locking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ● SIL-4 Safety Integrity Level
          </span>
        </div>
      </div>

      {/* Grid: 2 Pillars: Physical Track Safety (Kavach) & Digital Safety (SQLite Exclusive Lock) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Physical Track Protection: Kavach */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Kavach Automatic Train Protection (ATP)
              </h3>
              <span className="text-xs text-slate-400 font-mono">Real-Time Trackside Collision Shield</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> RFID Trackside Tags
              </div>
              <p className="text-slate-400 leading-relaxed">
                Passive RFID tags fitted every 1,000 meters along tracks detect train orientation, exact kilometer milestone, and speed limit boundaries.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-400" /> Automatic Emergency Braking
              </div>
              <p className="text-slate-400 leading-relaxed">
                If an engineer misses a Red Signal (SPAD - Signal Passed at Danger), Kavach automatically applies electronic pneumatic brakes in 0.25 seconds.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-amber-400" /> Ultra-High Frequency Radio Mesh
              </div>
              <p className="text-slate-400 leading-relaxed">
                Continuous UHF locomotive-to-locomotive communication broadcasts alarms if two trains inadvertently enter the same block section.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Concurrency Protection: SQLite Exclusive Lock */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Atomic Transaction Isolation Engine
              </h3>
              <span className="text-xs text-slate-400 font-mono">SQLite3 BEGIN EXCLUSIVE Serialization</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Serialized Mutex Locking
              </div>
              <p className="text-slate-400 leading-relaxed">
                During 10:00 AM Tatkal surges with 50+ concurrent requests on the last remaining berth, transactions are serialized at the database lock layer.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" /> Atomic Rollback Immunity
              </div>
              <p className="text-slate-400 leading-relaxed">
                If an allocated berth is claimed by Thread #1, subsequent colliding threads automatically trigger clean SQL rollbacks with zero ghost bookings.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" /> Verified Concurrency Test Suite
              </div>
              <p className="text-slate-400 leading-relaxed">
                Built-in multi-threaded verification suite executes 25 concurrent threads, confirming 100% mathematical zero double-booking accuracy.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
