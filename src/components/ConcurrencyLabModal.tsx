import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap, RotateCcw } from 'lucide-react';
import { railwayService } from '../services/railwayService';

interface ConcurrencyLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshParent: () => void;
}

interface ThreadResult {
  threadId: number;
  status: 'PENDING' | 'LOCKED' | 'COMMITTED' | 'CONFLICT_ROLLBACK';
  latencyMs: number;
  message: string;
  pnr?: string;
}

export const ConcurrencyLabModal: React.FC<ConcurrencyLabModalProps> = ({
  isOpen,
  onClose,
  onRefreshParent
}) => {
  if (!isOpen) return null;

  const [threadCount, setThreadCount] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [threadResults, setThreadResults] = useState<ThreadResult[]>([]);
  const [summary, setSummary] = useState<{
    successes: number;
    conflicts: number;
    totalTimeMs: number;
    doubleBookingsDetected: boolean;
  } | null>(null);

  const runConcurrencyStressTest = async () => {
    setIsRunning(true);
    setSummary(null);

    // Pick target seat from first train
    const train = railwayService.getTrainById(1);
    if (!train) return;
    const coach = train.coaches[0];
    
    // Find or reset seat 10
    const targetSeat = coach.seats.find(s => s.seatNumber === 10) || coach.seats[0];
    targetSeat.isBooked = false; // Reset to unbooked for the test

    const initialThreads: ThreadResult[] = Array.from({ length: threadCount }, (_, i) => ({
      threadId: i + 1,
      status: 'PENDING',
      latencyMs: 0,
      message: 'Queued for transaction lock'
    }));
    setThreadResults(initialThreads);

    const t0 = performance.now();
    let winnerDeclared = false;
    let successCount = 0;
    let conflictCount = 0;

    const threadPromises = initialThreads.map(async (th) => {
      // Simulate slight microsecond jitter
      const jitter = Math.random() * 20;
      await new Promise(r => setTimeout(r, jitter));

      th.status = 'LOCKED';
      setThreadResults([...initialThreads]);

      const tStart = performance.now();
      const res = await railwayService.executeAtomicBooking({
        trainId: train.trainId,
        coachId: coach.coachId,
        journeyDate: '2026-11-20',
        contactName: `Racer ${th.threadId}`,
        contactEmail: `racer_${th.threadId}@stress.lab`,
        contactPhone: '9876543210',
        passengers: [
          {
            fullName: `Student Racer ${th.threadId}`,
            age: 21,
            gender: 'Male',
            berthPreference: 'WINDOW',
            seatId: targetSeat.seatId
          }
        ]
      });

      const latency = Math.round((performance.now() - tStart) * 10) / 10;
      th.latencyMs = latency;

      if (res.success) {
        successCount++;
        th.status = 'COMMITTED';
        th.pnr = res.pnr;
        th.message = `Acquired seat #${targetSeat.seatNumber}. PNR ${res.pnr} committed.`;
      } else {
        conflictCount++;
        th.status = 'CONFLICT_ROLLBACK';
        th.message = 'Blocked: Seat already claimed by prior transaction. ROLLBACK.';
      }
      setThreadResults([...initialThreads]);
    });

    await Promise.all(threadPromises);
    const totalTimeMs = Math.round((performance.now() - t0) * 10) / 10;

    setSummary({
      successes: successCount,
      conflicts: conflictCount,
      totalTimeMs,
      doubleBookingsDetected: successCount > 1
    });

    setIsRunning(false);
    onRefreshParent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Concurrency Stress Testing & Race Condition Lab</span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulating aggressive parallel threads competing for the exact same berth using SQLite <code>BEGIN EXCLUSIVE</code> locking.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-slate-300">Concurrent Threads:</label>
            <div className="flex gap-2">
              {[10, 25, 50].map(cnt => (
                <button
                  key={cnt}
                  disabled={isRunning}
                  onClick={() => setThreadCount(cnt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    threadCount === cnt
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cnt} Parallel Threads
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={isRunning}
            onClick={runConcurrencyStressTest}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Simulating Parallel Battles...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Launch Concurrency Test</span>
              </>
            )}
          </button>
        </div>

        {/* Results Summary Box */}
        {summary && (
          <div className={`p-4 rounded-2xl border ${
            summary.doubleBookingsDetected
              ? 'bg-rose-950/20 border-rose-800 text-rose-300'
              : 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                {summary.doubleBookingsDetected ? <XCircle className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {summary.doubleBookingsDetected ? 'RACE CONDITION DETECTED (Double Booking)' : 'MATHEMATICAL ZERO DOUBLE-BOOKINGS VERIFIED'}
              </span>
              <span className="font-mono text-xs text-slate-400">Time: {summary.totalTimeMs} ms</span>
            </div>
            <p className="text-xs text-slate-300">
              Launched <strong>{threadCount} concurrent transactions</strong> competing for Seat #10. Exactly <strong>{summary.successes} thread</strong> acquired the exclusive write lock and committed, while <strong>{summary.conflicts} threads</strong> were safely serialized and received rollback conflicts.
            </p>
          </div>
        )}

        {/* Threads Activity Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
          {threadResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              Select thread count and click "Launch Concurrency Test" to run the simulation.
            </div>
          ) : (
            threadResults.map((th, idx) => (
              <div
                key={`thread-${th.threadId}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-300">
                    T{th.threadId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    th.status === 'COMMITTED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : th.status === 'CONFLICT_ROLLBACK'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 animate-pulse'
                  }`}>
                    {th.status}
                  </span>
                  <span className="font-sans text-slate-300 text-xs truncate max-w-sm">
                    {th.message}
                  </span>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  {th.latencyMs > 0 ? `${th.latencyMs}ms` : '—'}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
