import React, { useState } from 'react';
import { Search, Ticket, Calendar, Clock, AlertCircle, Trash2, Printer, CheckCircle2, RotateCcw, User, ArrowRight, ShieldCheck, Download, Info, FileText, Luggage } from 'lucide-react';
import { Booking } from '../types/railway';
import { railwayService } from '../services/railwayService';

interface DashboardPageProps {
  bookings: Booking[];
  onRefresh: () => void;
  onViewTicket: (booking: Booking) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  bookings,
  onRefresh,
  onViewTicket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketToCancel, setTicketToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationResult, setCancellationResult] = useState<{
    success: boolean;
    message: string;
    refundAmount: number;
    cancellationFee: number;
  } | null>(null);

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      b.pnr.toLowerCase().includes(term) ||
      b.contactEmail.toLowerCase().includes(term) ||
      b.trainName.toLowerCase().includes(term) ||
      b.trainNumber.toLowerCase().includes(term) ||
      b.passengers.some(p => p.fullName.toLowerCase().includes(term))
    );
  });

  const confirmCancelTicket = async () => {
    if (!ticketToCancel) return;
    setIsCancelling(true);

    try {
      // 1. Local service cancellation & seat release
      const res = railwayService.cancelBooking(ticketToCancel.pnr);

      // 2. Also notify Server 2 on port 5500 via Vite proxy
      try {
        await fetch('/api/v1/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pnr: ticketToCancel.pnr })
        });
      } catch (err) {
        // Fallback gracefully
      }

      setCancellationResult(res);
      setTicketToCancel(null);
      onRefresh();
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Handcrafted Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <span className="text-amber-400 font-bold">Portal</span>
        <span>/</span>
        <span className="text-slate-200">Electronic Ticket Ledger & PNR Lifecycle Management</span>
      </div>

      {/* Header with Visual VIP Lounge & Travel Ledger Photography */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/station_executive_lounge_1791008973049.jpg"
            alt="IRCTC Executive Lounge & Passenger Ledger"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                National Ticket Ledger
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <Ticket className="w-8 h-8 text-amber-400" />
                <span>User Booking Portal & PNR Lifecycle</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Search reservations by 10-digit PNR, traveler email, or passenger name. Cancel confirmed tickets with automated refund computation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 text-slate-300 font-mono font-bold shadow-md">
                Total Records: <strong className="text-amber-400">{bookings.length}</strong>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by 10-Digit PNR, Email (e.g. anirudh.sen@iitd.ac.in), or Train..."
                className="w-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      {cancellationResult && (
        <div className="p-5 rounded-2xl bg-rose-600/10 border border-rose-600/30 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-300">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-white">Cancellation & Instant Refund Executed</div>
              <p className="mt-0.5 leading-relaxed">{cancellationResult.message}</p>
              <div className="mt-2 flex flex-wrap gap-4 font-mono">
                <span className="text-emerald-400 font-bold">Refund Amount: ₹{cancellationResult.refundAmount}</span>
                <span className="text-slate-400">Cancellation Fee (15%): ₹{cancellationResult.cancellationFee}</span>
                <span className="text-sky-400">Berths Released Back to General Pool</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setCancellationResult(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bookings Table / Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Reservations Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {searchTerm ? `No bookings matched your filter query '${searchTerm}'.` : 'You have not completed any train ticket reservations yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b, idx) => {
            const isConfirmed = b.status === 'CONFIRMED';

            return (
              <div
                key={`dash-${b.pnr}-${b.bookingId || idx}-${idx}`}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg transition-all hover:border-slate-700 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400 font-mono font-black text-sm">
                      PNR
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg sm:text-xl font-black tracking-wider text-amber-400">
                          {b.pnr}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Booked by: <strong className="text-slate-200">{b.contactName}</strong> ({b.contactEmail})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTicket(b)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Boarding Pass</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => setTicketToCancel(b)}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Ticket</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs">
                  <div className="sm:col-span-4">
                    <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Train Service</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {b.trainName} (#{b.trainNumber})
                    </div>
                    <span className="text-slate-400 font-mono">
                      Coach {b.coachCode} ({b.coachType})
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Travel Corridor & Date</span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {b.sourceCode} ➔ {b.destinationCode}
                    </div>
                    <span className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{b.journeyDate}</span>
                    </span>
                  </div>

                  <div className="sm:col-span-4 sm:text-right">
                    <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Total Fare Paid</span>
                    <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                      ₹{b.totalAmount}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Exclusive Txn Lock: {b.transactionLatencyMs}ms
                    </span>
                  </div>
                </div>

                {/* Passenger Berths List */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-bold mr-1">Passengers:</span>
                  {b.passengers.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      {p.fullName} (Age {p.age}, {p.gender}) • <strong className="text-amber-400">Seat #{p.seatNumber} ({p.berthType})</strong>
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Official Indian Railways Cancellation Refund Policy Chart */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Official Indian Railways PRS Cancellation & Refund Schedule
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 text-xs font-mono">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Time of Cancellation</th>
                <th className="py-3 px-4">Deduction / Clerkage Charge</th>
                <th className="py-3 px-4">Refund Credited</th>
                <th className="py-3 px-4">Berth Release Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-white">&gt; 48 Hours before departure</td>
                <td className="py-3 px-4 text-slate-300">Flat 15% cancellation fee</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">85% Instant Refund</td>
                <td className="py-3 px-4 text-sky-400">Released Immediately to Pool</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-white">12 to 48 Hours before departure</td>
                <td className="py-3 px-4 text-slate-300">25% cancellation fee</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">75% Instant Refund</td>
                <td className="py-3 px-4 text-sky-400">Released Immediately to Pool</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-white">4 to 12 Hours before departure</td>
                <td className="py-3 px-4 text-slate-300">50% cancellation fee</td>
                <td className="py-3 px-4 text-amber-400 font-bold">50% Instant Refund</td>
                <td className="py-3 px-4 text-sky-400">Released to Current Booking</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-white">&lt; 4 Hours (Chart Prepared)</td>
                <td className="py-3 px-4 text-rose-400">100% deduction</td>
                <td className="py-3 px-4 text-rose-400 font-bold">No Refund (TDR Filing Required)</td>
                <td className="py-3 px-4 text-slate-400">Transferred to RAC / Waitlist</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* In-App Ticket Cancellation Confirmation Modal */}
      {ticketToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Cancel Electronic Ticket</h3>
                  <span className="text-xs font-mono text-slate-400">PNR #{ticketToCancel.pnr}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTicketToCancel(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ticket info summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white font-bold">
                <span>{ticketToCancel.trainName} (#{ticketToCancel.trainNumber})</span>
                <span className="text-amber-400">{ticketToCancel.sourceCode} ➔ {ticketToCancel.destinationCode}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Journey Date: {ticketToCancel.journeyDate}</span>
                <span>Coach {ticketToCancel.coachCode} ({ticketToCancel.coachType})</span>
              </div>
              <div className="text-slate-400 pt-1 border-t border-slate-900">
                Passengers: {ticketToCancel.passengers.map(p => `${p.fullName} (Seat ${p.seatNumber})`).join(', ')}
              </div>
            </div>

            {/* Transparent Refund Computation Breakdown */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2 text-xs font-mono">
              <div className="text-xs font-bold text-rose-400 font-sans">
                Indian Railways Automated Refund Ledger:
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Fare Paid:</span>
                <span>₹{ticketToCancel.totalAmount}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Standard Clerical Charge (15%):</span>
                <span>-₹{Math.round(ticketToCancel.totalAmount * 0.15)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-rose-500/20 font-mono">
                <span>Net Refund Credited (85%):</span>
                <span>₹{ticketToCancel.totalAmount - Math.round(ticketToCancel.totalAmount * 0.15)}</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                * Refund will be credited instantly to original payment mode or UPI wallet. Berths will be released immediately to general inventory.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTicketToCancel(null)}
                className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
              >
                Keep My Ticket
              </button>
              <button
                type="button"
                onClick={confirmCancelTicket}
                disabled={isCancelling}
                className="flex-1 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                {isCancelling ? (
                  <span>Processing Cancellation...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm & Cancel Ticket</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Relive-your-routes gallery */}
      <section className="rounded-[2.5rem] bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            Your travel memories
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Relive Your Routes
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { src: "/src/assets/images/winding_mountain_rail_hero_1791009627778.jpg", label: "Mountain winding routes" },
            { src: "/src/assets/images/scenic_mountain_rail_1791007927403.jpg", label: "Ghats & valley runs" },
            { src: "/src/assets/images/coastal_rail_bridge_1791008989586.jpg", label: "Coastal sea bridges" }
          ].map((c, i) => (
            <div key={i} className="relative rounded-3xl overflow-hidden border border-slate-800 group h-44 sm:h-52">
              <img
                src={c.src}
                alt={c.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-sm font-black text-white drop-shadow">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Official PNR Status Acronym Decoder & Probability Matrix */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest block mb-1">
            CRIS RESERVATION RULES REFERENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            PNR Status Codes & Confirmation Probabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Understanding ticket abbreviations during chart preparation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CNF (CONFIRMED)
              </span>
              <span className="text-xs text-emerald-400 font-bold font-mono">100% Boarding</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Coach and berth are officially allocated. If booked before chart preparation, berth number is confirmed or displayed immediately.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                RAC (SEAT GUARANTEE)
              </span>
              <span className="text-xs text-sky-400 font-bold font-mono">100% Travel Right</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reservation Against Cancellation. Two passengers share a single Lower Berth as seated accommodation. Upgraded to full berth upon cancellations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600/20 text-amber-400 border border-rose-600/30">
                GNWL (GENERAL WAITLIST)
              </span>
              <span className="text-xs text-amber-400 font-bold font-mono">~82% Historical Avg</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Highest clearance priority. Originating station waitlist that gets filled first as confirmed travelers cancel or quotas expire.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                RLWL (REMOTE LOCATION)
              </span>
              <span className="text-xs text-purple-400 font-bold font-mono">~54% Historical Avg</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Waitlist for intermediate originating stations. Only cleared if passengers travelling from that specific remote cluster cancel.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                PQWL (POOLED QUOTA)
              </span>
              <span className="text-xs text-rose-400 font-bold font-mono">~38% Historical Avg</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Shared between multiple smaller intermediate stations. Has lower clearance priority compared to primary GNWL passengers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                TQWL (TATKAL WAITLIST)
              </span>
              <span className="text-xs text-rose-400 font-bold font-mono">~14% Historical Avg</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Waitlisted Tatkal quota ticket. Does NOT get RAC; either converts directly to Confirmed or cancels automatically with full refund.
            </p>
          </div>
        </div>
      </section>

      {/* IRCTC Executive Lounges & Station Luggage Cloak Rooms */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-widest block mb-1">
              PREMIER STATION AMENITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              IRCTC Executive Lounges & Cloak Rooms
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Complimentary or subsidized entry with confirmed AC First / Executive Class tickets at top major junctions:
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold">
            24X7 PASSENGER COMFORT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">New Delhi (NDLS)</h4>
            <div className="text-xs text-amber-400 font-mono">Platform 16 (Ajmeri Gate)</div>
            <p className="text-xs text-slate-400">
              Buffet breakfast & dinner, shower suites, massage chairs, and business workstations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Howrah Junction (HWH)</h4>
            <div className="text-xs text-amber-400 font-mono">Old Complex Concourse</div>
            <p className="text-xs text-slate-400">
              Colonial heritage lounge, high-speed rail-wire optical Wi-Fi, and electronic cloak lockers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Varanasi Cantt (BSB)</h4>
            <div className="text-xs text-amber-400 font-mono">Platform 1 Executive Floor</div>
            <p className="text-xs text-slate-400">
              Spiritual relaxation zone, pre-booked luggage porter services, and vegetarian feast pantry.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Mumbai Central (MMCT)</h4>
            <div className="text-xs text-amber-400 font-mono">First Floor Main Building</div>
            <p className="text-xs text-slate-400">
              Pod hotel sleeping capsules, shower kits, and airport-style flight/train display telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Refund Tracking, Failed-Payment Recovery & Wallet Guide */}
      <section className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-1">
            MONEY-BACK PLAYBOOK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Refund Timelines, Failed Payments & Wallet Credits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Every rupee is traceable. Match your situation below to know exactly when money returns:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Normal Cancellation Refund</div>
            <p className="text-slate-400 leading-relaxed">
              Credited to the source account (UPI, card, net-banking) within <strong>3–7 working days</strong> after clerkage deduction. No action needed — the PRS auto-pushes it. SMS confirmation arrives from your bank, not the railway.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">TRACK: booking history ➔ refund status</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">Failed / Double-Charged Payment</div>
            <p className="text-slate-400 leading-relaxed">
              If money debited but no PNR generated, the gateway auto-reverses within <strong>24–72 hours</strong>. Never re-book in panic during Tatkal rush — wait for the reversal SMS, or pay via wallet balance which reverses instantly to your RailFleet wallet.
            </p>
            <div className="text-[10px] font-mono text-amber-400">TIP: wallet payments refund in minutes</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-white text-sm">RailFleet Wallet & Loyalty</div>
            <p className="text-slate-400 leading-relaxed">
              Cancellation refunds below ₹500 land instantly in your wallet for next booking. Earn <strong>1 loyalty point per ₹100</strong> of confirmed travel; 500 points unlock a ₹100 fare coupon auto-applied at checkout.
            </p>
            <div className="text-[10px] font-mono text-sky-400">BALANCE SHOWN NEXT TO YOUR NAME</div>
          </div>
        </div>
      </section>

    </div>
  );
};
