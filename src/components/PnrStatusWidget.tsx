import React, { useState } from 'react';
import { Search, Ticket, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, User, RefreshCw, FileText } from 'lucide-react';
import { Booking } from '../types/railway';
import { railwayService } from '../services/railwayService';

interface PnrStatusWidgetProps {
  onViewBookingDetails?: (booking: Booking) => void;
}

export const PnrStatusWidget: React.FC<PnrStatusWidgetProps> = ({ onViewBookingDetails }) => {
  const [pnrInput, setPnrInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPnrInput(cleaned);
    if (cleaned.length === 10) {
      setHasSearched(true);
      const found = railwayService.getBookingByPnr(cleaned);
      setSearchedBooking(found || null);
    }
  };

  const handleSearchPnr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setHasSearched(true);
    const found = railwayService.getBookingByPnr(pnrInput.trim());
    setSearchedBooking(found || null);
  };

  const handleDemoPnr = (demoPnr: string) => {
    setPnrInput(demoPnr);
    setHasSearched(true);
    const found = railwayService.getBookingByPnr(demoPnr);
    setSearchedBooking(found || null);
  };

  const recentBookings = railwayService.getAllBookings().slice(0, 3);

  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-amber-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-600/20 text-amber-300 border border-rose-600/30 uppercase tracking-wider">
                REAL-TIME CRIS PNR LOOKUP
              </span>
              <span className="text-xs text-slate-400 font-mono">10-Digit National Identifier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Live PNR Status & Chart Preparation Radar
            </h2>
          </div>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Passenger Reservation System Online</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchPnr} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-rose-600 absolute left-4 top-4" />
            <input
              type="text"
              maxLength={10}
              placeholder="Enter 10-Digit PNR Number (e.g., 2841234567)..."
              value={pnrInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-10 py-4 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20"
            />
            {pnrInput && (
              <button
                type="button"
                onClick={() => {
                  setPnrInput('');
                  setHasSearched(false);
                  setSearchedBooking(null);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-amber-400 text-white hover:text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Check Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo PNR Chips */}
        {recentBookings.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Quick Test PNRs:</span>
            {recentBookings.map((b, idx) => (
              <button
                key={`pnr-chip-${b.pnr}-${idx}`}
                type="button"
                onClick={() => handleDemoPnr(b.pnr)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-white transition-colors"
              >
                #{b.pnr} ({b.trainName.split(' ')[0]})
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Result Display Card */}
      {hasSearched && searchedBooking && (
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black font-mono text-amber-400">
                  PNR: {searchedBooking.pnr}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ● {searchedBooking.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Booked by: <strong className="text-slate-200">{searchedBooking.contactName}</strong> ({searchedBooking.contactEmail})
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="text-right">
                <span className="text-slate-500 text-[10px] block uppercase">Chart Status</span>
                <span className="text-emerald-400 font-bold">CHART PREPARED</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] block uppercase">Confirmation</span>
                <span className="text-amber-400 font-bold">100% CONFIRMED</span>
              </div>
            </div>
          </div>

          {/* Train Service & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block">Train Details</span>
              <div className="text-white font-bold text-sm mt-0.5">
                {searchedBooking.trainName} (#{searchedBooking.trainNumber})
              </div>
              <span className="text-slate-400">Coach {searchedBooking.coachCode} ({searchedBooking.coachType})</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block">Corridor & Travel Date</span>
              <div className="text-white font-bold text-sm mt-0.5">
                {searchedBooking.sourceCode} ➔ {searchedBooking.destinationCode}
              </div>
              <span className="text-amber-400">{searchedBooking.journeyDate}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase text-[10px] block">Fare Transaction</span>
              <div className="text-amber-400 font-bold text-sm mt-0.5">
                Total Paid: ₹{searchedBooking.totalAmount}
              </div>
              <span className="text-emerald-400">Lock Latency: {searchedBooking.transactionLatencyMs}ms</span>
            </div>
          </div>

          {/* Passenger Berth Allocations Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Passenger Manifest & Assigned Berths
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-4 font-sans">Passenger Legal Name</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Coach</th>
                    <th className="py-2.5 px-3">Berth No</th>
                    <th className="py-2.5 px-3">Berth Type</th>
                    <th className="py-2.5 px-3">Booking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  {searchedBooking.passengers.map((p, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-sans font-bold text-white">{p.fullName}</td>
                      <td className="py-2.5 px-3 text-slate-400">{p.age} / {p.gender}</td>
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{searchedBooking.coachCode}</td>
                      <td className="py-2.5 px-3 text-white font-bold">#{p.seatNumber}</td>
                      <td className="py-2.5 px-3 text-emerald-400">{p.berthType}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          CNF (Confirmed)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {hasSearched && !searchedBooking && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">PNR Not Found in Central Database</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No booking record exists for PNR <code>{pnrInput}</code>. Try searching with one of the quick test PNRs above or book a new ticket.
          </p>
        </div>
      )}

    </div>
  );
};
